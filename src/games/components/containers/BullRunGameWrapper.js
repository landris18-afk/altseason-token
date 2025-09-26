import React, { useEffect, useState } from 'react';
import ModalManager from '../managers/ModalManager';
import GameSection from '../sections/GameSection';
import '../screens/css/LeaderboardLayout.css';

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
  isSaving,
  isResetting,
  
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
  onBackToLeaderboard,
  
  // Cache management
  clearUserCache
}) {
  // Mobile upgrades state
  const [showUpgrades, setShowUpgrades] = useState(false);

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
      isSaving,
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
      onBackToLeaderboard,
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
      isResetting,
      isRulesModalOpen,
      setIsRulesModalOpen,
      isSolanaModalOpen,
      setIsSolanaModalOpen,
      activatePremiumUpgrade,
      solanaBlessingLevel
    }
  };

  // Loading komponens
  if (!isLoaded) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl font-semibold">Játék betöltése...</p>
          <p className="text-sm text-gray-300 mt-2">Adatbázisból betöltjük az adatokat</p>
        </div>
      </div>
    );
  }

  // Mindig GameSection-et használunk (nincs GameModal)
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