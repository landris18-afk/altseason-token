/**
 * gameUtils.js - Játék segédfunkciók
 * 
 * Ez a fájl tartalmazza a játék segédfunkcióit:
 * - Upgrade költségek számítása
 * - Használatok kezelése
 * - Megosztás adatok generálása
 * - Játék állapot kezelése
 */

/**
 * fixUsesLeft - Használatok javító függvény
 * 
 * Ez a függvény javítja a használatok objektumát:
 * - Hiányzó értékek pótlása alapértelmezett értékekkel
 * - Érvénytelen értékek javítása
 * - Objektum normalizálása
 * 
 * @param {Object} usesLeftRaw - Nyers használatok objektum
 * @returns {Object} Javított használatok objektum
 */
export const fixUsesLeft = (usesLeftRaw) => {
  const defaults = {1: Infinity, 2: Infinity, 3: Infinity, 4: Infinity, 5: 100, 6: 20};
  const fixed = {};
  for (let i = 1; i <= 6; i++) {
    const val = usesLeftRaw && usesLeftRaw[i];
    if (typeof val === 'number' && !isNaN(val)) {
      fixed[i] = val;
    } else {
      fixed[i] = defaults[i];
    }
  }
  return fixed;
};

/**
 * getUpgradeCost - Upgrade költség számítás
 * 
 * Ez a függvény számítja ki az upgrade költségét:
 * - Alapár meghatározása
 * - Szint alapú áremelkedés
 * - Kerekítés
 * 
 * @param {Object} upgrade - Upgrade objektum
 * @returns {number} Upgrade költsége
 */
export const getUpgradeCost = (upgrade) => {
  const getPriceMultiplier = (id) => {
    if (id === 1) return 1.02; // Diamond Hands: 2% growth
    if (id === 5 || id === 6) return 1.15; // FOMO Generator és Whale Magnet
    return 1.10; // Minden más fejlesztés
  };
  const cost = upgrade.baseCost * getPriceMultiplier(upgrade.id) ** upgrade.level;
  return Math.round(cost); // Kerekítés a legközelebbi egész számra
};

/**
 * fmt - Szám formázás
 * 
 * Ez a függvény formázza a számokat:
 * - Kerekítés
 * - Locale alapú formázás
 * 
 * @param {number} n - Formázandó szám
 * @returns {string} Formázott szám
 */
export const fmt = (n) => Math.round(n).toLocaleString('en-US');

/**
 * getNextLevelUses - Következő szint használatok számítás
 * 
 * Ez a függvény számítja ki a következő szint használatait:
 * - Upgrade típus alapján
 * - Szint alapú számítás
 * 
 * @param {number} upgradeId - Upgrade ID
 * @returns {number} Következő szint használatai
 */
export const getNextLevelUses = (upgradeId) => {
  if (upgradeId === 1) return Infinity; // Diamond Hands
  if (upgradeId === 2) return Infinity; // Bull's Strength
  if (upgradeId === 3) return Infinity; // Moon Shot
  if (upgradeId === 4) return Infinity; // Shill Army
  if (upgradeId === 5) return 100; // FOMO Generator
  if (upgradeId === 6) return 20; // Whale Magnet
  return 0;
};
