import { useCallback } from 'react';
import { getUpgradeCost, fixUsesLeft } from '../utils/gameUtils';

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
  // Upgrade vásárlás kezelése
  const handleUpgrade = useCallback((upgrade) => {
    const cost = getUpgradeCost(upgrade);
    if (gameState.marketCap >= cost) {
      playUpgradeSound();
      const wasLocked = !upgrade.isUnlocked;
      
      setGameState(prevState => {
        const newUses = fixUsesLeft(prevState.usesLeft);
        if (upgrade.id !== 1) {
          newUses[upgrade.id] = (typeof newUses[upgrade.id] === 'number' ? newUses[upgrade.id] : Infinity) - 1;
          if (newUses[upgrade.id] <= 0) newUses[upgrade.id] = 0;
        }
        
        return {
          ...prevState,
          marketCap: prevState.marketCap - cost,
          clickPower: prevState.clickPower + (upgrade.type === 'click' ? upgrade.power : 0),
          passiveIncome: prevState.passiveIncome + (upgrade.type === 'passive' ? upgrade.power : 0),
          usesLeft: newUses,
          upgrades: prevState.upgrades.map(u =>
            u.id === upgrade.id
              ? { ...u, level: u.level + 1, isUnlocked: true }
              : u
          ),
          minMarketCapThisLevel: prevState.marketCap - cost
        };
      });
      
      if (wasLocked) {
        playUnlockSound();
      }
    }
  }, [gameState.marketCap, setGameState, playUpgradeSound, playUnlockSound]);

  return { handleUpgrade };
};

