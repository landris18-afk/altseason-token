/**
 * useUpgradePanel.js - Upgrade panel hook
 * 
 * Ez a hook kezeli az upgrade panel állapotát:
 * - Tab váltás
 * - Modal állapotok
 * - Upgrade kattintás kezelés
 * - Force update kezelés
 */

import { useState, useEffect, useRef } from 'react';
import { useMute } from '../components/context/MuteContext';
import { 
  isUpgradeUnlocked, 
  canAffordUpgrade, 
  calculateUpgradeCost 
} from '../utils/upgradeUtils';

/**
 * useUpgradePanel - Upgrade panel hook
 * 
 * @param {Array} upgrades - Upgrade lista
 * @param {number} marketCap - Market Cap érték
 * @param {Function} buyUpgrade - Upgrade vásárlás funkció
 * @param {Object} usesLeft - Maradék használatok
 * @returns {Object} Upgrade panel állapot és funkciók
 */
export const useUpgradePanel = (upgrades, marketCap, buyUpgrade, usesLeft) => {
  // Állapot változók
  const [insufficientFundsUpgrade, setInsufficientFundsUpgrade] = useState(null);
  const [activeTab, setActiveTab] = useState('click');
  const [forceUpdate, setForceUpdate] = useState(false);
  const lastReqLevelRef = useRef({});
  const { muted: globalMuted } = useMute();

  // Reset usesLeft when marketCap is 0 (game reset)
  useEffect(() => {
    if (marketCap === 0) {
      setForceUpdate(prev => !prev);
    }
  }, [marketCap]);

  // Upgrade követelmények ellenőrzése
  useEffect(() => {
    // Végigmegyünk azokon az upgrade-eken, amelyeknek van követelménye
    for (let id = 2; id <= 6; id++) {
      const req = upgrades.find(u => u.id === id - 1);
      const upgrade = upgrades.find(u => u.id === id);
      if (!req || !upgrade || !upgrade.requirements) continue;
      const lvl = req.level;
      const last = lastReqLevelRef.current[id];
      // Csak akkor unlockolunk, ha most lépte át a requirements.level-t
      lastReqLevelRef.current[id] = lvl;
    }
  }, [upgrades]);

  // Upgrade kattintás kezelése
  const handleUpgradeClick = (upgrade) => {
    // Ellenőrizzük, hogy feloldott-e és megfizethető-e
    const isUnlocked = isUpgradeUnlocked(upgrade, usesLeft, upgrades);
    const canAfford = canAffordUpgrade(upgrade, marketCap);
    
    if (!isUnlocked || !canAfford) {
      // Ha nincs feloldva vagy nincs elég pénz, ne csináljunk semmit
      // A felhasználó látja a kis boxban a feltételeket
      return;
    }

    const cost = calculateUpgradeCost(upgrade);
    buyUpgrade(upgrade);
  };

  // Insufficient funds modal bezárása
  const handleCloseInsufficientFundsModal = () => setInsufficientFundsUpgrade(null);

  return {
    // Állapot
    insufficientFundsUpgrade,
    activeTab,
    forceUpdate,
    globalMuted,
    
    // Funkciók
    setActiveTab,
    handleUpgradeClick,
    handleCloseInsufficientFundsModal
  };
};
