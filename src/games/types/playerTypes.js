/**
 * Player Types - Játékos adatok típusai
 * 
 * Ez a fájl tartalmazza a játékos adatok típusait és interfészeket
 */

/**
 * Játékos adatok interfész
 * @typedef {Object} PlayerData
 * @property {string} id - Játékos egyedi azonosító
 * @property {string} name - Játékos neve
 * @property {number} marketCap - Market Cap érték
 * @property {number} clickPower - Kattintás erő
 * @property {number} passiveIncome - Passzív jövedelem
 * @property {number} level - Játékos szintje
 * @property {string} platform - Platform (desktop/mobile)
 * @property {Date} lastActive - Utolsó aktív időpont
 * @property {boolean} isCurrentUser - Aktuális felhasználó-e
 * @property {number} actualRank - Valódi rang a ranglistán
 */

/**
 * Ranglista adatok interfész
 * @typedef {Object} LeaderboardData
 * @property {PlayerData[]} players - Játékosok listája
 * @property {number} totalPlayers - Összes játékos száma
 * @property {Date} lastUpdated - Utolsó frissítés időpontja
 */

/**
 * Ranglista lekérdezés paraméterek
 * @typedef {Object} LeaderboardQuery
 * @property {number} limit - Megjelenítendő játékosok száma
 * @property {number} offset - Eltolás
 * @property {string} sortBy - Rendezés mező (marketCap, clickPower, passiveIncome, level)
 * @property {string} sortOrder - Rendezés irány (asc, desc)
 * @property {string} platform - Platform szűrés (desktop, mobile, all)
 */

/**
 * Játékos statisztikák
 * @typedef {Object} PlayerStats
 * @property {number} marketCap - Market Cap
 * @property {number} clickPower - Kattintás erő
 * @property {number} passiveIncome - Passzív jövedelem
 * @property {number} level - Szint
 * @property {number} totalClicks - Összes kattintás
 * @property {number} playTime - Játékidő (másodpercben)
 * @property {Date} joinedAt - Csatlakozás dátuma
 */

export {
  // Típusok exportálása (JSDoc kommentekkel)
};

