/**
 * GameContent.js - Játék tartalom komponens
 * 
 * Ez a komponens csak a játék panelokat tartalmazza:
 * - Main Game Panel
 * - Upgrades Panel
 * - Header nélkül
 */

import MainGamePanel from '../panels/MainGamePanel';
import UpgradesPanel from '../panels/UpgradesPanel';
import { useState } from 'react';

/**
 * GameContent - Játék tartalom komponens
 * 
 * @param {Object} props - Props objektum
 * @param {Object} props.current - Jelenlegi szint
 * @param {Object} props.next - Következő szint
 * @param {string} props.currentTextColor - Jelenlegi szöveg szín
 * @param {string} props.currentBarFrom - Progress bar kezdő szín
 * @param {string} props.currentBarTo - Progress bar végző szín
 * @param {number} props.progress - Progress érték
 * @param {number} props.safeMarketCap - Biztonságos Market Cap
 * @param {number} props.marketCap - Market Cap
 * @param {number} props.subThousandAccumulator - Sub-thousand akkumulátor
 * @param {boolean} props.isDesktop - Desktop nézet flag
 * @param {Object} props.gameState - Játék állapot
 * @param {Function} props.handlePump - Pump kezelő
 * @param {Function} props.setIsRulesModalOpen - Rules modal nyitó
 * @param {Function} props.setIsResetModalOpen - Reset modal nyitó
 * @param {Function} props.setMuted - Némítás beállító
 * @param {string} props.twitterUrl - Twitter URL
 * @param {boolean} props.muted - Némított állapot
 * @param {Array} props.upgrades - Upgrade lista
 * @param {Function} props.buyUpgrade - Upgrade vásárlás
 * @param {number} props.clickPower - Click power
 * @param {number} props.passiveIncome - Passzív jövedelem
 * @param {boolean} props.hasPremiumUpgrade - Premium upgrade flag
 * @param {Function} props.onSolanaUpgradeClick - Solana upgrade kattintás
 * @param {Audio} props.unlockSound - Unlock hang
 * @param {Object} props.usesLeft - Maradék használatok
 * @returns {JSX.Element} Játék tartalom komponens
 */
const GameContent = ({
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
  usesLeft,

  // Player info
  playerName,
  
  // Navigation
  onBackToLeaderboard,
  
  // Upgrades page state
  showUpgradesPage,
  setShowUpgradesPage,
  
  // Available upgrades count
  availableUpgradesCount
}) => {
  return (
    <div className="w-full h-full text-white" style={{
      background: 'url(/images/rockat_pump_bacground.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Finom sötétítés mindkét nézetben */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none z-[9997]"></div>
      <div className="w-full h-full">
        <div className="relative h-full">
          {/* Desktop: Single container with MainGamePanel and extending UpgradesPanel */}
          <div className="hidden md:block relative h-full">
            {/* Main container - centered with margins */}
            <div className="absolute top-0 left-0 w-full h-full z-10 flex items-center justify-center p-8">
              <div className="w-full max-w-6xl h-5/6 bg-gradient-to-r from-slate-900/50 via-gray-800/40 to-gray-800/50 shadow-2xl shadow-black/50 flex overflow-hidden rounded-2xl border-2 border-yellow-400/60">
                {/* Main Game Panel - Left side */}
                <div className="w-2/3 h-full bg-gradient-to-br from-slate-900/50 to-gray-800/40 border-l border-t border-b border-white/10">
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
                
                {/* Yellow separator line */}
                <div className="w-0.5 h-full bg-yellow-400/60"></div>
                
                {/* Upgrades Panel - Right side */}
                <div className="w-1/3 h-full bg-gradient-to-br from-gray-800/50 to-slate-700/40 rounded-r-2xl border-r border-t border-b border-white/10">
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
            </div>
          </div>

          {/* Mobile/Tablet: Conditional rendering - Game or Upgrades page */}
          <div className="md:hidden h-full relative overflow-y-auto">
            {!showUpgradesPage ? (
              // Game page
              <div className="pt-6">
                {/* Mobile Header - INSIDE SCROLLABLE CONTAINER */}
                <div className="md:hidden flex justify-between items-center mb-6 px-6">
                  <button
                    onClick={() => setShowUpgradesPage(true)}
                    className="relative bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black py-2 px-4 rounded-lg font-bold text-sm transition-all hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 hover:shadow-lg hover:shadow-yellow-500/25 backdrop-blur-sm border border-yellow-600/50 hover:border-yellow-500/70 uppercase tracking-wide"
                    style={{
                      background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 25%, #f1c40f 50%, #f39c12 75%, #e67e22 100%)',
                      border: '1px solid #f39c12',
                      boxShadow: '0 2px 8px rgba(241, 196, 15, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <span className="flex items-center space-x-2">
                      <span>Upgrades</span>
                      {availableUpgradesCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg">
                          {availableUpgradesCount}
                        </span>
                      )}
                    </span>
                  </button>

                  <button
                    onClick={onBackToLeaderboard}
                    className="bg-gray-800/80 hover:bg-gray-700/90 text-white/80 hover:text-white transition-all duration-200 rounded-full p-2 backdrop-blur-sm border border-gray-600/50 hover:border-gray-500/70"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                </div>
                
                <div className="md:hidden mb-2 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent"></div>
                
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
            ) : (
              // Upgrades page
              <div className="pt-6">
                {/* Mobile Header - INSIDE SCROLLABLE CONTAINER */}
                <div className="md:hidden flex justify-between items-center mb-6 px-6">
                  <div className="flex-1 text-center">
                    <h3 className="text-3xl font-bold text-gray-300">Upgrades</h3>
                  </div>
                  
                  <button
                    onClick={() => setShowUpgradesPage(false)}
                    className="bg-gray-800/80 hover:bg-gray-700/90 text-white/80 hover:text-white transition-all duration-200 rounded-full p-2 backdrop-blur-sm border border-gray-600/50 hover:border-gray-500/70"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                </div>
                
                <div className="md:hidden mb-2 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent"></div>
                
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameContent;
