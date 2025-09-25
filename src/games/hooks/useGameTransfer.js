import { useState, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';

/**
 * useGameTransfer - Játék állapot átviteli hook
 * 
 * Ez a hook kezeli a játék állapot átvitelét:
 * - Böngésző localStorage → Clerk profil
 * - Átvitel előtti ellenőrzések
 * - Átvitel utáni tisztítás
 * 
 * @returns {Object} Átviteli funkciók és állapot
 */
export const useGameTransfer = () => {
  const { user, isSignedIn } = useUser();
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferError, setTransferError] = useState(null);
  const [transferSuccess, setTransferSuccess] = useState(false);

  /**
   * Átvitel előtti ellenőrzések - egyszerűsített
   */
  const canTransfer = useCallback(() => {
    if (!isSignedIn || !user?.id) {
      return false;
    }

    if (typeof window === 'undefined') {
      return false;
    }

    // Ellenőrizzük, hogy van-e böngészőben mentett állapot
    const browserState = localStorage.getItem('bullRunGameState_v3');
    if (!browserState) {
      return false;
    }

    return true;
  }, [isSignedIn, user?.id]);

  /**
   * Játék állapot átvitele böngésző → Clerk profil
   */
  const transferGameState = useCallback(async () => {
    if (!isSignedIn || !user?.id) {
      setTransferError('Nincs bejelentkezve');
      return false;
    }

    setIsTransferring(true);
    setTransferError(null);
    setTransferSuccess(false);

    try {
      // Böngésző állapot betöltése
      const browserState = localStorage.getItem('bullRunGameState_v3');
      if (!browserState) {
        setTransferError('Nincs mentett játék állapot a böngészőben');
        return false;
      }

      const gameData = JSON.parse(browserState);
      
      // Clerk profilba mentés
      const clerkStorageKey = `bullRunGameState_${user.id}`;
      localStorage.setItem(clerkStorageKey, JSON.stringify(gameData));

      // Böngésző állapot törlése (opcionális)
      localStorage.removeItem('bullRunGameState_v3');

      setTransferSuccess(true);
      return true;

    } catch (error) {
      console.error('Hiba az átvitel során:', error);
      setTransferError(error.message || 'Ismeretlen hiba történt');
      return false;
    } finally {
      setIsTransferring(false);
    }
  }, [isSignedIn, user?.id]);

  /**
   * Átvitel visszavonása (ha szükséges)
   */
  const revertTransfer = useCallback(() => {
    if (!user?.id) return false;

    try {
      const clerkStorageKey = `bullRunGameState_${user.id}`;
      const clerkState = localStorage.getItem(clerkStorageKey);
      
      if (clerkState) {
        // Clerk állapot visszaállítása böngészőbe
        localStorage.setItem('bullRunGameState_v3', clerkState);
        localStorage.removeItem(clerkStorageKey);
        return true;
      }
    } catch (error) {
      console.error('Hiba a visszavonás során:', error);
    }
    
    return false;
  }, [user?.id]);

  /**
   * Átvitel állapot visszaállítása
   */
  const resetTransferState = useCallback(() => {
    setTransferError(null);
    setTransferSuccess(false);
  }, []);

  return {
    // Állapot
    isTransferring,
    transferError,
    transferSuccess,
    
    // Funkciók
    canTransfer,
    transferGameState,
    revertTransfer,
    resetTransferState
  };
};

