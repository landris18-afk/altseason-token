import { useCallback } from 'react';
import { gameLevels } from '../data/gameLevels';

/**
 * usePumpLogic - Pump logika hook
 * 
 * Ez a hook kezeli a játék pump logikáját:
 * - Kattintás kezelése
 * - Market cap növelése
 * - Sub-thousand akkumulátor kezelése
 * - Desktop/mobile különbségek
 * 
 * @param {Object} gameState - Játék állapot
 * @param {Function} setGameState - Játék állapot frissítő
 * @param {number} subThousandAccumulator - Sub-thousand akkumulátor
 * @param {Function} setSubThousandAccumulator - Sub-thousand akkumulátor frissítő
 * @param {Function} playPumpSound - Pump hang lejátszó
 * @returns {Object} Pump kezelő funkciók
 */
export const usePumpLogic = (
  gameState,
  setGameState,
  subThousandAccumulator,
  setSubThousandAccumulator,
  playPumpSound
) => {
  const handlePump = useCallback(() => {
    // Maximum 5T
    if (gameState.marketCap >= 5e12) return;
    
    if (gameState.levelIndex >= gameLevels.length - 1) return;
    
    playPumpSound();
    
    const newIncrement = gameState.clickPower * (gameState.solanaBlessingLevel + 1);
    
    // Asztali nézet: fő számláló növekszik, ha 10K alatt van
    if (window.innerWidth >= 768) { // md breakpoint
      if (gameState.marketCap < 1e4) {
        setGameState(p => ({
          ...p,
          marketCap: Math.min(p.marketCap + newIncrement, 5e12),
          totalClicks: (p.totalClicks || 0) + 1
        }));
      } else {
        // 10K felett a második számláló növekszik
        const newAccumulator = subThousandAccumulator + newIncrement;
        
        // 1T felett 1B-ig gyűjtünk
        if (gameState.marketCap >= 1e12) {
          if (newAccumulator >= 1e9) {
            const billionsToAdd = Math.floor(newAccumulator / 1e9);
            const remainder = newAccumulator % 1e9;
            
            setSubThousandAccumulator(remainder);
            setGameState(p => ({
              ...p,
              marketCap: Math.min(p.marketCap + (billionsToAdd * 1e9), 5e12),
              totalClicks: (p.totalClicks || 0) + 1
            }));
          } else {
            setSubThousandAccumulator(newAccumulator);
            setGameState(p => ({
              ...p,
              totalClicks: (p.totalClicks || 0) + 1
            }));
          }
        }
        // 100M és 1T között 1M-ig gyűjtünk
        else if (gameState.marketCap >= 1e8) {
          if (newAccumulator >= 1e6) {
            const millionsToAdd = Math.floor(newAccumulator / 1e6);
            const remainder = newAccumulator % 1e6;
            
            setSubThousandAccumulator(remainder);
            setGameState(p => ({
              ...p,
              marketCap: Math.min(p.marketCap + (millionsToAdd * 1e6), 5e12),
              totalClicks: (p.totalClicks || 0) + 1
            }));
          } else {
            setSubThousandAccumulator(newAccumulator);
            setGameState(p => ({
              ...p,
              totalClicks: (p.totalClicks || 0) + 1
            }));
          }
        }
        // 1M és 100M között 100K-ig gyűjtünk
        else if (gameState.marketCap >= 1e6) {
          if (newAccumulator >= 1e5) {
            const hundredsToAdd = Math.floor(newAccumulator / 1e5);
            const remainder = newAccumulator % 1e5;
            
            setSubThousandAccumulator(remainder);
            setGameState(p => ({
              ...p,
              marketCap: Math.min(p.marketCap + (hundredsToAdd * 1e5), 5e12),
              totalClicks: (p.totalClicks || 0) + 1
            }));
          } else {
            setSubThousandAccumulator(newAccumulator);
            setGameState(p => ({
              ...p,
              totalClicks: (p.totalClicks || 0) + 1
            }));
          }
        }
        // 10K és 1M között 1000-ig gyűjtünk
        else {
          if (newAccumulator >= 1000) {
            const thousandsToAdd = Math.floor(newAccumulator / 1000);
            const remainder = newAccumulator % 1000;
            
            setSubThousandAccumulator(remainder);
            setGameState(p => ({
              ...p,
              marketCap: Math.min(p.marketCap + (thousandsToAdd * 1000), 5e12),
              totalClicks: (p.totalClicks || 0) + 1
            }));
          } else {
            setSubThousandAccumulator(newAccumulator);
            setGameState(p => ({
              ...p,
              totalClicks: (p.totalClicks || 0) + 1
            }));
          }
        }
      }
    }
    // Mobilnézet: ugyanaz a logika
    else {
      if (gameState.marketCap < 1e4) {
        setGameState(p => ({
          ...p,
          marketCap: Math.min(p.marketCap + newIncrement, 5e12),
          totalClicks: (p.totalClicks || 0) + 1
        }));
      } else {
        const newAccumulator = subThousandAccumulator + newIncrement;
        
        // 1T felett 100B-ig gyűjtünk
        if (gameState.marketCap >= 1e12) {
          if (newAccumulator >= 1e11) {
            const hundredsOfBillionsToAdd = Math.floor(newAccumulator / 1e11);
            const remainder = newAccumulator % 1e11;
            
            setSubThousandAccumulator(remainder);
            setGameState(p => ({
              ...p,
              marketCap: Math.min(p.marketCap + (hundredsOfBillionsToAdd * 1e11), 5e12),
              totalClicks: (p.totalClicks || 0) + 1
            }));
          } else {
            setSubThousandAccumulator(newAccumulator);
            setGameState(p => ({
              ...p,
              totalClicks: (p.totalClicks || 0) + 1
            }));
          }
        }
        // 1B és 1T között 100M-ig gyűjtünk
        else if (gameState.marketCap >= 1e9) {
          if (newAccumulator >= 1e8) {
            const hundredsOfMillionsToAdd = Math.floor(newAccumulator / 1e8);
            const remainder = newAccumulator % 1e8;
            
            setSubThousandAccumulator(remainder);
            setGameState(p => ({
              ...p,
              marketCap: Math.min(p.marketCap + (hundredsOfMillionsToAdd * 1e8), 5e12),
              totalClicks: (p.totalClicks || 0) + 1
            }));
          } else {
            setSubThousandAccumulator(newAccumulator);
            setGameState(p => ({
              ...p,
              totalClicks: (p.totalClicks || 0) + 1
            }));
          }
        }
        // 100M és 1B között 1M-ig gyűjtünk
        else if (gameState.marketCap >= 1e8) {
          if (newAccumulator >= 1e6) {
            const millionsToAdd = Math.floor(newAccumulator / 1e6);
            const remainder = newAccumulator % 1e6;
            
            setSubThousandAccumulator(remainder);
            setGameState(p => ({
              ...p,
              marketCap: Math.min(p.marketCap + (millionsToAdd * 1e6), 5e12),
              totalClicks: (p.totalClicks || 0) + 1
            }));
          } else {
            setSubThousandAccumulator(newAccumulator);
            setGameState(p => ({
              ...p,
              totalClicks: (p.totalClicks || 0) + 1
            }));
          }
        }
        // 1M és 100M között 100K-ig gyűjtünk
        else if (gameState.marketCap >= 1e6) {
          if (newAccumulator >= 1e5) {
            const hundredsToAdd = Math.floor(newAccumulator / 1e5);
            const remainder = newAccumulator % 1e5;
            
            setSubThousandAccumulator(remainder);
            setGameState(p => ({
              ...p,
              marketCap: Math.min(p.marketCap + (hundredsToAdd * 1e5), 5e12),
              totalClicks: (p.totalClicks || 0) + 1
            }));
          } else {
            setSubThousandAccumulator(newAccumulator);
            setGameState(p => ({
              ...p,
              totalClicks: (p.totalClicks || 0) + 1
            }));
          }
        }
        // 10K és 1M között 1000-ig gyűjtünk
        else {
          if (newAccumulator >= 1000) {
            const thousandsToAdd = Math.floor(newAccumulator / 1000);
            const remainder = newAccumulator % 1000;
            
            setSubThousandAccumulator(remainder);
            setGameState(p => ({
              ...p,
              marketCap: Math.min(p.marketCap + (thousandsToAdd * 1000), 5e12),
              totalClicks: (p.totalClicks || 0) + 1
            }));
          } else {
            setSubThousandAccumulator(newAccumulator);
            setGameState(p => ({
              ...p,
              totalClicks: (p.totalClicks || 0) + 1
            }));
          }
        }
      }
    }
  }, [gameState, subThousandAccumulator, setSubThousandAccumulator, setGameState, playPumpSound]);

  return { handlePump };
};


