import { useEffect } from 'react';

/**
 * usePassiveIncome - Passzív jövedelem hook
 * 
 * Ez a hook kezeli a játék passzív jövedelmét:
 * - Automatikus jövedelem generálás
 * - Desktop/mobile különbségek
 * - Sub-thousand akkumulátor kezelése
 * 
 * @param {Object} gameState - Játék állapot
 * @param {Function} setGameState - Játék állapot frissítő
 * @param {number} subThousandAccumulator - Sub-thousand akkumulátor
 * @param {Function} setSubThousandAccumulator - Sub-thousand akkumulátor frissítő
 * @param {boolean} isDesktop - Desktop nézet flag
 */
export const usePassiveIncome = (
  gameState,
  setGameState,
  subThousandAccumulator,
  setSubThousandAccumulator,
  isDesktop
) => {
  // Passzív jövedelem kezelése
  useEffect(() => {
    if (gameState.passiveIncome > 0 || gameState.clickPower > 1) {
      const incomeInterval = setInterval(() => {
        setGameState(prevState => {
          const multiplier = prevState.solanaBlessingLevel + 1;
          const incomeToAdd = prevState.passiveIncome * multiplier;

          let newMarketCap = prevState.marketCap;
          let newSubAccumulator = subThousandAccumulator;

          if (typeof window !== 'undefined' && window.innerWidth >= 768) {
            // Desktop logika
            if (prevState.marketCap < 1e6) {
              newMarketCap = Math.min(prevState.marketCap + incomeToAdd, 5e12);
            } else {
              newSubAccumulator += incomeToAdd;
              if (prevState.marketCap >= 1e12) {
                if (newSubAccumulator >= 1e9) {
                  const billionsToAdd = Math.floor(newSubAccumulator / 1e9);
                  newSubAccumulator = newSubAccumulator % 1e9;
                  newMarketCap = Math.min(prevState.marketCap + (billionsToAdd * 1e9), 5e12);
                }
              } else if (prevState.marketCap >= 1e8) {
                if (newSubAccumulator >= 1e6) {
                  const millionsToAdd = Math.floor(newSubAccumulator / 1e6);
                  newSubAccumulator = newSubAccumulator % 1e6;
                  newMarketCap = Math.min(prevState.marketCap + (millionsToAdd * 1e6), 5e12);
                }
              } else {
                if (newSubAccumulator >= 1e5) {
                  const hundredsToAdd = Math.floor(newSubAccumulator / 1e5);
                  newSubAccumulator = newSubAccumulator % 1e5;
                  newMarketCap = Math.min(prevState.marketCap + (hundredsToAdd * 1e5), 5e12);
                }
              }
            }
          } else {
            // Mobile logika
            if (prevState.marketCap < 1e4) {
              newMarketCap = Math.min(prevState.marketCap + incomeToAdd, 5e12);
            } else {
              newSubAccumulator += incomeToAdd;
              if (prevState.marketCap >= 1e12) {
                if (newSubAccumulator >= 1e11) {
                  const hundredsOfBillionsToAdd = Math.floor(newSubAccumulator / 1e11);
                  newSubAccumulator = newSubAccumulator % 1e11;
                  newMarketCap = Math.min(prevState.marketCap + (hundredsOfBillionsToAdd * 1e11), 5e12);
                }
              } else if (prevState.marketCap >= 1e9) {
                if (newSubAccumulator >= 1e8) {
                  const hundredsOfMillionsToAdd = Math.floor(newSubAccumulator / 1e8);
                  newSubAccumulator = newSubAccumulator % 1e8;
                  newMarketCap = Math.min(prevState.marketCap + (hundredsOfMillionsToAdd * 1e8), 5e12);
                }
              } else if (prevState.marketCap >= 1e8) {
                if (newSubAccumulator >= 1e6) {
                  const millionsToAdd = Math.floor(newSubAccumulator / 1e6);
                  newSubAccumulator = newSubAccumulator % 1e6;
                  newMarketCap = Math.min(prevState.marketCap + (millionsToAdd * 1e6), 5e12);
                }
              } else if (prevState.marketCap >= 1e6) {
                if (newSubAccumulator >= 1e5) {
                  const hundredsToAdd = Math.floor(newSubAccumulator / 1e5);
                  newSubAccumulator = newSubAccumulator % 1e5;
                  newMarketCap = Math.min(prevState.marketCap + (hundredsToAdd * 1e5), 5e12);
                }
              } else {
                if (newSubAccumulator >= 1000) {
                  const thousandsToAdd = Math.floor(newSubAccumulator / 1000);
                  newSubAccumulator = newSubAccumulator % 1000;
                  newMarketCap = Math.min(prevState.marketCap + (thousandsToAdd * 1000), 5e12);
                }
              }
            }
          }
          
          setSubThousandAccumulator(newSubAccumulator);
          return { ...prevState, marketCap: newMarketCap };
        });
      }, 1000);
      return () => clearInterval(incomeInterval);
    }
  }, [gameState.passiveIncome, gameState.solanaBlessingLevel, gameState.clickPower, subThousandAccumulator, isDesktop, setGameState, setSubThousandAccumulator]);
};