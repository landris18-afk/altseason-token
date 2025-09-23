/**
 * leaderboardData.js - Leaderboard adatok és segédfunkciók
 * 
 * Ez a fájl tartalmazza a mock leaderboard adatokat és segédfunkciókat:
 * - Mock játékos adatok
 * - Score formázás
 * - Rank suffix meghatározás
 */

// Mock amerikai nevek listája
const americanNames = [
  'Alexander Johnson', 'Emma Williams', 'Michael Brown', 'Olivia Davis',
  'William Miller', 'Sophia Wilson', 'James Moore', 'Isabella Taylor',
  'Benjamin Anderson', 'Charlotte Thomas', 'Lucas Jackson', 'Amelia White',
  'Henry Harris', 'Mia Martin', 'Samuel Thompson', 'Harper Garcia',
  'Sebastian Martinez', 'Evelyn Robinson', 'Jack Clark', 'Abigail Rodriguez',
  'Owen Lewis', 'Emily Lee', 'Theodore Walker', 'Elizabeth Hall',
  'Levi Allen', 'Sofia Young', 'Daniel King', 'Avery Wright',
  'Luke Lopez', 'Ella Hill', 'Gabriel Scott', 'Scarlett Green',
  'Julian Adams', 'Victoria Baker', 'Mateo Nelson', 'Madison Carter',
  'Anthony Mitchell', 'Luna Perez', 'Isaac Roberts', 'Grace Turner',
  'Landon Phillips', 'Chloe Campbell', 'Mason Parker', 'Camila Evans',
  'Ethan Edwards', 'Penelope Collins', 'Logan Stewart', 'Riley Sanchez',
  'Mason Morris', 'Layla Rogers', 'Jackson Reed', 'Nora Cook',
  'Aiden Bailey', 'Zoey Morgan', 'Elijah Bell', 'Mila Murphy'
];

/**
 * Véletlenszerű szám generálás min és max között
 * @param {number} min - Minimum érték
 * @param {number} max - Maximum érték
 * @returns {number} Véletlenszerű szám
 */
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Mock leaderboard adatok generálása
 * @returns {Array} Mock játékos adatok
 */
export const mockLeaderboardData = americanNames.map((name, index) => ({
  id: index + 1,
  name: name,
  score: randomBetween(1000000, 50000000), // 1M - 50M közötti score
  level: randomBetween(1, 100) // 1-100 közötti level
})).sort((a, b) => b.score - a.score); // Score szerint csökkenő sorrend

/**
 * Score formázása
 * @param {number} score - Formázandó score
 * @returns {string} Formázott score string
 */
export const formatScore = (score) => {
  if (score >= 1000000000) {
    return `$${(score / 1000000000).toFixed(1)}B`;
  } else if (score >= 1000000) {
    return `$${(score / 1000000).toFixed(1)}M`;
  } else if (score >= 1000) {
    return `$${(score / 1000).toFixed(1)}K`;
  } else {
    return `$${score.toLocaleString()}`;
  }
};

/**
 * Rank suffix meghatározása
 * @param {number} rank - Rank szám
 * @returns {string} Rank suffix (st, nd, rd, th)
 */
export const getRankSuffix = (rank) => {
  const lastDigit = rank % 10;
  const lastTwoDigits = rank % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return 'th';
  }
  
  switch (lastDigit) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

