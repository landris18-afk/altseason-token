/**
 * calculations.js - Játék számítások
 * 
 * Ez a fájl tartalmazza a játék számítási segédfunkcióit:
 * - Market Cap formázás
 * - Számok formázása
 * - Progress számítások
 * - Megjelenítési értékek
 */

import { levelColors } from '../data/levelColors';
import { gameLevels } from '../data/gameLevels';
import { fmt } from './gameUtils';

/**
 * calculateDisplayValues - Megjelenítési értékek számítása
 * 
 * Ez a függvény számítja ki a játék megjelenítési értékeit:
 * - Market Cap formázás
 * - Click Power számítás
 * - Passive Income számítás
 * - Progress számítás
 * - Szint információk
 * 
 * @param {Object} gameState - Játék állapot
 * @param {number} subThousandAccumulator - Sub-thousand akkumulátor
 * @returns {Object} Megjelenítési értékek
 */
export const calculateDisplayValues = (gameState, subThousandAccumulator) => {
  const { marketCap, clickPower, passiveIncome, levelIndex, solanaBlessingLevel, hasPremiumUpgrade } = gameState;
  
  const displayedClickPower = clickPower * (solanaBlessingLevel + 1);
  const displayedPassiveIncome = hasPremiumUpgrade ? passiveIncome * 10 : passiveIncome;
  const current = gameLevels[levelIndex];
  const next = gameLevels[levelIndex + 1];
  
  const safeNumber = v => (typeof v === 'number' && !isNaN(v) ? v : 0);
  const safeMarketCap = safeNumber(marketCap);
  const safeSubThousand = safeNumber(subThousandAccumulator);
  const safeMinMarketCap = safeNumber(gameState.minMarketCapThisLevel);
  
  const progress = next ? 
    Math.min(100, ((safeMarketCap - current.threshold) / (next.threshold - current.threshold)) * 100) : 100;
  
  const colorIndex = Math.min(levelIndex, levelColors.length - 1);
  const currentLevelColor = levelColors[colorIndex] || levelColors[0];
  
  return {
    displayedClickPower,
    displayedPassiveIncome,
    current,
    next,
    safeMarketCap,
    safeSubThousand,
    safeMinMarketCap,
    progress,
    currentLevelColor
  };
};

export const generateShareData = (gameState) => {
  const { marketCap, levelIndex } = gameState;
  const current = gameLevels[levelIndex];
  
  const shareText = `Just became a ${current.name} with $${fmt(marketCap)} MC! The bull run is real - join before you miss out: assbull.meme #BullRun #Altseason @assbull2025`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  
  return {
    shareText,
    twitterUrl
  };
};






