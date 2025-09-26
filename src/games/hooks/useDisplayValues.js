import { useMemo } from 'react';
import { calculateDisplayValues } from '../utils/calculations';

export const useDisplayValues = (gameState, isDesktop) => {
  const displayValues = useMemo(() => {
    if (!gameState || gameState.marketCap === undefined) {
      // Alapértelmezett értékek a gameLevels-ből
      const defaultCurrent = { threshold: 0, name: "Wet-Noodle-Handed Normie Who Missed Every Pump Since 2013" };
      const defaultNext = { threshold: 100, name: "Sandbox Bull Noob" };
      
      return {
        displayedClickPower: 1,
        displayedPassiveIncome: 0,
        current: defaultCurrent,
        next: defaultNext,
        safeMarketCap: 0,
        safeSubThousand: 0,
        safeMinMarketCap: 0,
        progress: 0,
        currentLevelColor: { text: '#ffffff', buttonBg: '#374151', buttonShadow: '#1f2937', barFrom: '#374151', barTo: '#1f2937' }
      };
    }
    
    return calculateDisplayValues(gameState, gameState.subThousandAccumulator || 0);
  }, [gameState]);

  const {
    marketCap = 0,
    clickPower = 1,
    passiveIncome = 0,
    upgrades = [],
    levelIndex = 0,
    solanaBlessingLevel = 0,
    hasPremiumUpgrade = false
  } = gameState || {};

  const {
    displayedClickPower = 1,
    displayedPassiveIncome = 0,
    current = null,
    next = null,
    safeMarketCap = 0,
    safeSubThousand = 0,
    safeMinMarketCap = 0,
    progress = 0,
    currentLevelColor = { text: '#ffffff', buttonBg: '#374151', buttonShadow: '#1f2937', barFrom: '#374151', barTo: '#1f2937' }
  } = displayValues || {};

  const {
    text: currentTextColor = '#ffffff',
    buttonBg: currentButtonBg = '#374151',
    buttonShadow: currentButtonShadow = '#1f2937',
    barFrom: currentBarFrom = '#374151',
    barTo: currentBarTo = '#1f2937'
  } = currentLevelColor || {};

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

