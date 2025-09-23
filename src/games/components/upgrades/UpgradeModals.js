/**
 * UpgradeModals.js - Upgrade modal kezelő komponens
 * 
 * Ez a komponens kezeli az upgrade modal-okat:
 * - Insufficient funds modal
 * - Modal állapot kezelés
 */

import React from 'react';
import InsufficientFundsModal from '../modals/InsufficientFundsModal';

/**
 * UpgradeModals - Upgrade modal kezelő komponens
 * 
 * @param {Object} props - Props objektum
 * @param {Object|null} props.insufficientFundsUpgrade - Elégtelen források upgrade
 * @param {number} props.marketCap - Market Cap érték
 * @param {Function} props.onCloseInsufficientFunds - Insufficient funds modal bezárása
 * @returns {JSX.Element|null} Modal komponensek vagy null
 */
const UpgradeModals = ({ 
  insufficientFundsUpgrade, 
  marketCap, 
  onCloseInsufficientFunds 
}) => {
  return (
    <>
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
