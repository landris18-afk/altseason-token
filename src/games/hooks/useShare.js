import { useMemo } from 'react';
import { generateShareData } from '../utils/calculations';

/**
 * useShare - Megosztás hook
 * 
 * Ez a hook kezeli a játék megosztási funkcióit:
 * - Share szöveg generálása
 * - Twitter URL létrehozása
 * - Megosztás kezelése
 * 
 * @param {Object} gameState - Játék állapot
 * @returns {Object} Megosztási funkciók
 */
export const useShare = (gameState) => {
  const shareData = useMemo(() => {
    return generateShareData(gameState);
  }, [gameState]);

  const { shareText, twitterUrl } = shareData;

  // Egyedi megosztás kezelése
  const handleCustomShare = () => {
    // Jelenleg standard Twitter megosztást használunk
    // A jövőben Twitter API-val lehetne fejleszteni media upload-hoz
    window.open(twitterUrl, '_blank');
  };

  return {
    shareText,
    twitterUrl,
    handleCustomShare
  };
};