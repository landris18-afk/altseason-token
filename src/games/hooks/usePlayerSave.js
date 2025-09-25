/**
 * usePlayerSave Hook - Játékos adatok mentése a ranglistára
 * 
 * Ez a hook kezeli a játékos eredmények mentését a ranglistára
 */

import { useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import leaderboardService from '../services/leaderboardService';
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
      console.log('Leaderboard is disabled, skipping save');
      return { success: false, reason: 'Leaderboard disabled' };
    }

    // Csak akkor mentjük, ha van bejelentkezett felhasználó
    if (!user) {
      console.log('No user logged in, skipping save');
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

      console.log('Saving player to leaderboard:', playerData);
      
      const result = await leaderboardService.savePlayer(playerData);
      
      console.log('Player saved successfully:', result);
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
      console.log('Invalid game state for auto save');
      return { success: false, reason: 'Invalid game state' };
    }

    const gameData = {
      marketCap: gameState.marketCap,
      clickPower: gameState.clickPower || 0,
      passiveIncome: gameState.passiveIncome || 0,
      level: gameState.levelIndex + 1 || 1,
      platform: isDesktop ? 'desktop' : 'mobile'
    };

    return await savePlayerToLeaderboard(gameData);
  }, [savePlayerToLeaderboard, isDesktop]);

  return {
    savePlayerToLeaderboard,
    autoSavePlayer,
    isSaveEnabled: !!user && leaderboardEnabled
  };
};

export default usePlayerSave;
