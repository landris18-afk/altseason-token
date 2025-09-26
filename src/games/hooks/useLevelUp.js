import { useEffect } from 'react';
import { gameLevels } from '../data/gameLevels';
import { usePlayerSave } from './usePlayerSave';

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
  const { autoSavePlayer } = usePlayerSave();
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
          levelUpSound.play().catch(() => {});
        }
        setIsLevelUpModalOpen(true);
        setGameState(prevState => {
          const newState = {
            ...prevState,
            levelIndex: prevState.levelIndex + 1,
            minMarketCapThisLevel: nextLevel.threshold // A következő szint thresholdjától indul
          };
          
          // Szintlépés után mentés az adatbázisba
          setTimeout(() => {
            autoSavePlayer(newState).then(result => {
              if (result.success) {
                console.log('🎉 Auto-saved player after level up to level:', newState.levelIndex);
              }
            }).catch(error => {
              console.error('Auto-save failed after level up:', error);
            });
          }, 1000); // 1 másodperc késleltetés hogy a state frissüljön
          
          return newState;
        });
      }
    }
  }, [gameState.marketCap, gameState.levelIndex, isLoaded, levelUpSound, muted, setIsLevelUpModalOpen, setGameState, confirmReset]);
};