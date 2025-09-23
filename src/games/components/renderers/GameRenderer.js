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

  if (!isTermsAccepted || !isGameModalOpen) {
    return (
      <>
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

  // Ha a terms elfogadva van ÉS a játék modal nyitva van, akkor a játék az oldalon jelenjen meg
  return (
    <>
      {/* Játék az oldalon */}
      {children}
      
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

