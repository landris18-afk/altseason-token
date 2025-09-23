import { useCallback } from 'react';
import { usePumpLogic } from './usePumpLogic';
import { useUpgradeLogic } from './useUpgradeLogic';

/**
 * useGameLogic - Játék logika koordinátor hook
 * 
 * Ez a hook koordinálja a játék fő logikai funkcióit:
 * - Pump logika (kattintás kezelés)
 * - Upgrade logika (fejlesztések vásárlása)
 * - Premium upgrade aktiválás
 * - Solana blessing vásárlás
 * 
 * @param {Object} gameState - Játék állapot
 * @param {Function} setGameState - Játék állapot frissítő
 * @param {number} subThousandAccumulator - Sub-thousand akkumulátor
 * @param {Function} setSubThousandAccumulator - Sub-thousand akkumulátor frissítő
 * @param {Function} playPumpSound - Pump hang lejátszó
 * @param {Function} playUpgradeSound - Upgrade hang lejátszó
 * @param {Function} playUnlockSound - Unlock hang lejátszó
 * @returns {Object} Játék logikai funkciók
 */
export const useGameLogic = (
  gameState,
  setGameState,
  subThousandAccumulator,
  setSubThousandAccumulator,
  playPumpSound,
  playUpgradeSound,
  playUnlockSound
) => {
  // Pump logika kiemelése
  const { handlePump } = usePumpLogic(
    gameState,
    setGameState,
    subThousandAccumulator,
    setSubThousandAccumulator,
    playPumpSound
  );

  // Upgrade logika kiemelése
  const { handleUpgrade } = useUpgradeLogic(
    gameState,
    setGameState,
    playUpgradeSound,
    playUnlockSound
  );

  // Premium upgrade aktiválása
  const activatePremiumUpgrade = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      hasPremiumUpgrade: true,
      solanaBlessingLevel: prevState.solanaBlessingLevel + 1
    }));
  }, [setGameState]);

  // Solana blessing vásárlása
  const buySolanaBlessing = useCallback(() => {
    const currentLevel = gameState.solanaBlessingLevel;
    if (currentLevel >= 9) return; // Maximum 10x (0-9 szint)

    const basePrice = 0.05; // Első szint ára
    const price = basePrice * Math.pow(1.5, currentLevel); // 50% emelkedés minden szinten

    // Itt majd a Solana fizetés kezelése lesz
    // Sikeres fizetés után:
    setGameState(prevState => ({
      ...prevState,
      solanaBlessingLevel: prevState.solanaBlessingLevel + 1
    }));
  }, [gameState.solanaBlessingLevel, setGameState]);

  return {
    handlePump,
    handleUpgrade,
    activatePremiumUpgrade,
    buySolanaBlessing
  };
};
