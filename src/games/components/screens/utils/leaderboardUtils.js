/**
 * Leaderboard utility függvények
 * 
 * Ez a fájl tartalmazza a ranglista használt utility függvényeket
 */

/**
 * Szám formázása (K, M formátum)
 * @param {number} number - Formázandó szám
 * @returns {string} Formázott szám
 */
export const formatNumber = (number) => {
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  } else if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  } else {
    return number.toFixed(0);
  }
};

/**
 * Current user adatok létrehozása
 * @param {Object} params - Paraméterek
 * @returns {Object|null} Current user objektum vagy null
 */
export const createCurrentUser = ({
  isSignedIn,
  displayName,
  playerStats,
  user,
  isDesktop
}) => {
  if (!isSignedIn || !displayName || !playerStats) {
    return null;
  }

  return {
    id: 'current-user',
    name: displayName,
    marketCap: playerStats.marketCap,
    level: playerStats.levelIndex + 1,
    platform: isDesktop ? 'desktop' : 'mobile',
    clickPower: playerStats.clickPower || 0,
    passiveIncome: playerStats.passiveIncome || 0,
    isCurrentUser: true,
    userId: user?.id
  };
};

/**
 * Current user rank számítása
 * @param {Object} params - Paraméterek
 * @returns {number|null} Rank vagy null
 */
export const calculateCurrentUserRank = ({
  playerRank,
  playerStats,
  leaderboardPlayers
}) => {
  if (playerRank) {
    return playerRank;
  }

  if (!playerStats) {
    return null;
  }

  let rank = 1;
  for (const player of leaderboardPlayers) {
    if (playerStats.marketCap > (player.marketCap || player.score)) {
      break;
    }
    rank++;
  }
  return rank;
};

/**
 * Expanded players state frissítése
 * @param {Set} prevExpanded - Előző expanded state
 * @param {string} playerId - Játékos ID
 * @returns {Set} Új expanded state
 */
export const updateExpandedPlayers = (prevExpanded, playerId) => {
  const newSet = new Set();
  if (!prevExpanded.has(playerId)) {
    newSet.add(playerId);
  }
  return newSet;
};
