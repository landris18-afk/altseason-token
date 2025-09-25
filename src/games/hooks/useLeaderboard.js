/**
 * useLeaderboard Hook - Ranglista adatok kezelése
 * 
 * Ez a hook kezeli a ranglista adatok lekérdezését és állapotát
 */

import { useState, useEffect, useCallback } from 'react';
import leaderboardService from '../services/leaderboardService';

/**
 * Ranglista hook
 * @param {Object} options - Opciók
 * @param {string} options.viewMode - Nézet mód (top10, top50, top100, all)
 * @param {string} options.platform - Platform szűrés
 * @param {boolean} options.autoRefresh - Automatikus frissítés
 * @param {number} options.refreshInterval - Frissítési időköz (ms)
 * @returns {Object} Ranglista adatok és függvények
 */
export const useLeaderboard = (options = {}) => {
  const {
    viewMode = 'top10',
    platform = 'all',
    autoRefresh = true,
    refreshInterval = 30000 // 30 másodperc
  } = options;

  // Állapotok
  const [players, setPlayers] = useState([]);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  /**
   * Ranglista adatok lekérdezése
   */
  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const limit = getLimitFromViewMode(viewMode);
      const query = {
        limit,
        offset: 0,
        sortBy: 'marketCap',
        sortOrder: 'desc',
        platform
      };

      const data = await leaderboardService.getLeaderboard(query);
      
      setPlayers(data.players || []);
      setTotalPlayers(data.totalPlayers || 0);
      setLastUpdated(data.lastUpdated || new Date());
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
      setError(err.message || 'Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  }, [viewMode, platform]);

  /**
   * View mode alapján limit meghatározása
   * @param {string} mode - View mode
   * @returns {number} Limit
   */
  const getLimitFromViewMode = (mode) => {
    switch (mode) {
      case 'top10': return 10;
      case 'top50': return 50;
      case 'top100': return 100;
      case 'all': return 1000;
      default: return 10;
    }
  };

  /**
   * Játékos rangjának lekérdezése
   * @param {number} marketCap - Market Cap érték
   * @returns {Promise<number>} Rang
   */
  const getPlayerRank = useCallback(async (marketCap) => {
    try {
      return await leaderboardService.getPlayerRank(marketCap, platform);
    } catch (err) {
      console.error('Player rank fetch error:', err);
      return null;
    }
  }, [platform]);

  /**
   * Ranglista frissítése
   */
  const refresh = useCallback(() => {
    leaderboardService.clearCache();
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  /**
   * View mode váltása
   * @param {string} newViewMode - Új view mode
   */
  const setViewMode = useCallback((newViewMode) => {
    // Ez a függvény a szülő komponensben lesz kezelve
    // Itt csak a callback-t adjuk vissza
  }, []);

  // Kezdeti adatok betöltése
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Automatikus frissítés
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchLeaderboard();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchLeaderboard]);

  return {
    // Adatok
    players,
    totalPlayers,
    loading,
    error,
    lastUpdated,
    
    // Függvények
    fetchLeaderboard,
    refresh,
    getPlayerRank,
    setViewMode
  };
};

/**
 * Játékos adatok hook
 * @param {Object} playerStats - Játékos statisztikák
 * @param {string} platform - Platform
 * @returns {Object} Játékos adatok
 */
export const usePlayerData = (playerStats, platform = 'desktop') => {
  const [playerRank, setPlayerRank] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPlayerRank = useCallback(async () => {
    if (!playerStats?.marketCap) return;

    setLoading(true);
    try {
      const rank = await leaderboardService.getPlayerRank(playerStats.marketCap, platform);
      setPlayerRank(rank);
    } catch (err) {
      console.error('Player rank fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [playerStats?.marketCap, platform]);

  useEffect(() => {
    fetchPlayerRank();
  }, [fetchPlayerRank]);

  return {
    playerRank,
    loading,
    refreshRank: fetchPlayerRank
  };
};

export default useLeaderboard;

