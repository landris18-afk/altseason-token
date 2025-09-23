/**
 * gameData.js - Játék adatok
 * 
 * Ez a fájl tartalmazza a játék kezdő állapotát és alapvető adatait:
 * - Kezdő Market Cap és értékek
 * - Upgrade definíciók
 * - Használatok kezdő értékei
 */

/**
 * getInitialState - Játék kezdő állapot
 * 
 * Visszaadja a játék kezdő állapotát minden új játék indításakor:
 * - Alapértékek beállítása
 * - Upgrade-ek inicializálása
 * - Használatok beállítása
 * 
 * @returns {Object} Játék kezdő állapot objektum
 */
export const getInitialState = () => ({
  // Alapértékek
  marketCap: 0,
  clickPower: 1,
  passiveIncome: 0,
  levelIndex: 0,
  solanaBlessingLevel: 0,
  hasPremiumUpgrade: false,
  totalClicks: 0,
  
  // Használatok kezdő értékei
  usesLeft: {
    1: Infinity, // Diamond Hands: végtelen
    2: Infinity, // Bull's Strength: végtelen
    3: Infinity, // Moon Shot: végtelen
    4: Infinity, // Shill Army: végtelen
    5: 100, // FOMO Generator: 100 használat
    6: 20 // Whale Magnet: 20 használat
  },
  // Upgrade definíciók
  upgrades: [
    { 
      id: 1, 
      name: "Diamond Hands", 
      description: "+1 Click Power", 
      baseCost: 100, 
      level: 0, 
      power: 1, 
      type: 'click' 
    },
    { 
      id: 2, 
      name: "Bull's Strength", 
      description: "+5 Click Power", 
      baseCost: 400, 
      level: 0, 
      power: 5, 
      type: 'click',
      requirements: {
        upgradeId: 1,
        level: 10
      }
    },
    { 
      id: 3, 
      name: "Moon Shot", 
      description: "+10 Click Power", 
      baseCost: 500, 
      level: 0, 
      power: 10, 
      type: 'click',
      requirements: {
        upgradeId: 2,
        level: 10
      }
    },
    { 
      id: 4, 
      name: "Shill Army", 
      description: "+1 MC/sec", 
      baseCost: 10000, 
      level: 0, 
      power: 1, 
      type: 'passive',
      requirements: {
        upgradeId: 3,
        level: 10
      }
    },
    { 
      id: 5, 
      name: "FOMO Generator", 
      description: "+10 MC/sec", 
      baseCost: 80000, 
      level: 0, 
      power: 10, 
      type: 'passive',
      requirements: {
        upgradeId: 4,
        level: 10
      }
    },
    { 
      id: 6, 
      name: "Whale Magnet", 
      description: "+50 MC/sec", 
      baseCost: 250000, 
      level: 0, 
      power: 50, 
      type: 'passive',
      requirements: {
        upgradeId: 5,
        level: 15
      }
    }
  ],
  
  // Szint követés
  minMarketCapThisLevel: 0
});






