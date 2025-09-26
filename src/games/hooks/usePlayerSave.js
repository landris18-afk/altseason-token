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
    console.log('🎯 autoSavePlayer called with gameState:', gameState);
    console.log('🎯 User:', user);
    console.log('🎯 Market cap:', gameState?.marketCap);
    
    if (!gameState || !gameState.marketCap) {
      console.log('❌ Invalid game state for auto save - no marketCap');
      return { success: false, reason: 'Invalid game state' };
    }

    // Csak akkor mentjük, ha van bejelentkezett felhasználó
    if (!user) {
      console.log('❌ No user logged in, skipping auto save');
      return { success: false, reason: 'No user logged in' };
    }

    try {
      // Először frissítjük a user adatokat a teljes Clerk user objektummal
      console.log('👤 Updating user data with Clerk user object');
      const userResult = await supabaseService.upsertUser(user);
      console.log('👤 User upsert result:', userResult);

      // Teljes játék állapot mentése a game_states táblázatba
      const gameData = {
        ...gameState,
        platform: isDesktop ? 'desktop' : 'mobile'
      };

      console.log('💾 Auto-saving game state to database:', gameData);
      
      const result = await supabaseService.saveGameState(user.id, gameData);
      console.log('💾 Save game state result:', result);
      
      if (result.success) {
        console.log('✅ Game state auto-saved successfully');
      } else {
        console.error('❌ Failed to auto-save game state:', result.error);
      }
      
      return result;
      
    } catch (error) {
      console.error('❌ Failed to auto-save game state:', error);
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
