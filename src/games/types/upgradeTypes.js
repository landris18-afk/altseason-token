/**
 * upgradeTypes.js - Upgrade típusok és interfészek
 * 
 * Ez a fájl tartalmazza az upgrade-ekkel kapcsolatos típusokat:
 * - Props interfészek
 * - Állapot típusok
 * - Konfigurációs típusok
 */

/**
 * UpgradeProps - Upgrade panel props interfész
 * 
 * @typedef {Object} UpgradeProps
 * @property {Array} upgrades - Upgrade lista
 * @property {number} marketCap - Market Cap érték
 * @property {Function} buyUpgrade - Upgrade vásárlás funkció
 * @property {number} clickPower - Click power érték
 * @property {number} passiveIncome - Passzív jövedelem
 * @property {boolean} hasPremiumUpgrade - Premium upgrade flag
 * @property {Audio} unlockSound - Unlock hang
 * @property {Object} usesLeft - Maradék használatok
 */

/**
 * UpgradeState - Upgrade panel állapot interfész
 * 
 * @typedef {Object} UpgradeState
 * @property {Object|null} selectedUpgrade - Kiválasztott upgrade
 * @property {Object|null} insufficientFundsUpgrade - Elégtelen források upgrade
 * @property {string} activeTab - Aktív tab
 * @property {boolean} forceUpdate - Force update flag
 * @property {Function} setActiveTab - Tab váltó funkció
 * @property {Function} handleUpgradeClick - Upgrade kattintás kezelő
 * @property {Function} handleCloseRequirementsModal - Requirements modal bezárása
 * @property {Function} handleCloseInsufficientFundsModal - Insufficient funds modal bezárása
 */

/**
 * UpgradeConfig - Upgrade konfiguráció interfész
 * 
 * @typedef {Object} UpgradeConfig
 * @property {Object} UpgradeProps - Props konfiguráció
 * @property {Object} UpgradeState - Állapot konfiguráció
 */

export const upgradeTypes = {
  UpgradeProps: 'UpgradeProps',
  UpgradeState: 'UpgradeState',
  UpgradeConfig: 'UpgradeConfig'
};
