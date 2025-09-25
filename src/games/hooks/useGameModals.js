import { useState, useCallback } from 'react';

/**
 * useGameModals - Játék modalok hook
 * 
 * Ez a hook kezeli az összes játék modal állapotát:
 * - Reset modal
 * - Level up modal
 * - Solana modal
 * - Rules modal
 * 
 * @returns {Object} Modal állapotok és kezelő függvények
 */
export const useGameModals = () => {

  // Reset modal
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Level up modal
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

  // Solana modal
  const [isSolanaModalOpen, setIsSolanaModalOpen] = useState(false);

  // Rules modal
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  return {
    // Reset modal
    isResetModalOpen,
    setIsResetModalOpen,
    
    // Level up modal
    isLevelUpModalOpen,
    setIsLevelUpModalOpen,
    
    // Solana modal
    isSolanaModalOpen,
    setIsSolanaModalOpen,
    
    // Rules modal
    isRulesModalOpen,
    setIsRulesModalOpen
  };
};

