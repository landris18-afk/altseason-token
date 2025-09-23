import React from 'react';
import ModalManager from '../managers/ModalManager';
import GameRenderer from '../renderers/GameRenderer';
import GameSection from '../sections/GameSection';
import { useGameModal } from '../../hooks/useGameModal';

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
  isTermsModalOpen,
  setIsTermsModalOpen,
  isTermsAccepted,
  setIsTermsAccepted,
  isRulesModalOpen,
  setIsRulesModalOpen,
  isCheckboxChecked,
  setIsCheckboxChecked,
  acceptTerms,
  
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
  twitterUrl
}) {
  // Játék modal hook használata
  const { isGameModalOpen, closeGameModal: originalCloseGameModal, startGame: originalStartGame } = useGameModal();
  
  // Játék indítás terms elfogadással
  const startGame = () => {
    originalStartGame(acceptTerms, setIsTermsModalOpen);
  };

  // Modal bezárás terms visszaállítással
  const closeGameModal = () => {
    const resetTerms = () => {
      setIsTermsAccepted(false);
      setIsCheckboxChecked(false);
    };
    originalCloseGameModal(resetTerms);
  };

  // Props csoportosítása a komponenseknek
  const gameRendererProps = {
    isLoaded,
    isTermsAccepted,
    setMuted,
    muted,
    setIsTermsModalOpen,
    isTermsModalOpen,
    isCheckboxChecked,
    setIsCheckboxChecked,
    acceptTerms,
    isGameModalOpen,
    closeGameModal,
    startGame,
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
      usesLeft: gameState.usesLeft
    },
    modalManagerProps: {
      isLevelUpModalOpen,
      setIsLevelUpModalOpen,
      levelIndex,
      twitterUrl,
      isResetModalOpen,
      setIsResetModalOpen,
      confirmReset,
      onResetComplete: closeGameModal,
      isRulesModalOpen,
      setIsRulesModalOpen,
      isSolanaModalOpen,
      setIsSolanaModalOpen,
      activatePremiumUpgrade,
      solanaBlessingLevel
    }
  };

  return (
    <GameRenderer {...gameRendererProps}>
      <ModalManager {...gameRendererProps.modalManagerProps} />
      <GameSection {...gameRendererProps.gameSectionProps} />
    </GameRenderer>
  );
}
