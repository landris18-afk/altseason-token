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
  playUnlockSound
) => {
  const { autoSavePlayer } = usePlayerSave();

  // Upgrade vásárlás kezelése
  const handleUpgrade = useCallback((upgrade, subThousandAccumulator, setSubThousandAccumulator) => {
    const cost = getUpgradeCost(upgrade);
    
    // Ellenőrizzük, hogy van-e elég pénz (marketCap + subThousandAccumulator)
    const totalAvailable = gameState.marketCap + subThousandAccumulator;
    if (totalAvailable >= cost) {
      playUpgradeSound();
      const wasLocked = !upgrade.isUnlocked;
      
      // Először a subThousandAccumulator-ból vonjuk le, ha van
      let remainingCost = cost;
      let newSubThousandAccumulator = subThousandAccumulator;
      let newMarketCap = gameState.marketCap;
      
      if (subThousandAccumulator > 0) {
        if (subThousandAccumulator >= remainingCost) {
          // Ha a subThousandAccumulator elég, akkor csak azt csökkentjük
          newSubThousandAccumulator = subThousandAccumulator - remainingCost;
          remainingCost = 0;
        } else {
          // Ha nem elég, akkor a subThousandAccumulator-t nullázzuk és a maradékot a marketCap-ból vonjuk le
          remainingCost = remainingCost - subThousandAccumulator;
          newSubThousandAccumulator = 0;
        }
      }
      
      // Ha még mindig van költség, akkor a marketCap-ból vonjuk le
      if (remainingCost > 0) {
        newMarketCap = gameState.marketCap - remainingCost;
      }
      
      // Frissítjük a subThousandAccumulator-t
      setSubThousandAccumulator(newSubThousandAccumulator);
      
      setGameState(prevState => {
        const newUses = fixUsesLeft(prevState.usesLeft);
        if (upgrade.id !== 1) {
          newUses[upgrade.id] = (typeof newUses[upgrade.id] === 'number' ? newUses[upgrade.id] : Infinity) - 1;
          if (newUses[upgrade.id] <= 0) newUses[upgrade.id] = 0;
        }
        
        return {
          ...prevState,
          marketCap: newMarketCap,
          clickPower: prevState.clickPower + (upgrade.type === 'click' ? upgrade.power : 0),
          passiveIncome: prevState.passiveIncome + (upgrade.type === 'passive' ? upgrade.power : 0),
          usesLeft: newUses,
          upgrades: prevState.upgrades.map(u =>
            u.id === upgrade.id
              ? { ...u, level: u.level + 1, isUnlocked: true }
              : u
          ),
          minMarketCapThisLevel: newMarketCap
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

