import { useMemo } from 'react';

/**
 * useProgressCalculation - Progress számítás hook
 * 
 * Ez a hook számítja ki a játék progress bar értékét:
 * - Desktop/mobile különbségek
 * - Sub-thousand akkumulátor figyelembevétele
 * - Szintlépés progress számítás
 * 
 * @param {Object} displayValues - Megjelenítési értékek
 * @param {boolean} isDesktop - Desktop nézet flag
 * @returns {number} Progress érték (0-100)
 */
export const useProgressCalculation = (displayValues, isDesktop) => {
  const progress = useMemo(() => {
    const { safeMarketCap, safeSubThousand, safeMinMarketCap, next } = displayValues;
    
    let prog = 0;
    if (isDesktop) {
      if (next && safeMarketCap < next.threshold) {
        const denom = next.threshold - safeMinMarketCap;
        prog = denom > 0 ? Math.min(((safeMarketCap - safeMinMarketCap) / denom) * 100, 100) : 0;
      } else if (safeMarketCap >= 1e12) {
        prog = Math.min((safeSubThousand / 1e11) * 100, 100);
      } else if (safeMarketCap >= 1e9) {
        prog = Math.min((safeSubThousand / 1e8) * 100, 100);
      } else if (safeMarketCap >= 1e8) {
        prog = Math.min((safeSubThousand / 1e6) * 100, 100);
      } else {
        prog = Math.min((safeSubThousand / 1e5) * 100, 100);
      }
    } else {
      if (next && safeMarketCap < next.threshold) {
        const denom = next.threshold - safeMinMarketCap;
        prog = denom > 0 ? Math.min(((safeMarketCap - safeMinMarketCap) / denom) * 100, 100) : 0;
      } else if (safeMarketCap >= 1e12) {
        prog = Math.min((safeSubThousand / 1e11) * 100, 100);
      } else if (safeMarketCap >= 1e9) {
        prog = Math.min((safeSubThousand / 1e8) * 100, 100);
      } else if (safeMarketCap >= 1e8) {
        prog = Math.min((safeSubThousand / 1e6) * 100, 100);
      } else if (safeMarketCap >= 1e6) {
        prog = Math.min((safeSubThousand / 1e5) * 100, 100);
      } else {
        prog = Math.min((safeSubThousand / 1000) * 100, 100);
      }
    }
    
    return prog;
  }, [displayValues, isDesktop]);

  return progress;
};

