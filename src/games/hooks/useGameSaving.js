import { useEffect, useRef, useCallback } from 'react';
import { usePlayerSave } from './usePlayerSave';

/**
 * useGameSaving - Játék állapot mentő hook
 * 
 * Ez a hook kezeli a játék állapot mentését localStorage-ba és adatbázisba.
 * 
 * @param {Object} gameState - A játék állapota
 * @param {Object} user - Clerk user objektum
 * @param {boolean} isGameLoaded - A játék betöltött állapota
 * @param {Object} hasLoadedFromStorage - Ref objektum a betöltött állapot követésére
 * @returns {Object} Mentési funkciók
 */
export const useGameSaving = (gameState, user, isGameLoaded, hasLoadedFromStorage) => {
  const { autoSavePlayer } = usePlayerSave();
  const saveTimeoutRef = useRef(null);

  // Állapot mentése localStorage-ba (mindenkinek a gyors játékélményért)
  useEffect(() => {
    if (isGameLoaded && hasLoadedFromStorage.current) {
      // Clear previous timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Set new timeout for saving
      saveTimeoutRef.current = setTimeout(() => {
        const userId = user?.id;
        const storageKey = userId ? `bullRunGameState_${userId}` : 'bullRunGameState_v3';
        localStorage.setItem(storageKey, JSON.stringify(gameState));
        
      }, 500); // 500ms debounce
    }
    
    // Cleanup timeout on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [gameState, isGameLoaded, user?.id]);

  // localStorage törlése minden felhasználónak (játék bezárásakor)
  const clearUserCache = useCallback(async (skipSave = false) => {
    if (user?.id) {
      // Bejelentkezett felhasználó: először mentjük az aktuális állapotot az adatbázisba (kivéve ha skipSave = true)
      if (!skipSave) {
        try {
          // Azonnal mentjük, nem várunk
          await autoSavePlayer(gameState);
        } catch (error) {
          console.error('Error saving game state to database:', error);
        }
      }
      
      // Majd töröljük a cache-t
      const userStorageKey = `bullRunGameState_${user.id}`;
      localStorage.removeItem(userStorageKey);
    } else {
      // Névtelen felhasználó cache törlése
      localStorage.removeItem('bullRunGameState_v3');
    }
  }, [user?.id, gameState, autoSavePlayer]);

  return {
    clearUserCache,
    saveTimeoutRef
  };
};
