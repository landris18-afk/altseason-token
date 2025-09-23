import LoadingScreen from '../ui/LoadingScreen';
import TermsOverlay from '../overlays/TermsOverlay';
import GameModal from '../modals/GameModal';

export default function GameRenderer({
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
  gameSectionProps,
  modalManagerProps,
  children
}) {
  if (!isLoaded) {
    return <LoadingScreen />;
  }

  return (
    <>
      {/* Terms Overlay - csak akkor jelenik meg, ha nincs elfogadva */}
      {!isTermsAccepted && (
        <TermsOverlay
          setMuted={setMuted}
          muted={muted}
          setIsTermsModalOpen={setIsTermsModalOpen}
          isTermsModalOpen={isTermsModalOpen}
          isCheckboxChecked={isCheckboxChecked}
          setIsCheckboxChecked={setIsCheckboxChecked}
          acceptTerms={acceptTerms}
          onStartGame={startGame}
        />
      )}
      
      {/* Játék az oldalon - csak akkor jelenik meg, ha a modal nyitva van */}
      {isGameModalOpen && children}
      
      {/* Játék Modal - csak akkor nyílik meg, ha startGame hívódik */}
      <GameModal
        isOpen={isGameModalOpen}
        onClose={closeGameModal}
        gameSectionProps={gameSectionProps}
        modalManagerProps={modalManagerProps}
      />
    </>
  );
}

