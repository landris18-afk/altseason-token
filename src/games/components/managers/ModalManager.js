import LevelUpModal from '../modals/LevelUpModal';
import CustomModal from '../modals/CustomModal';
import HowToPlayModal from '../modals/HowToPlayModal';
import SolanaPayModal from '../modals/SolanaPayModal';
import { gameLevels } from '../../data/gameLevels';

export default function ModalManager({
  // Level Up Modal
  isLevelUpModalOpen,
  setIsLevelUpModalOpen,
  levelIndex,
  twitterUrl,
  
  // Reset Modal
  isResetModalOpen,
  setIsResetModalOpen,
  confirmReset,
  onResetComplete,
  
  // Rules Modal
  isRulesModalOpen,
  setIsRulesModalOpen,
  
  // Solana Pay Modal
  isSolanaModalOpen,
  setIsSolanaModalOpen,
  activatePremiumUpgrade,
  solanaBlessingLevel
}) {
  return (
    <>
      <LevelUpModal
        isOpen={isLevelUpModalOpen}
        onClose={() => setIsLevelUpModalOpen(false)}
        levelName={gameLevels[levelIndex]?.name || "Unknown Level"}
        twitterUrl={twitterUrl}
        levelIndex={levelIndex}
      />
      
      <CustomModal 
        isOpen={isResetModalOpen} 
        onClose={() => setIsResetModalOpen(false)} 
        onConfirm={() => {
          confirmReset(() => {
            setIsResetModalOpen(false);
            if (onResetComplete) {
              onResetComplete();
            }
          });
        }} 
        title="Reset Game" 
        confirmText="Yes, Reset" 
        cancelText="No, Keep Progress"
      >
        <p>Are you sure you want to reset? All your progress and upgrades will be permanently deleted!</p>
      </CustomModal>
      
      <HowToPlayModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />
      
      <SolanaPayModal
        isOpen={isSolanaModalOpen}
        onClose={() => setIsSolanaModalOpen(false)}
        onPaymentSuccess={activatePremiumUpgrade}
        currentLevel={solanaBlessingLevel}
      />
    </>
  );
}

