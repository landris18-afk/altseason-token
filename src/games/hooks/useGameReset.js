import { useState, useCallback } from 'react';
import { getInitialState } from '../data/gameData';
import supabaseService from '../../lib/supabaseService';

/**
 * useGameReset - Játék reset kezelő hook
 * 
 * Ez a hook kezeli a játék reset funkcióját, beleértve az adatbázis és
 * localStorage törlését.
 * 
 * @param {Object} user - Clerk user objektum
 * @param {Function} setGameState - A játék állapot frissítő függvény
 * @param {Object} hasLoadedFromStorage - Ref objektum a betöltött állapot követésére
 * @param {Object} lastReqLevelRef - Ref objektum a szint követésére
 * @param {Object} saveTimeoutRef - Ref objektum a mentési timeout követésére
 * @returns {Object} Reset funkciók és állapot
 */
export const useGameReset = (
  user,
  setGameState,
  hasLoadedFromStorage,
  lastReqLevelRef,
  saveTimeoutRef
) => {
  // Reset loading state
  const [isResetting, setIsResetting] = useState(false);

  // Játék reset funkció
  const confirmReset = useCallback(async (onResetComplete) => {
    const userId = user?.id;
    const storageKey = userId ? `bullRunGameState_${userId}` : 'bullRunGameState_v3';
    
    // Set loading state
    setIsResetting(true);
    
    // Clear save timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Bejelentkezett felhasználó: adatbázisból is töröljük a játék adatokat
    if (userId) {
      try {
        // Töröljük a játék állapotot az adatbázisból
        const deleteResult = await supabaseService.deleteGameState(userId);
        if (deleteResult.success) {
          console.log('✅ Game state deleted from database successfully');
        } else {
          console.error('❌ Failed to delete game state from database:', deleteResult.error);
          // Ha nem sikerült törölni, akkor is folytatjuk
        }
        
        // A ranglista adatok automatikusan törlődnek a game_states törlésekor
      } catch (error) {
        console.error('❌ Error deleting data from database:', error);
        // Ha hiba van, akkor is folytatjuk
      }
    }
    
    // localStorage törlése
    localStorage.removeItem(storageKey);
    
    // Reset the loaded flag
    hasLoadedFromStorage.current = false;
    const initialState = getInitialState();
    setGameState({
      ...initialState,
      levelIndex: 0,
      marketCap: 0,
      totalClicks: 0,
      clickPower: 1,
      passiveIncome: 0,
      solanaBlessingLevel: 0,
      hasPremiumUpgrade: false,
      usesLeft: {
        1: Infinity, // Diamond Hands: végtelen
        2: 0, // Bull's Strength: lezárva
        3: 0, // Moon Shot: lezárva
        4: 0, // Shill Army: lezárva
        5: 0, // FOMO Generator: lezárva
        6: 0 // Whale Magnet: lezárva
      },
      upgrades: initialState.upgrades.map(upgrade => ({
        ...upgrade,
        level: 0,
        isUnlocked: upgrade.id === 1 // Csak a Diamond Hands legyen feloldva
      })),
      minMarketCapThisLevel: 0
    });
    
    // Reseteljük a lastReqLevelRef-et is
    Object.keys(lastReqLevelRef.current).forEach(key => {
      lastReqLevelRef.current[key] = undefined;
    });
    
    // Clear loading state
    setIsResetting(false);
    
    // Visszahívás a reset befejezésére - azonnal átirányítás
    if (onResetComplete) {
      onResetComplete(); // A ModalManager kezeli a skipSave-t
    }
  }, [user?.id, setGameState, hasLoadedFromStorage, lastReqLevelRef, saveTimeoutRef]);

  return {
    confirmReset,
    isResetting
  };
};