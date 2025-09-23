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
 * @returns {JSX.Element} Footer komponens
 */
const UpgradeFooter = ({ clickPower, passiveIncome, hasPremiumUpgrade }) => {
  const displayedPassiveIncome = hasPremiumUpgrade ? passiveIncome * 10 : passiveIncome;

  return (
    <div className="mt-auto pt-4 text-center">
      <div className="h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent mb-4"></div>
      <div className="flex justify-around gap-2">
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
