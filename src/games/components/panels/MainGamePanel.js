import React from 'react';
import ProgressBar from '../ui/ProgressBar';
import MarketCapDisplay from '../ui/MarketCapDisplay';
import PumpButton from '../ui/PumpButton';
import GameControls from '../ui/GameControls';

/**
 * MainGamePanel - Fő játék panel komponens
 * 
 * Ez a komponens a játék fő paneljét jeleníti meg:
 * - Progress bar
 * - Market Cap megjelenítés
 * - Pump gomb
 * - Játék vezérlők
 * 
 * @param {Object} props - Props objektum
 * @param {Object} props.current - Jelenlegi szint
 * @param {Object} props.next - Következő szint
 * @param {string} props.currentTextColor - Jelenlegi szint színe
 * @param {string} props.currentBarFrom - Progress bar kezdő színe
 * @param {string} props.currentBarTo - Progress bar végző színe
 * @param {number} props.progress - Progress érték
 * @param {number} props.safeMarketCap - Biztonságos Market Cap
 * @param {number} props.marketCap - Market Cap érték
 * @param {number} props.subThousandAccumulator - Sub-thousand akkumulátor
 * @param {boolean} props.isDesktop - Desktop nézet flag
 * @param {Object} props.gameState - Játék állapot
 * @param {Function} props.handlePump - Pump funkció
 * @param {Function} props.setIsRulesModalOpen - Szabályok modal beállító
 * @param {Function} props.setIsResetModalOpen - Reset modal beállító
 * @param {Function} props.setMuted - Némítás beállító
 * @param {string} props.twitterUrl - Twitter URL
 * @param {boolean} props.muted - Némított állapot
 * @returns {JSX.Element} Fő játék panel komponens
 */
export default function MainGamePanel({
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
  onShowUpgrades,
  availableUpgradesCount,
  onBackToLeaderboard
}) {
  return (
    <div className="w-full h-full p-4 flex flex-col justify-start md:pt-4 pt-2 bg-gray-800/50 md:bg-transparent md:overflow-hidden overflow-y-auto">
        {/* Progress Bar */}
        <ProgressBar 
          current={current}
          next={next}
          currentTextColor={currentTextColor}
          currentBarFrom={currentBarFrom}
          currentBarTo={currentBarTo}
          progress={progress}
          safeMarketCap={safeMarketCap}
        />

        {/* Market Cap Display és Pump Button */}
        <div className="mb-6">
          <MarketCapDisplay 
            marketCap={marketCap}
            subThousandAccumulator={subThousandAccumulator}
            isDesktop={isDesktop}
          />
          <PumpButton 
            onPump={handlePump}
            gameState={gameState}
          />
        </div>

        {/* Játék vezérlők */}
        <GameControls 
          onShowRules={() => setIsRulesModalOpen(true)}
          onReset={() => setIsResetModalOpen(true)}
          onToggleMute={() => setMuted(m => !m)}
          twitterUrl={twitterUrl}
          muted={muted}
        />
    </div>
  );
}