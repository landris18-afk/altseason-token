import { useMemo } from 'react';
import { calculateDisplayValues } from '../utils/calculations';
import { useProgressCalculation } from './useProgressCalculation';

export const useDisplayValues = (gameState, subThousandAccumulator, isDesktop) => {
  const displayValues = useMemo(() => {
    return calculateDisplayValues(gameState, subThousandAccumulator);
  }, [gameState, subThousandAccumulator]);

  const progress = useProgressCalculation(displayValues, isDesktop);

  const {
    marketCap,
    clickPower,
    passiveIncome,
    upgrades,
    levelIndex,
    solanaBlessingLevel,
    hasPremiumUpgrade
  } = gameState;

  const {
    displayedClickPower,
    displayedPassiveIncome,
    current,
    next,
    safeMarketCap,
    safeSubThousand,
    safeMinMarketCap,
    currentLevelColor
  } = displayValues;

  const {
    text: currentTextColor,
    buttonBg: currentButtonBg,
    buttonShadow: currentButtonShadow,
    barFrom: currentBarFrom,
    barTo: currentBarTo
  } = currentLevelColor;

  return {
    // Game state values
    marketCap,
    clickPower,
    passiveIncome,
    upgrades,
    levelIndex,
    solanaBlessingLevel,
    hasPremiumUpgrade,
    
    // Display values
    displayedClickPower,
    displayedPassiveIncome,
    current,
    next,
    safeMarketCap,
    safeSubThousand,
    safeMinMarketCap,
    
    // Progress
    progress,
    
    // Colors
    currentTextColor,
    currentButtonBg,
    currentButtonShadow,
    currentBarFrom,
    currentBarTo
  };
};

