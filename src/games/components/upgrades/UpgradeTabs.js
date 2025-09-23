/**
 * UpgradeTabs.js - Upgrade tab kezelő komponens
 * 
 * Ez a komponens kezeli az upgrade tab váltást:
 * - Click Power tab
 * - MC/Second tab
 * - Aktív tab kiemelése
 * - Elérhető upgrade-ek száma jelzés
 */

import React from 'react';
import { getUpgradeCategories, isUpgradeUnlocked, canAffordUpgrade } from '../../utils/upgradeUtils';

/**
 * UpgradeTabs - Upgrade tab kezelő komponens
 * 
 * @param {Object} props - Props objektum
 * @param {string} props.activeTab - Aktív tab
 * @param {Function} props.setActiveTab - Tab váltó funkció
 * @param {Array} props.upgrades - Upgrade lista
 * @param {Object} props.usesLeft - Maradék használatok
 * @param {number} props.marketCap - Market Cap érték
 * @returns {JSX.Element} Tab kezelő komponens
 */
const UpgradeTabs = ({ activeTab, setActiveTab, upgrades, usesLeft, marketCap }) => {
  // Elérhető upgrade-ek számának kiszámítása
  const availableClickUpgrades = upgrades ? getUpgradeCategories(upgrades).click.filter(upgrade => 
    isUpgradeUnlocked(upgrade, usesLeft) && canAffordUpgrade(upgrade, marketCap)
  ).length : 0;
  
  const availablePassiveUpgrades = upgrades ? getUpgradeCategories(upgrades).passive.filter(upgrade => 
    isUpgradeUnlocked(upgrade, usesLeft) && canAffordUpgrade(upgrade, marketCap)
  ).length : 0;
  return (
    <div className="flex space-x-2 mb-4">
      <button
        onClick={() => setActiveTab('click')}
        className={`relative flex-1 py-2 px-2 sm:px-4 rounded-lg font-bold transition-all text-sm sm:text-base ${
          activeTab === 'click' ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-yellow-500/50'
        }`}
      >
        Click Power
        {availableClickUpgrades > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {availableClickUpgrades}
          </span>
        )}
      </button>
      <button
        onClick={() => setActiveTab('passive')}
        className={`relative flex-1 py-2 px-2 sm:px-4 rounded-lg font-bold transition-all text-sm sm:text-base ${
          activeTab === 'passive' ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-yellow-500/50'
        }`}
      >
        MC/Second
        {availablePassiveUpgrades > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {availablePassiveUpgrades}
          </span>
        )}
      </button>
    </div>
  );
};

export default UpgradeTabs;
