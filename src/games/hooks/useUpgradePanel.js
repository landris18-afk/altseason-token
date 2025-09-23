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
  const [selectedUpgrade, setSelectedUpgrade] = useState(null);
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
    // Diamond Hands esetén ne ellenőrizzük a használatokat
    if (upgrade.id !== 1) {
      const currentUses = usesLeft[upgrade.id] ?? 0;
      
      // Ha nincs több használat, akkor lezárjuk
      if (currentUses <= 0) {
        const req = upgrades.find(x => x.id === upgrade.requirements?.upgradeId);
        setSelectedUpgrade({ upgrade, requiredUpgrade: req });
        return;
      }

      // Ha nincs feloldva, akkor lezárjuk
      if (!isUpgradeUnlocked(upgrade, usesLeft)) {
        const req = upgrades.find(x => x.id === upgrade.requirements?.upgradeId);
        setSelectedUpgrade({ upgrade, requiredUpgrade: req });
        return;
      }
    }

    const cost = calculateUpgradeCost(upgrade);
    if (canAffordUpgrade(upgrade, marketCap)) {
      buyUpgrade(upgrade);
    } else {
      setInsufficientFundsUpgrade({ upgrade, cost });
    }
  };

  // Requirements modal bezárása
  const handleCloseRequirementsModal = () => setSelectedUpgrade(null);

  // Insufficient funds modal bezárása
  const handleCloseInsufficientFundsModal = () => setInsufficientFundsUpgrade(null);

  return {
    // Állapot
    selectedUpgrade,
    insufficientFundsUpgrade,
    activeTab,
    forceUpdate,
    globalMuted,
    
    // Funkciók
    setActiveTab,
    handleUpgradeClick,
    handleCloseRequirementsModal,
    handleCloseInsufficientFundsModal
  };
};
