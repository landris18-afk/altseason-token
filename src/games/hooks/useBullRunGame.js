import { useEffect } from 'react';
import { useGameState } from './useGameState';
import { useAudioManager } from './useAudioManager';
import { useGameLogic } from './useGameLogic';
import { useModalManager } from './useModalManager';
import { usePassiveIncome } from './usePassiveIncome';
import { useLevelUp } from './useLevelUp';
import { useUpgradeUnlock } from './useUpgradeUnlock';
import { useDesktopDetection } from './useDesktopDetection';
import { useModalScrollLock } from './useModalScrollLock';
import { useDisplayValues } from './useDisplayValues';
import { useShare } from './useShare';
import { useMute } from '../components/context/MuteContext';

/**
 * useBullRunGame - Master hook a játék összes logikájához
 * 
 * Ez a hook összegyűjti és koordinálja a játék összes funkcióját:
 * - Játékállapot kezelés
 * - Audio kezelés
 * - Modal kezelés
 * - Játék logika
 * - UI állapot
 * - Megjelenítési értékek
 * - Megosztás funkciók
 * 
 * @returns {Object} A játék összes szükséges adata és funkciója
 */
export const useBullRunGame = () => {
  // Game state
  const {
    gameState,
    setGameState,
    isLoaded,
    subThousandAccumulator,
    setSubThousandAccumulator,
    lastReqLevelRef,
    confirmReset,
    clearUserCache,
    isResetting
  } = useGameState();

  // Audio management
  const {
    pumpSound,
    levelUpSound,
    unlockSound,
    upgradeSound,
    playPumpSound,
    playLevelUpSound,
    playUnlockSound,
    playUpgradeSound
  } = useAudioManager();

  // Modal management
  const {
    isResetModalOpen,
    setIsResetModalOpen,
    isLevelUpModalOpen,
    setIsLevelUpModalOpen,
    isSolanaModalOpen,
    setIsSolanaModalOpen,
    isRulesModalOpen,
    setIsRulesModalOpen,
    anyModalOpen
  } = useModalManager();

  // Game logic
  const {
    handlePump,
    handleUpgrade,
    activatePremiumUpgrade,
    buySolanaBlessing
  } = useGameLogic(gameState, setGameState, subThousandAccumulator, setSubThousandAccumulator, playPumpSound, playUpgradeSound, playUnlockSound);

  // Desktop detection
  const isDesktop = useDesktopDetection();
  
  // Mute context
  const { muted, setMuted } = useMute();

  // Game effects
  useLevelUp(gameState, setGameState, isLoaded, levelUpSound, muted, setIsLevelUpModalOpen, confirmReset);
  useUpgradeUnlock(gameState, setGameState, isLoaded, unlockSound, muted, lastReqLevelRef);
  useModalScrollLock(anyModalOpen);
  usePassiveIncome(gameState, setGameState, subThousandAccumulator, setSubThousandAccumulator, isDesktop);

  // Display values
  const {
    marketCap,
    clickPower,
    passiveIncome,
    upgrades,
    levelIndex,
    solanaBlessingLevel,
    hasPremiumUpgrade,
    displayedClickPower,
    displayedPassiveIncome,
    current,
    next,
    safeMarketCap,
    safeSubThousand,
    safeMinMarketCap,
    progress: prog,
    currentTextColor,
    currentButtonBg,
    currentButtonShadow,
    currentBarFrom,
    currentBarTo
  } = useDisplayValues(gameState, subThousandAccumulator, isDesktop);


  // Share functionality
  const { shareText, twitterUrl, handleCustomShare } = useShare(gameState);

  return {
    // Game state
    gameState,
    isLoaded,
    subThousandAccumulator,
    confirmReset,
    
    // Audio
    unlockSound,
    
    // Modals
    isResetModalOpen,
    setIsResetModalOpen,
    isLevelUpModalOpen,
    setIsLevelUpModalOpen,
    isSolanaModalOpen,
    setIsSolanaModalOpen,
    isRulesModalOpen,
    setIsRulesModalOpen,
    
    // Game logic
    handlePump,
    handleUpgrade,
    activatePremiumUpgrade,
    
    // UI state
    isDesktop,
    muted,
    setMuted,
    
    // Display values
    marketCap,
    clickPower,
    passiveIncome,
    upgrades,
    levelIndex,
    solanaBlessingLevel,
    hasPremiumUpgrade,
    current,
    next,
    safeMarketCap,
    safeMinMarketCap,
    progress: prog,
    currentTextColor,
    currentBarFrom,
    currentBarTo,
    
    // Share
    twitterUrl,
    
    // Cache management
    clearUserCache,
    
    // Reset state
    isResetting
  };
};