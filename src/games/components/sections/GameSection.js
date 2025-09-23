import GameHeader from '../ui/GameHeader';
import MainGamePanel from '../panels/MainGamePanel';
import UpgradesPanel from '../panels/UpgradesPanel';

export default function GameSection({
  // Main game panel props
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
  
  // Upgrades panel props
  upgrades,
  buyUpgrade,
  clickPower,
  passiveIncome,
  hasPremiumUpgrade,
  onSolanaUpgradeClick,
  unlockSound,
  usesLeft
}) {
  return (
    <section id="game" className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-6 text-center max-w-7xl">
        <GameHeader />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Panel */}
          <MainGamePanel
            current={current}
            next={next}
            currentTextColor={currentTextColor}
            currentBarFrom={currentBarFrom}
            currentBarTo={currentBarTo}
            progress={progress}
            safeMarketCap={safeMarketCap}
            marketCap={marketCap}
            subThousandAccumulator={subThousandAccumulator}
            isDesktop={isDesktop}
            gameState={gameState}
            handlePump={handlePump}
            setIsRulesModalOpen={setIsRulesModalOpen}
            setIsResetModalOpen={setIsResetModalOpen}
            setMuted={setMuted}
            twitterUrl={twitterUrl}
            muted={muted}
          />

          {/* Upgrades Panel */}
          <UpgradesPanel 
            upgrades={upgrades}
            marketCap={marketCap}
            buyUpgrade={buyUpgrade}
            clickPower={clickPower}
            passiveIncome={passiveIncome}
            hasPremiumUpgrade={hasPremiumUpgrade}
            onSolanaUpgradeClick={onSolanaUpgradeClick}
            unlockSound={unlockSound}
            usesLeft={usesLeft}
          />
        </div>
      </div>
    </section>
  );
}

