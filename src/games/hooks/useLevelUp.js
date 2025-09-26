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
    console.log('useLevelUp effect running:', {
      isLoaded,
      levelIndex: gameState.levelIndex,
      marketCap: gameState.marketCap,
      subThousandAccumulator: gameState.subThousandAccumulator,
      totalBalance: gameState.marketCap + (gameState.subThousandAccumulator || 0)
    });
    
    if (isLoaded) {
      // Ellenőrizzük, hogy érvényes-e a jelenlegi szint
      if (!gameLevels[gameState.levelIndex]) {
        confirmReset();
        return;
      }

      const currentLevel = gameLevels[gameState.levelIndex];
      const nextLevel = gameLevels[gameState.levelIndex + 1];
      
      console.log('Level up check:', {
        levelIndex: gameState.levelIndex,
        currentLevel: currentLevel,
        nextLevel: nextLevel,
        totalBalance: gameState.marketCap + (gameState.subThousandAccumulator || 0)
      });
      
      // Csak akkor nézzük a következő szintet, ha van még következő szint
      // A teljes egyenleget használjuk (marketCap + subThousandAccumulator)
      const totalBalance = gameState.marketCap + (gameState.subThousandAccumulator || 0);
      if (nextLevel && totalBalance >= nextLevel.threshold) {
        if (levelUpSound && !muted) {
          levelUpSound.currentTime = 0;
          levelUpSound.play().catch(() => {});
        }
        setIsLevelUpModalOpen(true);
        setGameState(prevState => {
          // Számítsuk ki az új marketCap és subThousandAccumulator értékeket
          // A teljes egyenlegből kivonjuk a következő szint thresholdját
          const currentTotal = prevState.marketCap + (prevState.subThousandAccumulator || 0);
          const remainingBalance = currentTotal - nextLevel.threshold;
          
          // Ha a remainingBalance negatív, akkor nem kellene szintet lépni
          if (remainingBalance < 0) {
            console.log('Level up error: remainingBalance is negative:', remainingBalance);
            return;
          }
          
          // Debug log
          console.log('Level up debug:', {
            currentMarketCap: prevState.marketCap,
            currentSubAccumulator: prevState.subThousandAccumulator,
            currentTotal,
            nextLevelThreshold: nextLevel.threshold,
            remainingBalance,
            isDesktop: typeof window !== 'undefined' && window.innerWidth >= 768,
            currentLevel: currentLevel,
            nextLevel: nextLevel
          });
          
          // Újraosztjuk a két részre a megjelenítés miatt
          // A remainingBalance az a maradék összeg a következő szinten
          // Ezt a normál megjelenítési logika szerint kell elosztani
          let newMarketCap, newSubThousandAccumulator;
          
          if (typeof window !== 'undefined' && window.innerWidth >= 768) {
            // Desktop logika - ugyanaz, mint a pump logikában
            if (remainingBalance < 1e4) {
              newMarketCap = remainingBalance;
              newSubThousandAccumulator = 0;
            } else {
              // 10K felett a subThousandAccumulator logikát használjuk
              if (remainingBalance >= 1e12) {
                // 1T felett 1B-ig gyűjtünk
                const billions = Math.floor(remainingBalance / 1e9);
                const remainder = remainingBalance % 1e9;
                newMarketCap = billions * 1e9;
                newSubThousandAccumulator = remainder;
              } else if (remainingBalance >= 1e8) {
                // 100M és 1T között 1M-ig gyűjtünk
                const millions = Math.floor(remainingBalance / 1e6);
                const remainder = remainingBalance % 1e6;
                newMarketCap = millions * 1e6;
                newSubThousandAccumulator = remainder;
              } else if (remainingBalance >= 1e6) {
                // 1M és 100M között 100K-ig gyűjtünk
                const hundreds = Math.floor(remainingBalance / 1e5);
                const remainder = remainingBalance % 1e5;
                newMarketCap = hundreds * 1e5;
                newSubThousandAccumulator = remainder;
              } else {
                // 10K és 1M között 1K-ig gyűjtünk
                const thousands = Math.floor(remainingBalance / 1000);
                const remainder = remainingBalance % 1000;
                newMarketCap = thousands * 1000;
                newSubThousandAccumulator = remainder;
              }
            }
          } else {
            // Mobile logika
            if (remainingBalance < 1e4) {
              newMarketCap = remainingBalance;
              newSubThousandAccumulator = 0;
            } else {
              // 10K felett a subThousandAccumulator logikát használjuk
              if (remainingBalance >= 1e12) {
                // 1T felett 100B-ig gyűjtünk
                const hundredsOfBillions = Math.floor(remainingBalance / 1e11);
                const remainder = remainingBalance % 1e11;
                newMarketCap = hundredsOfBillions * 1e11;
                newSubThousandAccumulator = remainder;
              } else if (remainingBalance >= 1e9) {
                // 1B és 1T között 100M-ig gyűjtünk
                const hundredsOfMillions = Math.floor(remainingBalance / 1e8);
                const remainder = remainingBalance % 1e8;
                newMarketCap = hundredsOfMillions * 1e8;
                newSubThousandAccumulator = remainder;
              } else if (remainingBalance >= 1e8) {
                // 100M és 1B között 1M-ig gyűjtünk
                const millions = Math.floor(remainingBalance / 1e6);
                const remainder = remainingBalance % 1e6;
                newMarketCap = millions * 1e6;
                newSubThousandAccumulator = remainder;
              } else if (remainingBalance >= 1e6) {
                // 1M és 100M között 100K-ig gyűjtünk
                const hundreds = Math.floor(remainingBalance / 1e5);
                const remainder = remainingBalance % 1e5;
                newMarketCap = hundreds * 1e5;
                newSubThousandAccumulator = remainder;
              } else {
                // 10K és 1M között 1K-ig gyűjtünk
                const thousands = Math.floor(remainingBalance / 1000);
                const remainder = remainingBalance % 1000;
                newMarketCap = thousands * 1000;
                newSubThousandAccumulator = remainder;
              }
            }
          }
          
          const newState = {
            ...prevState,
            levelIndex: prevState.levelIndex + 1,
            marketCap: newMarketCap,
            subThousandAccumulator: newSubThousandAccumulator,
            minMarketCapThisLevel: newMarketCap // Az új szint aktuális értékétől indul
          };
          
          // Debug log az új értékekkel
          console.log('Level up result:', {
            newMarketCap,
            newSubThousandAccumulator,
            newTotal: newMarketCap + newSubThousandAccumulator
          });
          
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
  }, [gameState.marketCap, gameState.levelIndex, isLoaded, levelUpSound, muted, setIsLevelUpModalOpen, setGameState, confirmReset, autoSavePlayer]);
};