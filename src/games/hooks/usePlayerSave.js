/**
 * usePlayerSave Hook - Játékos adatok mentése a ranglistára
 * 
 * Ez a hook kezeli a játékos eredmények mentését a ranglistára
 */

import { useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import supabaseService from '../../lib/supabaseService';
import { useGameSettings } from './useGameSettings';
import { useDesktopDetection } from './useDesktopDetection';

/**
 * Játékos mentés hook
 * @returns {Object} Mentés függvények és állapotok
 */
export const usePlayerSave = () => {
  const { user } = useUser();
  const { displayName, leaderboardEnabled } = useGameSettings();
  const isDesktop = useDesktopDetection();

  /**
   * Játékos mentése a ranglistára
   * @param {Object} gameData - Játék adatok
   * @param {number} gameData.marketCap - Market Cap érték
   * @param {number} gameData.clickPower - Click Power
   * @param {number} gameData.passiveIncome - Passive Income
   * @param {number} gameData.level - Szint
   * @param {string} gameData.platform - Platform ('desktop' vagy 'mobile')
   * @returns {Promise<Object>} Mentés eredménye
   */
  const savePlayerToLeaderboard = useCallback(async (gameData) => {
    // Csak akkor mentjük, ha engedélyezve van a ranglista
    if (!leaderboardEnabled) {
      return { success: false, reason: 'Leaderboard disabled' };
    }

    // Csak akkor mentjük, ha van bejelentkezett felhasználó
    if (!user) {
      return { success: false, reason: 'No user logged in' };
    }

    try {
      const playerData = {
        name: displayName || user.firstName || 'Anonymous',
        marketCap: gameData.marketCap || 0,
        clickPower: gameData.clickPower || 0,
        passiveIncome: gameData.passiveIncome || 0,
        level: gameData.level || 1,
        platform: gameData.platform || 'desktop',
        userId: user.id
      };

      
      const result = await leaderboardService.savePlayer(playerData);
      
      return { success: true, data: result };
      
    } catch (error) {
      console.error('Failed to save player to leaderboard:', error);
      return { success: false, error: error.message };
    }
  }, [user, displayName, leaderboardEnabled]);

  /**
   * Játékos automatikus mentése (pl. játék végekor)
   * @param {Object} gameState - Játék állapot
   * @returns {Promise<Object>} Mentés eredménye
   */
  const autoSavePlayer = useCallback(async (gameState) => {
    if (!gameState || !gameState.marketCap) {
      return { success: false, reason: 'Invalid game state' };
    }

    // Csak akkor mentjük, ha van bejelentkezett felhasználó
    if (!user) {
      return { success: false, reason: 'No user logged in' };
    }

    try {
      // Először frissítjük a user adatokat a teljes Clerk user objektummal
      await supabaseService.upsertUser(user);

      // Teljes játék állapot mentése a game_states táblázatba
      const gameData = {
        ...gameState,
        platform: isDesktop ? 'desktop' : 'mobile'
      };
      
      const result = await supabaseService.saveGameState(user.id, gameData);
      
      return result;
      
    } catch (error) {
      console.error('Failed to auto-save game state:', error);
      return { success: false, error: error.message };
    }
  }, [user, isDesktop]);

  return {
    savePlayerToLeaderboard,
    autoSavePlayer,
    isSaveEnabled: !!user && leaderboardEnabled
  };
};

export default usePlayerSave;
