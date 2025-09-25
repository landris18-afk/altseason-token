/**
 * upgradeUtils.js - Upgrade segédfunkciók
 * 
 * Ez a fájl tartalmazza az upgrade-ekkel kapcsolatos segédfunkciókat:
 * - Ár számítások
 * - Unlock ellenőrzések
 * - Formázási függvények
 * - Upgrade kategóriák
 */

/**
 * fmt - Szám formázás
 * 
 * @param {number} n - Formázandó szám
 * @returns {string} Formázott szám
 */
export const fmt = (n) => Math.round(n).toLocaleString('en-US');

/**
 * priceMultiplier - Ár szorzó meghatározása
 * 
 * @param {number} id - Upgrade ID
 * @returns {number} Ár szorzó
 */
export const priceMultiplier = (id) => {
  if (id === 1) return 1.02;         // Diamond Hands: 2% growth
  if (id === 5 || id === 6) return 1.15;  // FOMO Generator & Whale Magnet: 15% growth
  return 1.10;                       // Bull's Strength, Moon Shot, Shill Army: 10% growth
};

/**
 * calculateUpgradeCost - Upgrade költség számítása
 * 
 * @param {Object} upgrade - Upgrade objektum
 * @returns {number} Számított költség
 */
export const calculateUpgradeCost = (upgrade) => {
  return Math.round(upgrade.baseCost * priceMultiplier(upgrade.id) ** upgrade.level);
};

/**
 * isUpgradeUnlocked - Upgrade feloldás ellenőrzése
 * 
 * @param {Object} upgrade - Upgrade objektum
 * @param {Object} usesLeft - Maradék használatok
 * @param {Array} allUpgrades - Összes upgrade (requirements ellenőrzéshez)
 * @returns {boolean} Feloldott-e az upgrade
 */
export const isUpgradeUnlocked = (upgrade, usesLeft, allUpgrades = []) => {
  if (upgrade.id === 1) return true; // Diamond Hands mindig feloldott
  
  // Ellenőrizzük a requirements-eket
  if (upgrade.requirements) {
    const requiredUpgrade = allUpgrades.find(u => u.id === upgrade.requirements.upgradeId);
    if (!requiredUpgrade || requiredUpgrade.level < upgrade.requirements.level) {
      return false; // Nincs meg a követelmény
    }
  }
  
  const currentUses = usesLeft[upgrade.id] ?? 0;
  return currentUses > 0 && upgrade.isUnlocked;
};

/**
 * canAffordUpgrade - Megfizethető-e az upgrade
 * 
 * @param {Object} upgrade - Upgrade objektum
 * @param {number} marketCap - Jelenlegi Market Cap
 * @returns {boolean} Megfizethető-e
 */
export const canAffordUpgrade = (upgrade, marketCap) => {
  const cost = calculateUpgradeCost(upgrade);
  return marketCap >= cost;
};

/**
 * getUpgradeCategories - Upgrade kategóriák szeparálása
 * 
 * @param {Array} upgrades - Upgrade lista
 * @returns {Object} Kategóriák
 */
export const getUpgradeCategories = (upgrades) => {
  return {
    click: upgrades.filter(u => u.type === 'click'),
    passive: upgrades.filter(u => u.type === 'passive')
  };
};

/**
 * formatUpgradeDescription - Upgrade leírás formázása
 * 
 * @param {string} description - Eredeti leírás
 * @returns {string} Formázott leírás
 */
export const formatUpgradeDescription = (description) => {
  return description.replace(/(\d+)/g, '$$$1');
};

/**
 * getUpgradeStatus - Upgrade státusz meghatározása
 * 
 * @param {Object} upgrade - Upgrade objektum
 * @param {Object} usesLeft - Maradék használatok
 * @param {number} marketCap - Jelenlegi Market Cap
 * @param {Array} allUpgrades - Összes upgrade (requirements ellenőrzéshez)
 * @returns {Object} Státusz információk
 */
export const getUpgradeStatus = (upgrade, usesLeft, marketCap, allUpgrades = []) => {
  const isUnlocked = isUpgradeUnlocked(upgrade, usesLeft, allUpgrades);
  const canAfford = canAffordUpgrade(upgrade, marketCap);
  const cost = calculateUpgradeCost(upgrade);
  
  return {
    isUnlocked,
    canAfford,
    cost,
    isDisabled: !isUnlocked || !canAfford
  };
};