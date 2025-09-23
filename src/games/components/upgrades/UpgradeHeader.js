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
      {/* Desktop: normál header */}
      <div className="hidden md:block">
        <h3 className="text-3xl font-bold text-gray-300 mb-4">Upgrades</h3>
        <div className="h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent"></div>
      </div>
      
      {/* Mobile: nincs header, mert az a GameModal-ban van kezelve */}
    </div>
  );
};

export default UpgradeHeader;
