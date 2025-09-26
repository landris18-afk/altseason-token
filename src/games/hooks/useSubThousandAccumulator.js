import { useCallback } from 'react';

/**
 * useSubThousandAccumulator - SubThousandAccumulator kezelő hook
 * 
 * Ez a hook kezeli a subThousandAccumulator állapotát, amely a játékban
 * a fő market cap mellett megjelenő második számláló.
 * 
 * @param {Object} gameState - A játék állapota
 * @param {Function} setGameState - A játék állapot frissítő függvény
 * @returns {Object} SubThousandAccumulator érték és setter
 */
export const useSubThousandAccumulator = (gameState, setGameState) => {
  // Helper függvény a subThousandAccumulator frissítéséhez
  const setSubThousandAccumulator = useCallback((value) => {
    setGameState(prevState => ({
      ...prevState,
      subThousandAccumulator: value
    }));
  }, [setGameState]);

  return {
    subThousandAccumulator: gameState.subThousandAccumulator || 0,
    setSubThousandAccumulator
  };
};
