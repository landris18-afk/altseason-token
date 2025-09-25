import { useState, useEffect } from 'react';

/**
 * useModalManager - Modal kezelő hook
 * 
 * Ez a hook kezeli a játék összes modal ablakát:
 * - Modal állapotok kezelése
 * - Scroll tiltás modal nyitáskor
 * 
 * @returns {Object} Modal állapotok és kezelő funkciók
 */
export const useModalManager = () => {
  // Modal állapotok
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [isSolanaModalOpen, setIsSolanaModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  // Modal nyitott állapot ellenőrzése
  const anyModalOpen = isResetModalOpen || isLevelUpModalOpen || isSolanaModalOpen || isRulesModalOpen;

  // Scroll tiltás modal nyitáskor (kivéve játék modal)
  useEffect(() => {
    
    if (anyModalOpen) {
      // Tiltja a body scrolling-ot
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100%';
      document.documentElement.style.overflow = 'hidden';
    } else {
      // Visszaállítja a body scrolling-ot
      document.body.style.overflow = 'unset';
      document.body.style.height = 'unset';
      document.documentElement.style.overflow = 'unset';
    }
    
    return () => { 
      document.body.style.overflow = 'unset';
      document.body.style.height = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [isResetModalOpen, isLevelUpModalOpen, isSolanaModalOpen, isRulesModalOpen]);


  return {
    // Modal állapotok
    isResetModalOpen,
    setIsResetModalOpen,
    isLevelUpModalOpen,
    setIsLevelUpModalOpen,
    isSolanaModalOpen,
    setIsSolanaModalOpen,
    isRulesModalOpen,
    setIsRulesModalOpen,
    anyModalOpen
  };
};