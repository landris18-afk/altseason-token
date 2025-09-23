import { useEffect } from 'react';
import { gameLevels } from '../data/gameLevels';

/**
 * useLevelUp - Szintlépés hook
 * 
 * Ez a hook kezeli a játék szintlépés logikáját:
 * - Szintlépés ellenőrzése
 * - Level up modal megjelenítése
 * - Hang lejátszás
 * - Érvénytelen szintek kezelése
 * 
 * @param {Object} gameState - Játék állapot
 * @param {Function} setGameState - Játék állapot frissítő
 * @param {boolean} isLoaded - Betöltött állapot flag
 * @param {Audio} levelUpSound - Level up hang
 * @param {boolean} muted - Némított állapot
 * @param {Function} setIsLevelUpModalOpen - Level up modal állapot beállító
 * @param {Function} confirmReset - Reset megerősítő
 */
export const useLevelUp = (
  gameState,
  setGameState,
  isLoaded,
  levelUpSound,
  muted,
  setIsLevelUpModalOpen,
  confirmReset
) => {
  // Szintlépés kezelése
  useEffect(() => {
    if (isLoaded) {
      // Ellenőrizzük, hogy érvényes-e a jelenlegi szint
      if (!gameLevels[gameState.levelIndex]) {
        confirmReset();
        return;
      }

      const currentLevel = gameLevels[gameState.levelIndex];
      const nextLevel = gameLevels[gameState.levelIndex + 1];
      
      // Csak akkor nézzük a következő szintet, ha van még következő szint
      if (nextLevel && gameState.marketCap >= nextLevel.threshold) {
        if (levelUpSound && !muted) {
          levelUpSound.currentTime = 0;
          levelUpSound.play().catch(error => console.log('Audio playback failed:', error));
        }
        setIsLevelUpModalOpen(true);
        setGameState(prevState => ({
          ...prevState,
          levelIndex: prevState.levelIndex + 1,
          minMarketCapThisLevel: nextLevel.threshold // A következő szint thresholdjától indul
        }));
      }
    }
  }, [gameState.marketCap, gameState.levelIndex, isLoaded, levelUpSound, muted, setIsLevelUpModalOpen, setGameState, confirmReset]);
};

