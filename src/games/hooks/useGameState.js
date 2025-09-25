import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { getInitialState } from '../data/gameData';
import { fixUsesLeft } from '../utils/gameUtils';
import { usePlayerSave } from './usePlayerSave';

/**
 * useGameState - Játék állapot kezelő hook
 * 
 * Ez a hook kezeli a játék teljes állapotát:
 * - Kezdő állapot betöltése
 * - Mentett állapot visszaállítása
 * - Állapot mentése localStorage-ba
 * - Játék reset funkció
 * 
 * @returns {Object} Játék állapot és kezelő funkciók
 */
export const useGameState = () => {
  // Clerk user hook - try-catch wrapper
  let user, isLoaded, isSignedIn;
  try {
    const clerkData = useUser();
    user = clerkData.user;
    isLoaded = clerkData.isLoaded;
    isSignedIn = clerkData.isSignedIn;
  } catch (error) {
    console.error('Clerk error in useGameState:', error);
    user = null;
    isLoaded = true;
    isSignedIn = false;
  }

  // Player save hook
  const { autoSavePlayer } = usePlayerSave();
  
  // Játék állapot inicializálása
  const [gameState, setGameState] = useState(() => {
    const initialState = getInitialState();
    return initialState;
  });

  // Állapot változók
  const [isGameLoaded, setIsGameLoaded] = useState(false);
  const [subThousandAccumulator, setSubThousandAccumulator] = useState(0);
  const lastReqLevelRef = useRef({});
  const hasLoadedFromStorage = useRef(false);
  const saveTimeoutRef = useRef(null);

  // Mentett állapot betöltése
  useEffect(() => {
    const loadGameState = () => {
    if (typeof window !== 'undefined') {
        // Ha van bejelentkezett user, akkor user-specifikus állapot
        const userId = user?.id;
        const storageKey = userId ? `bullRunGameState_${userId}` : 'bullRunGameState_v3';
        const savedState = localStorage.getItem(storageKey);
        
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
            const initialState = getInitialState();
          const fixedUsesLeft = fixUsesLeft(parsed.usesLeft);
            const mergedUpgrades = initialState.upgrades.map(init => {
              const savedUpgrade = parsed.upgrades && parsed.upgrades.find(u => u.id === init.id);
              const usesLeft = fixedUsesLeft[init.id];
            return {
                ...init,
              ...savedUpgrade,
                isUnlocked: init.id === 1 || (typeof usesLeft === 'number' && usesLeft > 0)
            };
          });
            const newGameState = {
              ...initialState,
            ...parsed,
            usesLeft: fixedUsesLeft,
            upgrades: mergedUpgrades,
            minMarketCapThisLevel: parsed.minMarketCapThisLevel ?? parsed.marketCap ?? 0
          };
            setGameState(newGameState);
            hasLoadedFromStorage.current = true;
        } catch (e) {
          console.error('Hiba a mentett állapot betöltésekor:', e);
          }
        } else {
          // Ha nincs mentett állapot, akkor is beállítjuk az isGameLoaded-et true-ra
          setIsGameLoaded(true);
        }
      } else {
        // Ha nincs user.id, akkor is beállítjuk az isGameLoaded-et true-ra
        setIsGameLoaded(true);
      }
    };

    // Add a small delay to ensure everything is properly initialized
    const timer = setTimeout(loadGameState, 100);
    return () => clearTimeout(timer);
  }, [user?.id]);

  // Minden esetben beállítjuk az isGameLoaded-et true-ra, ha nincs user.id
  useEffect(() => {
    if (!user?.id && typeof window !== 'undefined') {
      setIsGameLoaded(true);
    }
  }, [user?.id]);

  // Figyeljük a bejelentkezési állapot változását
  useEffect(() => {
    if (isLoaded && isSignedIn && user?.id) {
      // Kis késleltetés a Clerk inicializálásához
      const timer = setTimeout(() => {
        const storageKey = `bullRunGameState_${user.id}`;
        const savedState = localStorage.getItem(storageKey);
        
        if (savedState) {
          try {
            const parsed = JSON.parse(savedState);
      const initialState = getInitialState();
      const fixedUsesLeft = fixUsesLeft(parsed.usesLeft);
      const mergedUpgrades = initialState.upgrades.map(init => {
        const savedUpgrade = parsed.upgrades && parsed.upgrades.find(u => u.id === init.id);
        const usesLeft = fixedUsesLeft[init.id];
        return {
          ...init,
          ...savedUpgrade,
          isUnlocked: init.id === 1 || (typeof usesLeft === 'number' && usesLeft > 0)
        };
      });
            const newGameState = {
        ...initialState,
        ...parsed,
        usesLeft: fixedUsesLeft,
        upgrades: mergedUpgrades,
        minMarketCapThisLevel: parsed.minMarketCapThisLevel ?? parsed.marketCap ?? 0
            };
            setGameState(newGameState);
            hasLoadedFromStorage.current = true;
            setIsGameLoaded(true);
          } catch (e) {
            console.error('Hiba a bejelentkezés utáni állapot betöltésekor:', e);
          }
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isLoaded, isSignedIn, user?.id]);

  // Frissítsük az isGameLoaded állapotot a bejelentkezés után
  useEffect(() => {
    if (isLoaded && isSignedIn && user?.id && gameState.marketCap !== undefined) {
      setIsGameLoaded(true);
    }
  }, [isLoaded, isSignedIn, user?.id, gameState.marketCap]);

  // Frissítsük az isGameLoaded állapotot, ha a gameState változik
  useEffect(() => {
    if (gameState && gameState.marketCap !== undefined) {
      setIsGameLoaded(true);
    }
  }, [gameState]);

  // Állapot mentése localStorage-ba (debounced)
  useEffect(() => {
    if (isGameLoaded && hasLoadedFromStorage.current) {
      // Clear previous timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Set new timeout for saving
      saveTimeoutRef.current = setTimeout(() => {
        const userId = user?.id;
        const storageKey = userId ? `bullRunGameState_${userId}` : 'bullRunGameState_v3';
        localStorage.setItem(storageKey, JSON.stringify(gameState));
        
      }, 500); // 500ms debounce
    }
    
    // Cleanup timeout on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [gameState, isGameLoaded, user?.id]);

  // Automatikus játékos mentés (pl. level up-kor vagy nagyobb marketCap-nél)
  useEffect(() => {
    if (!gameState || !isGameLoaded || !user) return;
    
    // Mentjük a játékost ha elérte az 1 dollárt (1 marketCap)
    const shouldAutoSave = gameState.marketCap >= 1;
    
    if (shouldAutoSave) {
      // Debounce: csak 2 másodpercenként mentünk
      const timeoutId = setTimeout(() => {
        autoSavePlayer(gameState).then(result => {
          if (result.success) {
            console.log('Auto-saved player to leaderboard');
          }
        }).catch(error => {
          console.error('Auto-save failed:', error);
        });
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [gameState?.marketCap, gameState?.levelIndex, isGameLoaded, user, autoSavePlayer]);

  // Játék reset funkció
  const confirmReset = async (onResetComplete) => {
    const userId = user?.id;
    const storageKey = userId ? `bullRunGameState_${userId}` : 'bullRunGameState_v3';
    localStorage.removeItem(storageKey);
    
    // Clear save timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Mentjük a játékos eredményét a reset előtt
    try {
      await autoSavePlayer(gameState);
      console.log('Player data saved before reset');
    } catch (error) {
      console.error('Failed to save player data before reset:', error);
    }
    
    // Reset the loaded flag
    hasLoadedFromStorage.current = false;
    const initialState = getInitialState();
    setGameState({
      ...initialState,
      levelIndex: 0,
      marketCap: 0,
      totalClicks: 0,
      clickPower: 1,
      passiveIncome: 0,
      solanaBlessingLevel: 0,
      hasPremiumUpgrade: false,
      usesLeft: {
        1: Infinity, // Diamond Hands: végtelen
        2: 0, // Bull's Strength: lezárva
        3: 0, // Moon Shot: lezárva
        4: 0, // Shill Army: lezárva
        5: 0, // FOMO Generator: lezárva
        6: 0 // Whale Magnet: lezárva
      },
      upgrades: initialState.upgrades.map(upgrade => ({
        ...upgrade,
        level: 0,
        isUnlocked: upgrade.id === 1 // Csak a Diamond Hands legyen feloldva
      })),
      minMarketCapThisLevel: 0
    });
    
    // Reseteljük a lastReqLevelRef-et is
    Object.keys(lastReqLevelRef.current).forEach(key => {
      lastReqLevelRef.current[key] = undefined;
    });
    
    // Visszahívás a reset befejezésére
    if (onResetComplete) {
      onResetComplete();
    }
  };

  return {
    gameState,
    setGameState,
    isLoaded: isGameLoaded,
    isGameLoaded,
    subThousandAccumulator,
    setSubThousandAccumulator,
    lastReqLevelRef,
    confirmReset,
    isDesktop: typeof window !== 'undefined' && window.innerWidth >= 768
  };
};

