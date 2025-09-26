/**
 * Supabase Settings szolgáltatás
 * 
 * Felhasználói beállítások kezelése
 */

import { supabase, supabaseAdmin } from './supabase';
import supabaseAuth from './supabaseAuth';

class SupabaseSettings {
  /**
   * Beállítások mentése
   */
  async saveSettings(clerkId, settings) {
    if (!supabaseAuth.isSupabaseConfigured() || !supabaseAuth.isUserLoggedIn(clerkId)) {
      console.log('User not logged in or Supabase not configured, settings not saved to database');
      return { success: true, data: null };
    }

    try {
      // Client-side: use API endpoint
      if (typeof window !== 'undefined') {
        const response = await fetch('/api/settings/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clerkId,
            settings
          })
        });
        
        const result = await response.json();
        
        if (result.success) {
          return { success: true, data: result.data };
        } else {
          return { success: false, error: result.error };
        }
      }

      // Server-side: direct database access
      const userResult = await supabaseAuth.upsertUser({ id: clerkId });
      if (!userResult.success) throw new Error(userResult.error);

      const userId = userResult.data.id;

      const { data, error } = await supabaseAdmin
        .from('game_settings')
        .upsert({
          user_id: userId,
          display_name: settings.displayName || null,
          use_real_name: settings.useRealName || false,
          enable_leaderboard: settings.enableLeaderboard !== false, // Alapértelmezetten true
          enable_sounds: settings.enableSounds !== false, // Alapértelmezetten true
          enable_animations: settings.enableAnimations !== false, // Alapértelmezetten true
          theme: settings.theme || 'default'
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error saving settings:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Beállítások betöltése
   */
  async loadSettings(clerkId) {
    if (!supabaseAuth.isSupabaseConfigured() || !supabaseAuth.isUserLoggedIn(clerkId)) {
      console.log('User not logged in or Supabase not configured, no settings loaded from database');
      return { success: true, data: null };
    }

    try {
      // Client-side: use API endpoint
      if (typeof window !== 'undefined') {
        const response = await fetch(`/api/settings/load?clerkId=${encodeURIComponent(clerkId)}`);
        const result = await response.json();
        
        if (result.success) {
          return { success: true, data: result.data };
        } else {
          return { success: false, error: result.error };
        }
      }

      // Server-side: direct database access
      const userResult = await supabaseAuth.getUserByClerkId(clerkId);
      if (!userResult.success || !userResult.data) {
        return { success: true, data: null };
      }

      const { data, error } = await supabaseAdmin
        .from('game_settings')
        .select('*')
        .eq('user_id', userResult.data.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error loading settings:', error);
      return { success: false, error: error.message };
    }
  }
}

// Singleton instance
const supabaseSettings = new SupabaseSettings();

export default supabaseSettings;
