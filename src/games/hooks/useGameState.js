import { useState, useRef, useEffect } from 'react';
import { getInitialState } from '../data/gameData';
import { useUserState } from './useUserState';
import { useGameLoading } from './useGameLoading';
import { useGameSaving } from './useGameSaving';
import { useGameReset } from './useGameReset';
import { useSubThousandAccumulator } from './useSubThousandAccumulator';

/**
 * useGameState - Játék állapot kezelő hook
 * 
 * Ez a hook koordinálja a játék teljes állapotát a különböző specifikus hook-ok segítségével:
 * - useUserState: Clerk user állapot kezelése
 * - useGameLoading: Játék állapot betöltése
 * - useGameSaving: Játék állapot mentése
 * - useGameReset: Játék reset funkció
 * - useSubThousandAccumulator: SubThousandAccumulator kezelése
 * 
 * @returns {Object} Játék állapot és kezelő funkciók
 */
export const useGameState = () => {
  // User state hook
  const { user, isLoaded, isSignedIn, userId } = useUserState();
  
  // Játék állapot inicializálása
  const [gameState, setGameState] = useState(() => {
    const initialState = getInitialState();
    return initialState;
  });

  // Állapot változók
  const [isGameLoaded, setIsGameLoaded] = useState(false);
  const lastReqLevelRef = useRef({});
  const hasLoadedFromStorage = useRef(false);
  const saveTimeoutRef = useRef(null);
  const lastUserIdRef = useRef(null); // Utolsó bejelentkezett user ID követése
  const hasInitializedRef = useRef(false); // Kezdeti betöltés jelzője

  // SubThousandAccumulator hook
  const { subThousandAccumulator, setSubThousandAccumulator } = useSubThousandAccumulator(gameState, setGameState);

  // Game loading hook
  useGameLoading(
    user,
    setGameState,
    setIsGameLoaded,
    hasLoadedFromStorage,
    lastUserIdRef,
    hasInitializedRef
  );

  // Frissítsük az isGameLoaded állapotot, ha a gameState változik
  useEffect(() => {
    if (gameState && gameState.marketCap !== undefined) {
      setIsGameLoaded(true);
    }
  }, [gameState]);

  // Game saving hook
  const { clearUserCache } = useGameSaving(gameState, user, isGameLoaded, hasLoadedFromStorage);

  // Game reset hook
  const { confirmReset, isResetting } = useGameReset(
    user,
    setGameState,
    hasLoadedFromStorage,
    lastReqLevelRef,
    saveTimeoutRef
  );

  return {
    gameState,
    setGameState,
    isLoaded: isGameLoaded,
    isGameLoaded,
    subThousandAccumulator,
    setSubThousandAccumulator,
    lastReqLevelRef,
    confirmReset,
    clearUserCache,
    isResetting,
    isDesktop: typeof window !== 'undefined' && window.innerWidth >= 768
  };
};

