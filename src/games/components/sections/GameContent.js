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
  setShowUpgradesPage
}) => {
  return (
    <div className="w-full h-full bg-gray-900 text-white">
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
          <div className="md:hidden h-full relative">
            {!showUpgradesPage ? (
              // Game page
              <div className="pt-4">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameContent;
