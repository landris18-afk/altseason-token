import { useState, useEffect } from 'react';

/**
 * useModalManager - Modal kezelő hook
 * 
 * Ez a hook kezeli a játék összes modal ablakát:
 * - Modal állapotok kezelése
 * - Scroll tiltás modal nyitáskor
 * - Terms elfogadás funkció
 * 
 * @returns {Object} Modal állapotok és kezelő funkciók
 */
export const useModalManager = () => {
  // Modal állapotok
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [isSolanaModalOpen, setIsSolanaModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  // Scroll tiltás modal nyitáskor (kivéve játék modal)
  useEffect(() => {
    const anyModalOpen = isResetModalOpen || isLevelUpModalOpen || isSolanaModalOpen || isTermsModalOpen || isRulesModalOpen;
    
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
  }, [isResetModalOpen, isLevelUpModalOpen, isSolanaModalOpen, isTermsModalOpen, isRulesModalOpen]);

  // Terms elfogadás funkció
  const acceptTerms = () => {
    if (!isCheckboxChecked) return;
    setIsTermsAccepted(true);
    // Ne zárjuk be azonnal a TermsModal-t, hagyjuk a startGame-nek
    // setIsTermsModalOpen(false);
  };

  return {
    // Modal állapotok
    isResetModalOpen,
    setIsResetModalOpen,
    isLevelUpModalOpen,
    setIsLevelUpModalOpen,
    isSolanaModalOpen,
    setIsSolanaModalOpen,
    isTermsModalOpen,
    setIsTermsModalOpen,
    isTermsAccepted,
    setIsTermsAccepted,
    isRulesModalOpen,
    setIsRulesModalOpen,
    
    // Checkbox állapot
    isCheckboxChecked,
    setIsCheckboxChecked,
    
    // Funkciók
    acceptTerms
  };
};

