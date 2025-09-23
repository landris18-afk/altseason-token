import { useState, useEffect, useRef } from 'react';
import { getInitialState } from '../data/gameData';
import { fixUsesLeft } from '../utils/gameUtils';

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
  // Játék állapot inicializálása
  const [gameState, setGameState] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('bullRunGameState_v3');
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          const fixedUsesLeft = fixUsesLeft(parsed.usesLeft);
          const mergedUpgrades = parsed.upgrades.map(upgrade => {
            const savedUpgrade = parsed.upgrades && parsed.upgrades.find(u => u.id === upgrade.id);
            const usesLeft = fixedUsesLeft[upgrade.id];
            return {
              ...upgrade,
              ...savedUpgrade,
              isUnlocked: upgrade.id === 1 || (typeof usesLeft === 'number' && usesLeft > 0)
            };
          });
          return {
            ...parsed,
            usesLeft: fixedUsesLeft,
            upgrades: mergedUpgrades,
            minMarketCapThisLevel: parsed.minMarketCapThisLevel ?? parsed.marketCap ?? 0
          };
        } catch (e) {
          console.error('Hiba a mentett állapot betöltésekor:', e);
        }
      }
    }
    return getInitialState();
  });

  // Állapot változók
  const [isLoaded, setIsLoaded] = useState(false);
  const [subThousandAccumulator, setSubThousandAccumulator] = useState(0);
  const lastReqLevelRef = useRef({});

  // Mentett állapot betöltése
  useEffect(() => {
    const saved = localStorage.getItem('bullRunGameState_v3');
    if (saved) {
      const parsed = JSON.parse(saved);
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
      setGameState({
        ...initialState,
        ...parsed,
        usesLeft: fixedUsesLeft,
        upgrades: mergedUpgrades,
        minMarketCapThisLevel: parsed.minMarketCapThisLevel ?? parsed.marketCap ?? 0
      });
    }
    setIsLoaded(true);
  }, []);

  // Állapot mentése localStorage-ba
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('bullRunGameState_v3', JSON.stringify(gameState));
    }
  }, [gameState, isLoaded]);

  // Játék reset funkció
  const confirmReset = (onResetComplete) => {
    localStorage.removeItem('bullRunGameState_v3');
    localStorage.removeItem('bullRunPlayerName'); // Játékos név törlése
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
    isLoaded,
    subThousandAccumulator,
    setSubThousandAccumulator,
    lastReqLevelRef,
    confirmReset
  };
};

