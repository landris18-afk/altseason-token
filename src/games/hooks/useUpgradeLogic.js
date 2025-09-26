import { useCallback } from 'react';
import { getUpgradeCost, fixUsesLeft } from '../utils/gameUtils';
import { usePlayerSave } from './usePlayerSave';

/**
 * useUpgradeLogic - Upgrade logika hook
 * 
 * Ez a hook kezeli a játék upgrade logikáját:
 * - Upgrade vásárlás
 * - Költség ellenőrzés
 * - Használatok csökkentése
 * - Unlock hang lejátszás
 * 
 * @param {Object} gameState - Játék állapot
 * @param {Function} setGameState - Játék állapot frissítő
 * @param {Function} playUpgradeSound - Upgrade hang lejátszó
 * @param {Function} playUnlockSound - Unlock hang lejátszó
 * @returns {Object} Upgrade kezelő funkciók
 */
export const useUpgradeLogic = (
  gameState,
  setGameState,
  playUpgradeSound,
  playUnlockSound,
  subThousandAccumulator,
  setSubThousandAccumulator
) => {
  const { autoSavePlayer } = usePlayerSave();

  // Upgrade vásárlás kezelése
  const handleUpgrade = useCallback((upgrade) => {
    const cost = getUpgradeCost(upgrade);
    
    // Ellenőrizzük, hogy van-e elég pénz (marketCap + subThousandAccumulator)
    const totalAvailable = gameState.marketCap + subThousandAccumulator;
    if (totalAvailable >= cost) {
      playUpgradeSound();
      const wasLocked = !upgrade.isUnlocked;
      
      // Összesítjük a teljes egyenleget
      const totalBalance = gameState.marketCap + subThousandAccumulator;
      const newTotalBalance = totalBalance - cost;
      
      // Újraosztjuk a két részre a megjelenítés miatt
      // A logika ugyanaz, mint a pump logikában
      let newMarketCap, newSubThousandAccumulator;
      
      if (typeof window !== 'undefined' && window.innerWidth >= 768) {
        // Desktop logika
        if (newTotalBalance < 1e4) {
          newMarketCap = newTotalBalance;
          newSubThousandAccumulator = 0;
        } else {
          // 10K felett a subThousandAccumulator logikát használjuk
          if (newTotalBalance >= 1e12) {
            // 1T felett 1B-ig gyűjtünk
            const billions = Math.floor(newTotalBalance / 1e9);
            const remainder = newTotalBalance % 1e9;
            newMarketCap = billions * 1e9;
            newSubThousandAccumulator = remainder;
          } else if (newTotalBalance >= 1e8) {
            // 100M és 1T között 1M-ig gyűjtünk
            const millions = Math.floor(newTotalBalance / 1e6);
            const remainder = newTotalBalance % 1e6;
            newMarketCap = millions * 1e6;
            newSubThousandAccumulator = remainder;
          } else if (newTotalBalance >= 1e6) {
            // 1M és 100M között 100K-ig gyűjtünk
            const hundreds = Math.floor(newTotalBalance / 1e5);
            const remainder = newTotalBalance % 1e5;
            newMarketCap = hundreds * 1e5;
            newSubThousandAccumulator = remainder;
          } else {
            // 10K és 1M között 1K-ig gyűjtünk
            const thousands = Math.floor(newTotalBalance / 1000);
            const remainder = newTotalBalance % 1000;
            newMarketCap = thousands * 1000;
            newSubThousandAccumulator = remainder;
          }
        }
      } else {
        // Mobile logika
        if (newTotalBalance < 1e4) {
          newMarketCap = newTotalBalance;
          newSubThousandAccumulator = 0;
        } else {
          // 10K felett a subThousandAccumulator logikát használjuk
          if (newTotalBalance >= 1e12) {
            // 1T felett 100B-ig gyűjtünk
            const hundredsOfBillions = Math.floor(newTotalBalance / 1e11);
            const remainder = newTotalBalance % 1e11;
            newMarketCap = hundredsOfBillions * 1e11;
            newSubThousandAccumulator = remainder;
          } else if (newTotalBalance >= 1e9) {
            // 1B és 1T között 100M-ig gyűjtünk
            const hundredsOfMillions = Math.floor(newTotalBalance / 1e8);
            const remainder = newTotalBalance % 1e8;
            newMarketCap = hundredsOfMillions * 1e8;
            newSubThousandAccumulator = remainder;
          } else if (newTotalBalance >= 1e8) {
            // 100M és 1B között 1M-ig gyűjtünk
            const millions = Math.floor(newTotalBalance / 1e6);
            const remainder = newTotalBalance % 1e6;
            newMarketCap = millions * 1e6;
            newSubThousandAccumulator = remainder;
          } else if (newTotalBalance >= 1e6) {
            // 1M és 100M között 100K-ig gyűjtünk
            const hundreds = Math.floor(newTotalBalance / 1e5);
            const remainder = newTotalBalance % 1e5;
            newMarketCap = hundreds * 1e5;
            newSubThousandAccumulator = remainder;
          } else {
            // 10K és 1M között 1K-ig gyűjtünk
            const thousands = Math.floor(newTotalBalance / 1000);
            const remainder = newTotalBalance % 1000;
            newMarketCap = thousands * 1000;
            newSubThousandAccumulator = remainder;
          }
        }
      }
      
      
      // Frissítjük a gameState-t és a subThousandAccumulator-t egyszerre
      setGameState(prevState => {
        const newUses = fixUsesLeft(prevState.usesLeft);
        if (upgrade.id !== 1) {
          newUses[upgrade.id] = (typeof newUses[upgrade.id] === 'number' ? newUses[upgrade.id] : Infinity) - 1;
          if (newUses[upgrade.id] <= 0) newUses[upgrade.id] = 0;
        }
        
        return {
          ...prevState,
          marketCap: newMarketCap,
          subThousandAccumulator: newSubThousandAccumulator,
          clickPower: prevState.clickPower + (upgrade.type === 'click' ? upgrade.power : 0),
          passiveIncome: prevState.passiveIncome + (upgrade.type === 'passive' ? upgrade.power : 0),
          usesLeft: newUses,
          upgrades: prevState.upgrades.map(u =>
            u.id === upgrade.id
              ? { ...u, level: u.level + 1, isUnlocked: true }
              : u
          ),
          // minMarketCapThisLevel csak akkor változik, ha új szintre lépsz vagy ha alacsonyabb az érték
          minMarketCapThisLevel: Math.min(prevState.minMarketCapThisLevel, newMarketCap)
        };
      });
      
      if (wasLocked) {
        playUnlockSound();
      }

      // Upgrade után NEM mentünk - csak kilépéskor és szintlépéskor
    }
  }, [gameState, setGameState, playUpgradeSound, playUnlockSound, subThousandAccumulator, setSubThousandAccumulator]);

  return { handleUpgrade };
};

