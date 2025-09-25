import React, { useEffect, useState } from 'react';
import ModalManager from '../managers/ModalManager';
import GameSection from '../sections/GameSection';
import '../screens/LeaderboardLayout.css';

/**
 * BullRunGameWrapper - Játék wrapper komponens
 * 
 * Ez a komponens felelős a játék teljes UI struktúrájáért.
 * Csoportosítja a props-okat és továbbítja azokat a megfelelő
 * al-komponenseknek.
 * 
 * @param {Object} props - A játék összes szükséges adata
 * @returns {JSX.Element} A játék teljes UI struktúrája
 */
export default function BullRunGameWrapper({
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
  progress,
  currentTextColor,
  currentBarFrom,
  currentBarTo,
  
  // Share
  twitterUrl,
  
  // Header control
  showHeader = true,
  
  // Navigation
  onBackToLeaderboard
}) {
  // Mobile upgrades state
  const [showUpgrades, setShowUpgrades] = useState(false);
  
  console.log('🎮 BullRunGameWrapper - props received:', { 
    isLoaded, 
    onBackToLeaderboard, 
    current, 
    next, 
    gameState: !!gameState 
  });

  // Props csoportosítása a komponenseknek
  const gameRendererProps = {
    isLoaded,
    gameSectionProps: {
      current,
      next,
      currentTextColor,
      currentBarFrom,
      currentBarTo,
      progress,
      safeMarketCap,
      marketCap,
      subThousandAccumulator,
      isDesktop,
      gameState,
      handlePump,
      setIsRulesModalOpen,
      setIsResetModalOpen,
      setMuted,
      twitterUrl,
      muted,
      upgrades: gameState.upgrades,
      buyUpgrade: handleUpgrade,
      clickPower: gameState.clickPower,
      passiveIncome: gameState.passiveIncome,
      hasPremiumUpgrade: gameState.hasPremiumUpgrade,
      onSolanaUpgradeClick: () => setIsSolanaModalOpen(true),
      unlockSound,
      usesLeft: gameState.usesLeft,
      onBackToLeaderboard: onBackToLeaderboard,
      showUpgrades: showUpgrades,
      setShowUpgrades: setShowUpgrades
    },
    modalManagerProps: {
      isLevelUpModalOpen,
      setIsLevelUpModalOpen,
      levelIndex,
      twitterUrl,
      isResetModalOpen,
      setIsResetModalOpen,
      confirmReset,
      onResetComplete: onBackToLeaderboard,
      isRulesModalOpen,
      setIsRulesModalOpen,
      isSolanaModalOpen,
      setIsSolanaModalOpen,
      activatePremiumUpgrade,
      solanaBlessingLevel
    }
  };

  // Mindig GameSection-et használunk (nincs GameModal)
  console.log('🎮 BullRunGameWrapper - rendering GameSection directly');
  console.log('🎮 BullRunGameWrapper - gameSectionProps:', gameRendererProps.gameSectionProps);
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      {/* Game content - full screen */}
      <div className="w-full h-full">
        <GameSection 
          {...gameRendererProps.gameSectionProps} 
          onBackToLeaderboard={onBackToLeaderboard}
        />
      </div>
      
      <ModalManager {...gameRendererProps.modalManagerProps} />
    </div>
  );
}