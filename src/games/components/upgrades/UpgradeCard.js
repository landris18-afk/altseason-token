/**
 * UpgradeCard.js - Upgrade kártya komponens
 * 
 * Ez a komponens egy egyedi upgrade kártyát jelenít meg:
 * - Upgrade információk
 * - Ár és szint megjelenítés
 * - Lock/unlock állapot
 * - Kattintás kezelés
 */

import React from 'react';
import { FaBolt, FaLock } from 'react-icons/fa';
import { 
  isUpgradeUnlocked, 
  canAffordUpgrade, 
  calculateUpgradeCost,
  formatUpgradeDescription 
} from '../../utils/upgradeUtils';

/**
 * UpgradeCard - Upgrade kártya komponens
 * 
 * @param {Object} props - Props objektum
 * @param {Object} props.upgrade - Upgrade objektum
 * @param {Object} props.usesLeft - Maradék használatok
 * @param {number} props.marketCap - Market Cap érték
 * @param {Function} props.onClick - Kattintás kezelő
 * @param {Function} props.getNextLevelUses - Következő szint használatok
 * @param {boolean} props.isLast - Utolsó elem-e a listában
 * @returns {JSX.Element} Upgrade kártya komponens
 */
const UpgradeCard = ({ 
  upgrade, 
  usesLeft, 
  marketCap, 
  onClick, 
  getNextLevelUses,
  isLast = false,
  allUpgrades = []
}) => {
  const isUnlocked = isUpgradeUnlocked(upgrade, usesLeft, allUpgrades);
  const canAfford = canAffordUpgrade(upgrade, marketCap);
  const cost = calculateUpgradeCost(upgrade);
  const isDisabled = !isUnlocked || !canAfford;

  return (
    <div className={`flex justify-between items-center ${isLast ? 'mb-6' : ''}`}>
      <button
        onClick={() => onClick(upgrade)}
        disabled={isDisabled}
        className={`w-full group transition-all duration-300 ${
          !isUnlocked ? 'opacity-50 cursor-not-allowed' : 
          canAfford ? 'hover:scale-105' : 'opacity-70'
        }`}
      >
        <div className={`bg-gray-800/50 rounded-xl p-4 border-2 ${
          !isUnlocked ? 'border-gray-700' : 
          canAfford ? 'border-yellow-500/50 group-hover:border-yellow-500' : 'border-gray-600'
        } transition-all duration-300 group-hover:shadow-lg group-hover:shadow-yellow-500/25`}>
          <div className="flex items-start justify-between gap-3">
            {/* Bal oldal - Upgrade információk */}
            <div className="flex-1 min-w-0 space-y-1">
              <p className="flex items-center text-lg font-bold text-left">
                {!isUnlocked ? (
                  <>
                    <FaLock className="mr-2 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-400 truncate">{upgrade.name}</span>
                  </>
                ) : (
                  <>
                    <FaBolt className="mr-2 text-yellow-300 transition-transform duration-300 group-hover:scale-125 flex-shrink-0" />
                    <span className="text-white truncate">{upgrade.name}</span>
                  </>
                )}
              </p>
              <p className="text-sm text-gray-400 leading-tight text-left pl-4">
                {formatUpgradeDescription(upgrade.description)}
              </p>
              {!isUnlocked && upgrade.requirements && (() => {
                const requiredUpgrade = allUpgrades.find(u => u.id === upgrade.requirements.upgradeId);
                const requiredLevel = upgrade.requirements.level;
                const currentLevel = requiredUpgrade ? requiredUpgrade.level : 0;
                
                return (
                  <p className="text-xs text-yellow-400 leading-tight text-left pl-4">
                    * {requiredUpgrade?.name || 'Unknown'} Level {currentLevel}/{requiredLevel}
                  </p>
                );
              })()}
            </div>
            
            {/* Jobb oldal - Ár és szint információk */}
            <div className="flex flex-col items-end min-w-[80px] flex-shrink-0">
              <span className="text-lg font-bold text-gray-100">
                ${cost.toLocaleString('en-US')}
              </span>
              <div className="flex flex-row gap-2 mt-1">
                <span className="text-xs text-gray-400">Lvl {upgrade.level}</span>
                <span className="text-xs text-gray-500">
                  {[1,2,3,4,7,8].includes(upgrade.id) ? 'infinite' : `${usesLeft[upgrade.id] ?? 0}/${getNextLevelUses(upgrade.id)}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default UpgradeCard;
