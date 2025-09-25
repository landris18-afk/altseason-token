/**
 * Leaderboard Service - Ranglista adatok kezelése
 * 
 * Ez a szolgáltatás kezeli a ranglista adatok lekérdezését és kezelését
 */


/**
 * Ranglista szolgáltatás osztály
 */
class LeaderboardService {
  constructor() {
    this.baseUrl = '/api/leaderboard';
    this.cache = new Map();
    this.cacheTimeout = 30000; // 30 másodperc cache
  }

  /**
   * Ranglista adatok lekérdezése
   * @param {Object} query - Lekérdezés paraméterek
   * @param {number} query.limit - Megjelenítendő játékosok száma
   * @param {number} query.offset - Eltolás
   * @param {string} query.sortBy - Rendezés mező
   * @param {string} query.sortOrder - Rendezés irány
   * @param {string} query.platform - Platform szűrés
   * @returns {Promise<Object>} Ranglista adatok
   */
  async getLeaderboard(query = {}) {
    const {
      limit = 100,
      offset = 0,
      sortBy = 'marketCap',
      sortOrder = 'desc',
      platform = 'all'
    } = query;

    const cacheKey = `leaderboard_${JSON.stringify(query)}`;
    
    // Cache ellenőrzése
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      // Valódi API hívás (jelenleg mock adatokkal)
      const response = await this.fetchFromAPI(query);
      
      // Cache mentése
      this.cache.set(cacheKey, {
        data: response,
        timestamp: Date.now()
      });

      return response;
    } catch (error) {
      console.error('Leaderboard fetch error:', error);
      // Fallback üres adatokra ha a szerver nem fut
      return this.getEmptyLeaderboard(query);
    }
  }

  /**
   * API hívás valódi adatokért
   * @param {Object} query - Lekérdezés paraméterek
   * @returns {Promise<Object>} API válasz
   */
  async fetchFromAPI(query) {
    const params = new URLSearchParams(query);
    const response = await fetch(`${this.baseUrl}?${params}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  }

  /**
   * Üres adatok visszaadása ha a szerver nem fut
   * @param {Object} query - Lekérdezés paraméterek
   * @returns {Object} Üres ranglista adatok
   */
  getEmptyLeaderboard(query) {
    return {
      players: [],
      totalPlayers: 0,
      lastUpdated: new Date(),
      query,
      error: 'Server not available'
    };
  }

  /**
   * Játékos mentése a ranglistára
   * @param {Object} playerData - Játékos adatok
   * @param {string} playerData.name - Játékos neve
   * @param {number} playerData.marketCap - Market Cap érték
   * @param {number} playerData.clickPower - Click Power
   * @param {number} playerData.passiveIncome - Passive Income
   * @param {number} playerData.level - Szint
   * @param {string} playerData.platform - Platform
   * @param {string} playerData.userId - Clerk User ID
   * @returns {Promise<Object>} Mentés eredménye
   */
  async savePlayer(playerData) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...playerData,
          isCurrentUser: true
        })
      });

      if (!response.ok) {
        throw new Error(`Save player API error: ${response.status}`);
      }

      const result = await response.json();
      
      // Cache törlése, hogy friss adatok jöjjenek
      this.clearCache();
      
      return result;
    } catch (error) {
      console.error('Save player error:', error);
      throw error;
    }
  }

  /**
   * Játékos rangjának kiszámítása
   * @param {number} marketCap - Játékos Market Cap értéke
   * @param {string} platform - Platform
   * @returns {Promise<number>} Rang
   */
  async getPlayerRank(marketCap, platform = 'all') {
    try {
      const response = await fetch(`${this.baseUrl}/rank?marketCap=${marketCap}&platform=${platform}`);
      if (!response.ok) {
        throw new Error(`Rank API error: ${response.status}`);
      }
      const data = await response.json();
      return data.rank;
    } catch (error) {
      console.error('Rank fetch error:', error);
      // Fallback: null ha a szerver nem fut
      return null;
    }
  }


  /**
   * Cache törlése
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Cache frissítése
   * @param {string} key - Cache kulcs
   */
  invalidateCache(key) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}

// Singleton instance
const leaderboardService = new LeaderboardService();

export default leaderboardService;
