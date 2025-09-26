import { useCallback } from 'react';

/**
 * useGameReset - Játék reset hook
 * 
 * Ez a hook kezeli a játék reset funkcionalitását.
 * 
 * @param {Function} setGameState - Játék állapot frissítő
 * @param {Function} setSubThousandAccumulator - Sub-thousand akkumulátor frissítő
 * @returns {Object} Reset funkciók
 */
export const useGameReset = (setGameState, setSubThousandAccumulator) => {
  // Játék reset
  const confirmReset = useCallback(() => {
    setGameState({
      marketCap: 0,
      clickPower: 1,
      passiveIncome: 0,
      upgrades: [],
      levelIndex: 0,
      solanaBlessingLevel: 0,
      hasPremiumUpgrade: false,
      minMarketCapThisLevel: 0,
      usesLeft: 0
    });
    
    setSubThousandAccumulator(0);
  }, [setGameState, setSubThousandAccumulator]);

  return {
    confirmReset
  };
};



