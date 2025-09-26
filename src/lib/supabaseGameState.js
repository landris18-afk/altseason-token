/**
 * Supabase Game State szolgáltatás
 * 
 * Játék állapot mentése, betöltése, törlése
 */

import { supabase, supabaseAdmin } from './supabase';
import supabaseAuth from './supabaseAuth';

class SupabaseGameState {
  /**
   * Játék állapot mentése - server-side
   */
  async saveGameState(clerkId, gameState) {
    console.log('saveGameState called with:', { clerkId, gameState: !!gameState });
    console.log('Supabase configured:', supabaseAuth.isSupabaseConfigured());
    console.log('User logged in:', supabaseAuth.isUserLoggedIn(clerkId));
    console.log('supabaseAdmin available:', !!supabaseAdmin);
    
    // Csak bejelentkezett felhasználók adatait mentjük Supabase-be
    if (!supabaseAuth.isSupabaseConfigured() || !supabaseAuth.isUserLoggedIn(clerkId)) {
      console.log('User not logged in or Supabase not configured, game state not saved to database');
      return { success: true, data: null };
    }

    // Ha client-side vagyunk, API endpoint-on keresztül mentjük
    if (typeof window !== 'undefined') {
      try {
        console.log('Client-side save: calling API endpoint');
        const response = await fetch('/api/game/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: clerkId,
            gameState: gameState
          })
        });

        console.log('API response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();
        console.log('API response result:', result);
        return result;
      } catch (error) {
        console.error('Error saving game state via API:', error);
        return { success: false, error: error.message };
      }
    }

    // Server-side: közvetlenül Supabase-be mentjük
    try {
      console.log('🖥️ Server-side save: starting...');
      // Először a felhasználót biztosítjuk
      console.log('👤 Upserting user with clerkId:', clerkId);
      const userResult = await supabaseAuth.upsertUser({ id: clerkId });
      console.log('👤 User upsert result:', userResult);
      if (!userResult.success) throw new Error(userResult.error);

      const userId = userResult.data.id;
      console.log('👤 User ID from database:', userId);

      // Játék állapot mentése
      const gameDataToSave = {
        user_id: userId,
        market_cap: gameState.marketCap || 0,
        click_power: gameState.clickPower || 0,
        passive_income: gameState.passiveIncome || 0,
        level: (gameState.levelIndex || 0) + 1,
        level_index: gameState.levelIndex || 0,
        total_clicks: gameState.totalClicks || 0,
        total_earned: gameState.totalEarned || 0,
        upgrades: gameState.upgrades || [],
        achievements: gameState.achievements || [],
        settings: gameState.settings || {},
        platform: gameState.platform || 'desktop',
        last_active: new Date().toISOString()
      };
      
      console.log('💾 Saving game data to database:', gameDataToSave);
      
      const { data, error } = await supabaseAdmin
        .from('game_states')
        .upsert(gameDataToSave, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      console.log('💾 Database response:', { data, error });

      if (error) throw error;
      console.log('✅ Game state saved successfully to database');
      return { success: true, data };
    } catch (error) {
      console.error('❌ Error saving game state:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Játék állapot betöltése - server-side
   */
  async loadGameState(clerkId) {
    // Csak bejelentkezett felhasználók adatait töltjük Supabase-ből
    if (!supabaseAuth.isSupabaseConfigured() || !supabaseAuth.isUserLoggedIn(clerkId)) {
      console.log('User not logged in or Supabase not configured, no game state loaded from database');
      return { success: true, data: null };
    }

    // Ha client-side vagyunk, API endpoint-on keresztül töltjük
    if (typeof window !== 'undefined') {
      try {
        const response = await fetch(`/api/game/load?userId=${clerkId}`);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const result = await response.json();
        return result;
      } catch (error) {
        console.error('Error loading game state via API:', error);
        return { success: false, error: error.message };
      }
    }

    // Server-side: közvetlenül Supabase-ből töltjük
    try {
      const userResult = await supabaseAuth.getUserByClerkId(clerkId);
      if (!userResult.success || !userResult.data) {
        return { success: true, data: null };
      }

      const { data, error } = await supabaseAdmin
        .from('game_states')
        .select('*')
        .eq('user_id', userResult.data.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
      return { success: true, data };
    } catch (error) {
      console.error('Error loading game state:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Játék állapot törlése az adatbázisból
   */
  async deleteGameState(clerkId) {
    if (!supabaseAuth.isSupabaseConfigured() || !supabaseAuth.isUserLoggedIn(clerkId)) {
      console.log('User not logged in or Supabase not configured, cannot delete game state');
      return { success: false, error: 'User not logged in or Supabase not configured' };
    }

    try {
      // Ha client-side vagyunk, API endpoint-on keresztül töröljük
      if (typeof window !== 'undefined') {
        const response = await fetch('/api/game/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ clerkId })
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();
        return result;
      }

      // Server-side: közvetlenül Supabase-ből töröljük
      if (!supabaseAdmin) {
        throw new Error('Supabase admin client not available');
      }

      // Először megkeressük a user ID-t (csak server-side)
      const userResult = await supabaseAuth.getUserByClerkId(clerkId);
      if (!userResult.success || !userResult.data) {
        console.log('User not found in database, trying to delete by clerk_id directly');
        
        // Ha nincs user rekord, próbáljuk törölni közvetlenül a clerk_id alapján
        const { error: gameStateError } = await supabaseAdmin
          .from('game_states')
          .delete()
          .eq('user_id', clerkId);
        
        if (gameStateError) {
          throw gameStateError;
        }

        return { success: true };
      }

      const userId = userResult.data.id;

      // Game state törlése
      const { error: gameStateError } = await supabaseAdmin
        .from('game_states')
        .delete()
        .eq('user_id', userId);

      if (gameStateError) {
        throw gameStateError;
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting game state:', error);
      return { success: false, error: error.message };
    }
  }
}

// Singleton instance
const supabaseGameState = new SupabaseGameState();

export default supabaseGameState;
