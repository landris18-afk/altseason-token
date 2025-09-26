/**
 * Supabase Service Koordinátor
 * 
 * Ez az osztály koordinálja az összes Supabase műveletet
 * és importálja az összes specializált szolgáltatást
 */

import supabaseAuth from './supabaseAuth';
import supabaseGameState from './supabaseGameState';
import supabaseLeaderboard from './supabaseLeaderboard';
import supabaseSettings from './supabaseSettings';

class SupabaseService {
  constructor() {
    // Inicializáljuk a specializált szolgáltatásokat
    this.auth = supabaseAuth;
    this.gameState = supabaseGameState;
    this.leaderboard = supabaseLeaderboard;
    this.settings = supabaseSettings;
  }

  // ============================================
  // AUTHENTICATION METHODS
  // ============================================

  /**
   * Supabase konfiguráció ellenőrzése
   */
  isSupabaseConfigured() {
    return this.auth.isSupabaseConfigured();
  }

  /**
   * Bejelentkezett felhasználó ellenőrzése
   */
  isUserLoggedIn(clerkId) {
    return this.auth.isUserLoggedIn(clerkId);
  }

  /**
   * Felhasználó létrehozása vagy frissítése
   */
  async upsertUser(clerkUser) {
    return await this.auth.upsertUser(clerkUser);
  }

  /**
   * Felhasználó lekérdezése Clerk ID alapján
   */
  async getUserByClerkId(clerkId) {
    return await this.auth.getUserByClerkId(clerkId);
  }

  // ============================================
  // GAME STATE METHODS
  // ============================================

  /**
   * Játék állapot mentése
   */
  async saveGameState(clerkId, gameState) {
    return await this.gameState.saveGameState(clerkId, gameState);
  }

  /**
   * Játék állapot betöltése
   */
  async loadGameState(clerkId) {
    return await this.gameState.loadGameState(clerkId);
  }

  /**
   * Játék állapot törlése
   */
  async deleteGameState(clerkId) {
    return await this.gameState.deleteGameState(clerkId);
  }

  // ============================================
  // LEADERBOARD METHODS
  // ============================================

  /**
   * Ranglista lekérdezése
   */
  async getLeaderboard(options = {}) {
    return await this.leaderboard.getLeaderboard(options);
  }

  /**
   * Játékos rangjának kiszámítása
   */
  async getPlayerRank(marketCap, platform = 'all') {
    return await this.leaderboard.getPlayerRank(marketCap, platform);
  }

  // ============================================
  // SETTINGS METHODS
  // ============================================

  /**
   * Beállítások mentése
   */
  async saveSettings(clerkId, settings) {
    return await this.settings.saveSettings(clerkId, settings);
  }

  /**
   * Beállítások betöltése
   */
  async loadSettings(clerkId) {
    return await this.settings.loadSettings(clerkId);
  }

  // ============================================
  // LEGACY METHODS (Backward compatibility)
  // ============================================
  
  /**
   * @deprecated Use gameState.deleteGameState instead
   * Játék állapot törlése - legacy method
   */
  async deleteGameState_legacy(clerkId) {
    console.warn('deleteGameState_legacy is deprecated, use deleteGameState instead');
    return await this.deleteGameState(clerkId);
  }
}

// Singleton instance
const supabaseService = new SupabaseService();

export default supabaseService;