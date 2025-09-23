/**
 * UpgradeHeader.js - Upgrade panel header komponens
 * 
 * Ez a komponens megjeleníti az upgrade panel header-ét:
 * - Panel címe
 * - Stílusozás
 */

import React from 'react';

/**
 * UpgradeHeader - Upgrade panel header komponens
 * 
 * @returns {JSX.Element} Header komponens
 */
const UpgradeHeader = () => {
  return (
    <div className="mb-4">
      <h3 className="text-xl font-bold text-gray-300 mb-1">Upgrades</h3>
      <div className="h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent"></div>
    </div>
  );
};

export default UpgradeHeader;
