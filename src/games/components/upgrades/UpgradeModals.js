/**
 * UpgradeModals.js - Upgrade modal kezelő komponens
 * 
 * Ez a komponens kezeli az upgrade modal-okat:
 * - Requirements modal
 * - Insufficient funds modal
 * - Modal állapot kezelés
 */

import React from 'react';
import RequirementsModal from '../modals/RequirementsModal';
import InsufficientFundsModal from '../modals/InsufficientFundsModal';

/**
 * UpgradeModals - Upgrade modal kezelő komponens
 * 
 * @param {Object} props - Props objektum
 * @param {Object|null} props.selectedUpgrade - Kiválasztott upgrade
 * @param {Object|null} props.insufficientFundsUpgrade - Elégtelen források upgrade
 * @param {Object} props.usesLeft - Maradék használatok
 * @param {number} props.marketCap - Market Cap érték
 * @param {Function} props.onCloseRequirements - Requirements modal bezárása
 * @param {Function} props.onCloseInsufficientFunds - Insufficient funds modal bezárása
 * @returns {JSX.Element|null} Modal komponensek vagy null
 */
const UpgradeModals = ({ 
  selectedUpgrade, 
  insufficientFundsUpgrade, 
  usesLeft, 
  marketCap, 
  onCloseRequirements, 
  onCloseInsufficientFunds 
}) => {
  return (
    <>
      {/* Requirements Modal */}
      {selectedUpgrade && (
        <RequirementsModal
          key={`${selectedUpgrade.upgrade.id}-${usesLeft[selectedUpgrade.upgrade.id] ?? 0}`}
          isOpen
          onClose={onCloseRequirements}
          upgrade={selectedUpgrade.upgrade}
          requiredUpgrade={selectedUpgrade.requiredUpgrade}
          usesLeft={usesLeft}
        />
      )}
      
      {/* Insufficient Funds Modal */}
      {insufficientFundsUpgrade && (
        <InsufficientFundsModal
          isOpen
          onClose={onCloseInsufficientFunds}
          cost={insufficientFundsUpgrade.cost}
          marketCap={marketCap}
        />
      )}
    </>
  );
};

export default UpgradeModals;
