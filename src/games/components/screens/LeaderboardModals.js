/**
 * LeaderboardModals - Ranglista modálok komponens
 * 
 * Ez a komponens kezeli az összes modált:
 * - Transfer Modal
 * - Clerk Auth Modal
 */

import React from 'react';
import TransferModal from '../modals/TransferModal';
import ClerkAuthModal from '../modals/ClerkAuthModal';

const LeaderboardModals = ({
  showTransferModal,
  showClerkAuth,
  onCloseTransferModal,
  onCloseAuth,
  onPlayWithoutAuth
}) => {
  return (
    <>
      <TransferModal 
        isOpen={showTransferModal}
        onClose={onCloseTransferModal}
      />
      
      <ClerkAuthModal
        isOpen={showClerkAuth}
        onClose={onCloseAuth}
        onPlayWithoutAuth={onPlayWithoutAuth}
      />
    </>
  );
};

export default LeaderboardModals;
