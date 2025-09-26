import { useMemo } from 'react';

/**
 * useGameShare - Játék share hook
 * 
 * Ez a hook kezeli a játék share funkcionalitását.
 * 
 * @param {Object} gameState - Játék állapot
 * @returns {Object} Share funkciók
 */
export const useGameShare = (gameState) => {
  // Twitter share URL
  const twitterUrl = useMemo(() => {
    const marketCap = gameState.marketCap || 0;
    const level = gameState.levelIndex || 0;
    
    const text = `I just pumped my market cap to $${marketCap.toLocaleString()} and reached level ${level} in Bull Run Clicker! 🚀`;
    const url = 'https://bullrunclicker.com';
    
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  }, [gameState.marketCap, gameState.levelIndex]);

  return {
    twitterUrl
  };
};




