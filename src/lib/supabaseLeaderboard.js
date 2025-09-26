/**
 * Supabase Leaderboard szolgáltatás
 * 
 * Ranglista műveletek, játékos rang számítás
 */

import { supabase, supabaseAdmin } from './supabase';
import supabaseAuth from './supabaseAuth';

// Ideiglenes memóriában tárolás fallback-hez
let fallbackLeaderboardData = [
  {
    id: 'demo1',
    userId: 'demo1',
    name: 'Demo Player 1',
    marketCap: 1000000,
    clickPower: 100,
    passiveIncome: 50,
    level: 10,
    platform: 'desktop',
    lastActive: new Date().toISOString()
  },
  {
    id: 'demo2',
    userId: 'demo2',
    name: 'Demo Player 2',
    marketCap: 500000,
    clickPower: 75,
    passiveIncome: 30,
    level: 8,
    platform: 'mobile',
    lastActive: new Date().toISOString()
  }
];

class SupabaseLeaderboard {
  /**
   * Ranglista lekérdezése - most a game_states táblázatból
   */
  async getLeaderboard(options = {}) {
    console.log('getLeaderboard called with options:', options);
    console.log('Supabase configured:', supabaseAuth.isSupabaseConfigured());
    console.log('Supabase client:', !!supabase);
    
    if (!supabaseAuth.isSupabaseConfigured() || !supabase) {
      console.log('Supabase not configured or client is null, using fallback leaderboard data');
      const { limit = 100, offset = 0, platform = 'all' } = options;

      let players = [...fallbackLeaderboardData];

      // Platform szűrés
      if (platform !== 'all') {
        players = players.filter(player => player.platform === platform);
      }

      // Rendezés
      players.sort((a, b) => b.marketCap - a.marketCap);

      // Rang hozzáadása
      const playersWithRank = players.map((player, index) => ({
        ...player,
        rank: offset + index + 1
      }));

      // Pagination
      const paginatedPlayers = playersWithRank.slice(offset, offset + limit);

      return {
        success: true,
        data: {
          players: paginatedPlayers,
          totalPlayers: players.length,
          lastUpdated: new Date().toISOString()
        }
      };
    }

    try {
      const { limit = 100, offset = 0, platform = 'all' } = options;

      console.log('Querying game_states table with:', { limit, offset, platform });

      // Ranglista adatok lekérdezése a game_states táblázatból
      // Server-side: supabaseAdmin client-et használjuk
      const client = typeof window !== 'undefined' ? supabase : supabaseAdmin;
      console.log('Using client:', typeof window !== 'undefined' ? 'client-side' : 'server-side');
      
      // Először lekérdezzük a game_states adatokat
      let query = client
        .from('game_states')
        .select('*')
        .order('market_cap', { ascending: false })
        .range(offset, offset + limit - 1);

      // Platform szűrés
      if (platform !== 'all') {
        query = query.eq('platform', platform);
      }

      const { data: gameStates, error } = await query;

      console.log('Supabase query result:', { gameStates, error });
      console.log('Data length:', gameStates?.length);
      console.log('First item:', gameStates?.[0]);

      if (error) throw error;

      // Adatok átalakítása ranglista formátumra
      const playersWithRank = await Promise.all(gameStates.map(async (gameState, index) => {
        // Felhasználó adatok lekérdezése
        const { data: userData } = await client
          .from('users')
          .select('clerk_id, first_name, last_name')
          .eq('id', gameState.user_id)
          .single();

        // Beállítások lekérdezése
        const { data: settingsData } = await client
          .from('game_settings')
          .select('display_name, use_real_name, enable_leaderboard')
          .eq('user_id', gameState.user_id)
          .single();

        // Ellenőrizzük, hogy a felhasználó engedélyezte-e a ranglistán való megjelenést
        if (settingsData && settingsData.enable_leaderboard === false) {
          console.log('User disabled leaderboard participation, skipping:', userData?.clerk_id);
          return null; // Kihagyjuk ezt a felhasználót
        }
        
        // Név meghatározása a beállítások alapján
        let displayName = 'Players'; // fallback
        
        if (userData) {
          // Ha van first_name, azt használjuk, különben a Clerk ID alapján generálunk nevet
          const realName = userData.first_name || `Player_${userData.clerk_id?.slice(-4)}` || 'Players';
          
          if (settingsData && settingsData.use_real_name === false && settingsData.display_name) {
            // Ha van custom display name és nem használja a valódi nevet
            displayName = settingsData.display_name;
          } else {
            // Valódi nevet használja vagy nincs custom display name
            displayName = realName;
          }
        }

        return {
          id: gameState.user_id,
          userId: gameState.user_id,
          clerkId: userData?.clerk_id,
          name: displayName,
          marketCap: gameState.market_cap || 0,
          clickPower: gameState.click_power || 0,
          passiveIncome: gameState.passive_income || 0,
          level: gameState.level || 1,
          platform: gameState.platform || 'desktop',
          lastActive: gameState.last_active,
          rank: offset + index + 1,
          score: gameState.market_cap || 0 // Kompatibilitás
        };
      }));

      // Null értékek kiszűrése (leaderboard participation = false)
      const validPlayers = playersWithRank.filter(player => player !== null);

      console.log('Processed players:', validPlayers);

      return {
        success: true,
        data: {
          players: validPlayers,
          totalPlayers: validPlayers.length,
          lastUpdated: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Játékos rangjának kiszámítása - most a game_states táblázatból
   */
  async getPlayerRank(marketCap, platform = 'all') {
    if (!supabaseAuth.isSupabaseConfigured()) {
      console.log('Supabase not configured, returning default rank');
      return { success: true, data: { rank: 1, totalPlayers: 0, percentile: 100 } };
    }

    try {
      // Ranglista adatok lekérdezése a game_states táblázatból
      let query = supabase
        .from('game_states')
        .select('market_cap')
        .order('market_cap', { ascending: false });

      if (platform !== 'all') {
        query = query.eq('platform', platform);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Rang meghatározása
      let rank = 1;
      for (const player of data) {
        if (marketCap > player.market_cap) {
          break;
        }
        rank++;
      }

      return {
        success: true,
        data: {
          rank,
          totalPlayers: data.length,
          percentile: Math.round(((data.length - rank + 1) / data.length) * 100)
        }
      };
    } catch (error) {
      console.error('Error calculating rank:', error);
      return { success: false, error: error.message };
    }
  }
}

// Singleton instance
const supabaseLeaderboard = new SupabaseLeaderboard();

export default supabaseLeaderboard;
