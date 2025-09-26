/**
 * LeaderboardPlayerRow - Ranglista játékos sor komponens
 * 
 * Ez a komponens kezeli egy játékos sor megjelenítését:
 * - Rang, név, pontszám, szint megjelenítése
 * - Current user kiemelése
 * - Podium pozíciók (1-3. hely) kiemelése
 * - Platform indikátor
 */

import React from 'react';
import { formatScore } from '../../data/leaderboardData';

const formatNumber = (number) => {
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  } else if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  } else {
    return number.toFixed(0);
  }
};

const LeaderboardPlayerRow = ({ 
  player, 
  rank, 
  isCurrentUser = false, 
  isDesktop = true,
  showDetails = false,
  onToggleDetails = null
}) => {
  const isPodium = rank <= 3;

  const renderRank = () => {
    if (isPodium) {
      return (
        <span className="medal">
          {rank === 1 && '🥇'}
          {rank === 2 && '🥈'}
          {rank === 3 && '🥉'}
        </span>
      );
    }
    return `${rank}.`;
  };

  const renderPlayerName = () => (
    <span className={`player-name ${isCurrentUser ? 'current-user-name' : ''}`}>
      {player.name}
      <span className="platform-indicator">
        {player.platform === 'desktop' ? '🖥️' : '📱'}
      </span>
      {isCurrentUser && <span className="current-user-badge"> (YOU)</span>}
    </span>
  );

  const renderScore = () => (
    <span className={`score-value ${isCurrentUser ? 'current-user-score' : ''}`}>
      {formatScore(player.marketCap || player.score)}
    </span>
  );

  const renderClickPower = () => (
    <span className={`click-value ${isCurrentUser ? 'current-user-click' : ''}`}>
      ${formatNumber(player.clickPower || 0)}
    </span>
  );

  const renderPassiveIncome = () => (
    <span className={`passive-value ${isCurrentUser ? 'current-user-passive' : ''}`}>
      ${formatNumber(player.passiveIncome || 0)}
    </span>
  );

  const renderLevel = () => (
    <span className={`level-badge ${isCurrentUser ? 'current-user-level' : ''}`}>
      Level {player.level}
    </span>
  );

  if (isDesktop) {
    // Desktop verzió - teljes táblázat
    return (
      <div 
        className={`table-row ${isCurrentUser ? 'current-user' : ''} ${isPodium ? 'podium' : ''} ${rank === 1 ? 'first' : ''} ${rank === 2 ? 'second' : ''} ${rank === 3 ? 'third' : ''}`}
      >
        <div className="cell-rank">
          <span className="rank-number">
            {renderRank()}
          </span>
        </div>
        <div className="cell-name">
          {renderPlayerName()}
        </div>
        <div className="cell-score">
          {renderScore()}
        </div>
        <div className="cell-click">
          {renderClickPower()}
        </div>
        <div className="cell-passive">
          {renderPassiveIncome()}
        </div>
        <div className="cell-level">
          {renderLevel()}
        </div>
      </div>
    );
  } else {
    // Mobile verzió - kompakt táblázat
    return (
      <React.Fragment>
        <div 
          className={`table-row ${isCurrentUser ? 'current-user' : ''} ${isPodium ? 'podium' : ''} ${rank === 1 ? 'first' : ''} ${rank === 2 ? 'second' : ''} ${rank === 3 ? 'third' : ''}`}
        >
          <div className="cell-rank">
            <span className="rank-number">
              {renderRank()}
            </span>
          </div>
          <div className="cell-name">
            {renderPlayerName()}
          </div>
          <div className="cell-score">
            {renderScore()}
            {player.clerkId && onToggleDetails && (
              <button
                className="ml-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                title="Show detailed stats"
                onClick={() => onToggleDetails(player.id)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Mobile részletes adatok */}
        {showDetails && player.clerkId && (
          <div className="table-row current-user-details-mobile">
            <div className="cell-rank"></div>
            <div className="cell-name">
              <span className="text-xs text-gray-400">MC/Click:</span>
              <span className="ml-2 text-yellow-400 font-medium">
                ${formatNumber(player.clickPower || 0)}
              </span>
            </div>
            <div className="cell-score">
              <span className="text-xs text-gray-400">MC/Second:</span>
              <span className="ml-2 text-yellow-400 font-medium">
                ${formatNumber(player.passiveIncome || 0)}
              </span>
              <span className="ml-4 text-xs text-gray-400">Level:</span>
              <span className="ml-2 text-yellow-400 font-medium">
                {player.level}
              </span>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
};

export default LeaderboardPlayerRow;
