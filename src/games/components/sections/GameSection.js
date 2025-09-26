import MainGamePanel from '../panels/MainGamePanel';
import UpgradesPanel from '../panels/UpgradesPanel';
import { getUpgradeCategories, isUpgradeUnlocked, canAffordUpgrade } from '../../utils/upgradeUtils';
import '../screens/css/LeaderboardLayout.css';

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
  isSaving,
  
  // Upgrades panel props
  upgrades,
  buyUpgrade,
  clickPower,
  passiveIncome,
  hasPremiumUpgrade,
  onSolanaUpgradeClick,
  unlockSound,
  usesLeft,
  
  // Navigation
  onBackToLeaderboard,
  
  // Mobile upgrades state
  showUpgrades,
  setShowUpgrades
}) {
  
  // Elérhető upgrade-ek számának kiszámítása
  const availableUpgrades = upgrades ? (() => {
    const { click, passive } = getUpgradeCategories(upgrades);
    const availableClick = click.filter(upgrade => 
      isUpgradeUnlocked(upgrade, usesLeft, upgrades) && canAffordUpgrade(upgrade, marketCap)
    ).length;
    const availablePassive = passive.filter(upgrade => 
      isUpgradeUnlocked(upgrade, usesLeft, upgrades) && canAffordUpgrade(upgrade, marketCap)
    ).length;
    return availableClick + availablePassive;
  })() : 0;

  return (
    <div 
      className="leaderboard-screen"
      style={{
        backgroundImage: 'url(/images/rockat_pump_bacground.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        pointerEvents: isSaving ? 'none' : 'auto'
      }}
    >
      
      {/* Desktop: Centered container with margins */}
      <div className="desktop-leaderboard-container relative z-10">
        <div className="desktop-leaderboard-panel">
          <div className="leaderboard-container">
            <div className="grid grid-cols-1 xl:grid-cols-3 h-full">
        {/* Main Panel */}
        <div className="xl:col-span-2">
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
        </div>

        {/* Upgrades Panel */}
        <div className="xl:col-span-1 relative">
          {/* Bal oldali elválasztó vonal asztali nézetben */}
          <div className="hidden xl:block absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-yellow-400/30 to-transparent"></div>
          
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
            onBackToLeaderboard={onBackToLeaderboard}
            isSaving={isSaving}
          />
          
          {/* Back button - positioned at top right of upgrades panel */}
          <button
            onClick={() => onBackToLeaderboard(false)}
            disabled={isSaving}
            className={`absolute top-4 right-4 transition-all duration-500 ease-in-out rounded-full backdrop-blur-sm border z-20 overflow-hidden ${
              isSaving
                ? 'bg-red-600 text-white border-red-500 cursor-not-allowed px-4 py-2'
                : 'bg-gray-800/80 hover:bg-gray-700/90 text-white/80 hover:text-white border-yellow-400/30 hover:border-yellow-400/50 p-2'
            }`}
            style={isSaving ? { 
              backgroundColor: '#dc2626', 
              color: 'white', 
              cursor: 'not-allowed',
              width: 'auto',
              minWidth: '120px',
              pointerEvents: 'auto'
            } : {
              width: '40px',
              height: '40px',
              pointerEvents: 'auto'
            }}
            title={isSaving ? "Saving..." : "Back to Leaderboard"}
          >
            {isSaving ? (
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-sm font-medium">Saving</span>
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
              </div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            )}
          </button>
        </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Full width layout */}
      <div className="mobile-leaderboard-container relative z-10">
        <div className="leaderboard-container">
          {!showUpgrades ? (
            /* Main Panel with Header */
            <div className="relative h-full flex flex-col">
              {/* Mobile Game Header - Top (same as upgrade header) */}
              <div className="flex justify-between items-center mb-2 px-6 py-4 bg-gray-800 border-b border-yellow-400">
                <div className="relative">
                  <button 
                    className="start-game-btn" 
                    onClick={() => setShowUpgrades(true)}
                  >
                    Upgrades
                  </button>
                  {availableUpgrades > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold z-10">
                      {availableUpgrades}
                    </span>
                  )}
                </div>
                
                <button
                  onClick={() => onBackToLeaderboard(false)}
                  disabled={isSaving}
                  className={`rounded-xl border transition-all duration-500 ease-in-out overflow-hidden ${
                    isSaving
                      ? 'bg-red-600 text-white border-red-500 cursor-not-allowed px-4 py-2'
                      : 'bg-gray-800/90 hover:bg-gray-700/95 text-white/90 hover:text-white border-gray-600/60 hover:border-gray-500/80 px-3 py-2'
                  }`}
                  style={isSaving ? { 
                    backgroundColor: '#dc2626', 
                    color: 'white', 
                    cursor: 'not-allowed',
                    width: 'auto',
                    minWidth: '120px',
                    pointerEvents: 'auto'
                  } : {
                    pointerEvents: 'auto'
                  }}
                  title={isSaving ? "Saving..." : "Back to Leaderboard"}
                >
                  {isSaving ? (
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="text-sm font-medium">Saving</span>
                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                    </div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  )}
                </button>
              </div>
              
              {/* Main Game Content */}
              <div className="flex-1">
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
              </div>
            </div>
          ) : (
            /* Upgrades Panel with Header */
            <div className="relative h-full flex flex-col">
              {/* Mobile Upgrades Header - Top */}
              <div className="flex justify-between items-center mb-2 px-6 py-4 bg-gray-800 border-b border-yellow-400">
                <h2 className="text-4xl font-bold text-gray-300">Upgrades</h2>
                
                <button
                  onClick={() => setShowUpgrades(false)}
                  className="bg-gray-800/90 hover:bg-gray-700/95 text-white/90 hover:text-white transition-all duration-200 rounded-xl px-3 py-2 backdrop-blur-sm border border-gray-600/60 hover:border-gray-500/80 shadow-lg hover:shadow-xl"
                  title="Back to Game"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
              
              {/* Upgrades Content */}
              <div className="flex-1 overflow-y-auto">
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
                  onBackToLeaderboard={onBackToLeaderboard}
                  isSaving={isSaving}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}