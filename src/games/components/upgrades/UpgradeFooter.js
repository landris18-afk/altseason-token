/**
 * UpgradeFooter.js - Upgrade panel footer komponens
 * 
 * Ez a komponens megjeleníti az upgrade panel footer-ét:
 * - Click Power érték
 * - MC/Second érték
 * - Premium upgrade kiemelése
 */

import React from 'react';
import { fmt } from '../../utils/upgradeUtils';

/**
 * UpgradeFooter - Upgrade panel footer komponens
 * 
 * @param {Object} props - Props objektum
 * @param {number} props.clickPower - Click power érték
 * @param {number} props.passiveIncome - Passzív jövedelem
 * @param {boolean} props.hasPremiumUpgrade - Premium upgrade flag
 * @param {number} props.marketCap - Market Cap (egyenleg)
 * @returns {JSX.Element} Footer komponens
 */
const UpgradeFooter = ({ clickPower, passiveIncome, hasPremiumUpgrade, marketCap }) => {
  const displayedPassiveIncome = hasPremiumUpgrade ? passiveIncome * 10 : passiveIncome;

  return (
    <div className="pt-3 pb-3 text-center">
      <div className="flex justify-around gap-2">
        <div className="flex-1">
          <p className="text-gray-400 text-xs sm:text-sm">Balance</p>
          <p className="font-bold text-yellow-400 text-base sm:text-lg">
            ${fmt(marketCap)}
          </p>
        </div>
        <div className="flex-1">
          <p className="text-gray-400 text-xs sm:text-sm">MC / Click</p>
          <p className="font-bold text-white text-base sm:text-lg">
            ${fmt(clickPower)}
          </p>
        </div>
        <div className="flex-1">
          <p className="text-gray-400 text-xs sm:text-sm">MC / Second</p>
          <p className={`font-bold text-base sm:text-lg transition-colors ${
            hasPremiumUpgrade ? 'text-purple-400' : 'text-white'
          }`}>
            ${fmt(displayedPassiveIncome)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradeFooter;
