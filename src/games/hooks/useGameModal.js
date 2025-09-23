/**
 * useGameModal.js - Játék modal hook
 * 
 * Ez a hook kezeli a játék modal állapotát:
 * - Modal nyitás/zárás
 * - Terms elfogadás és játék modal koordináció
 * - Terms reset funkció
 */

import { useState } from 'react';

/**
 * useGameModal - Játék modal hook
 * 
 * @returns {Object} Játék modal állapot és funkciók
 */
export const useGameModal = () => {
  // Állapot változók
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);

  // Játék modal megnyitása
  const openGameModal = () => {
    setIsGameModalOpen(true);
  };

  // Játék modal bezárása
  const closeGameModal = (resetTerms) => {
    setIsGameModalOpen(false);
    if (resetTerms) {
      resetTerms(); // Visszaállítja a terms elfogadás állapotát
    }
  };

  // Játék indítás (terms elfogadás + játék modal megnyitás)
  const startGame = (acceptTerms) => {
    if (acceptTerms) {
      acceptTerms(); // Elfogadja a feltételeket
    }
    // Automatikusan megnyitja a játék modal-t
    setTimeout(() => {
      openGameModal();
    }, 100); // Kis késleltetés, hogy a terms elfogadás lefusson
  };

  return {
    // Állapot
    isGameModalOpen,
    
    // Funkciók
    openGameModal,
    closeGameModal,
    startGame
  };
};
