/**
 * UpgradeList.js - Upgrade lista komponens
 * 
 * Ez a komponens megjeleníti az upgrade-ek listáját:
 * - Click upgrade-ek
 * - Passive upgrade-ek
 * - Upgrade kártyák renderelése
 */

import React from 'react';
import UpgradeCard from './UpgradeCard';
import { getUpgradeCategories } from '../../utils/upgradeUtils';

/**
 * UpgradeList - Upgrade lista komponens
 * 
 * @param {Object} props - Props objektum
 * @param {Array} props.upgrades - Upgrade lista
 * @param {string} props.activeTab - Aktív tab
 * @param {Object} props.usesLeft - Maradék használatok
 * @param {number} props.marketCap - Market Cap érték
 * @param {Function} props.onUpgradeClick - Upgrade kattintás kezelő
 * @param {Function} props.getNextLevelUses - Következő szint használatok
 * @returns {JSX.Element} Upgrade lista komponens
 */
const UpgradeList = ({ 
  upgrades, 
  activeTab, 
  usesLeft, 
  marketCap, 
  onUpgradeClick, 
  getNextLevelUses 
}) => {
  const { click, passive } = getUpgradeCategories(upgrades);
  const currentUpgrades = activeTab === 'click' ? click : passive;

  return (
    <div className="space-y-4 pb-2">
      {currentUpgrades.map((upgrade, index) => (
        <UpgradeCard
          key={upgrade.id}
          upgrade={upgrade}
          usesLeft={usesLeft}
          marketCap={marketCap}
          onClick={onUpgradeClick}
          getNextLevelUses={getNextLevelUses}
          isLast={index === currentUpgrades.length - 1}
          allUpgrades={upgrades}
        />
      ))}
    </div>
  );
};

export default UpgradeList;
