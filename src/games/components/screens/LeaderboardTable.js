/**
 * LeaderboardTable - Ranglista táblázat komponens
 * 
 * Ez a komponens kezeli a ranglista táblázat megjelenítését:
 * - Táblázat fejléc
 * - Játékos sorok megjelenítése
 * - Current user kiemelése
 * - Desktop/Mobile verziók
 */

import React from 'react';
import LeaderboardPlayerRow from './LeaderboardPlayerRow';
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

const LeaderboardTable = ({ 
  players, 
  currentUser, 
  currentUserRank, 
  isDesktop = true,
  expandedPlayers = new Set(),
  onTogglePlayerDetails = null,
  leaderboardEnabled = true
}) => {
  const renderTableHeader = () => {
    if (isDesktop) {
      return (
        <div className="table-header">
          <div className="header-rank">Rank</div>
          <div className="header-name">Player</div>
          <div className="header-score">Market Cap</div>
          <div className="header-click">MC/Click</div>
          <div className="header-passive">MC/Second</div>
          <div className="header-level">Level</div>
        </div>
      );
    } else {
      return (
        <div className="table-header">
          <div className="header-rank">Rank</div>
          <div className="header-name">Player</div>
          <div className="header-score">Market Cap</div>
        </div>
      );
    }
  };

  const renderCurrentUserRow = () => {
    if (!currentUser) return null;

    const isPodium = currentUserRank <= 3;

    if (isDesktop) {
      return (
        <div className="table-row current-user-above-header">
          <div className="cell-rank">
            <span className="rank-number">
              {isPodium ? (
                <span className="medal">
                  {currentUserRank === 1 && '🥇'}
                  {currentUserRank === 2 && '🥈'}
                  {currentUserRank === 3 && '🥉'}
                </span>
              ) : (
                `${currentUserRank || 'N/A'}.`
              )}
            </span>
          </div>
          <div className="cell-name">
            <span className="player-name current-user-name">
              {currentUser.name}
              <span className="platform-indicator">
                {currentUser.platform === 'desktop' ? '🖥️' : '📱'}
              </span>
              <span className="current-user-badge"> (YOU)</span>
            </span>
          </div>
          <div className="cell-score">
            <span className="score-value current-user-score">
              {formatScore(currentUser.marketCap)}
            </span>
          </div>
          <div className="cell-click">
            <span className="click-value current-user-click">
              ${formatNumber(currentUser.clickPower || 0)}
            </span>
          </div>
          <div className="cell-passive">
            <span className="passive-value current-user-passive">
              ${formatNumber(currentUser.passiveIncome || 0)}
            </span>
          </div>
          <div className="cell-level">
            <span className="level-badge current-user-level">
              Level {currentUser.level}
            </span>
          </div>
        </div>
      );
    } else {
      return (
        <React.Fragment>
          <div className="table-row current-user-above-header">
            <div className="cell-rank">
              <span className="rank-number">
                {isPodium ? (
                  <span className="medal">
                    {currentUserRank === 1 && '🥇'}
                    {currentUserRank === 2 && '🥈'}
                    {currentUserRank === 3 && '🥉'}
                  </span>
                ) : (
                  `${currentUserRank || 'N/A'}.`
                )}
              </span>
            </div>
            <div className="cell-name">
              <span className="player-name current-user-name">
                {currentUser.name}
                <span className="platform-indicator">
                  {currentUser.platform === 'desktop' ? '🖥️' : '📱'}
                </span>
                <span className="current-user-badge"> (YOU)</span>
              </span>
            </div>
            <div className="cell-score">
              <span className="score-value current-user-score">
                {formatScore(currentUser.marketCap)}
              </span>
              <button
                className="ml-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                title="Show detailed stats"
                onClick={() => onTogglePlayerDetails && onTogglePlayerDetails('current-user')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile részletes adatok */}
          {expandedPlayers.has('current-user') && (
            <div className="table-row current-user-details-mobile">
              <div className="cell-rank"></div>
              <div className="cell-name">
                <span className="text-xs text-gray-400">MC/Click:</span>
                <span className="ml-2 text-yellow-400 font-medium">
                  ${formatNumber(currentUser.clickPower || 0)}
                </span>
              </div>
              <div className="cell-score">
                <span className="text-xs text-gray-400">MC/Second:</span>
                <span className="ml-2 text-yellow-400 font-medium">
                  ${formatNumber(currentUser.passiveIncome || 0)}
                </span>
                <span className="ml-4 text-xs text-gray-400">Level:</span>
                <span className="ml-2 text-yellow-400 font-medium">
                  {currentUser.level}
                </span>
              </div>
            </div>
          )}
        </React.Fragment>
      );
    }
  };

  const renderPlayerRows = () => {
    return players
      .filter(player => !player.isCurrentUser || leaderboardEnabled)
      .map((player, index) => {
        const rank = index + 1;
        const isCurrentUser = player.userId && currentUser && player.userId === currentUser.userId;
        const showDetails = expandedPlayers.has(player.id);

        return (
          <LeaderboardPlayerRow
            key={player.id}
            player={player}
            rank={rank}
            isCurrentUser={isCurrentUser}
            isDesktop={isDesktop}
            showDetails={showDetails}
            onToggleDetails={onTogglePlayerDetails}
          />
        );
      });
  };

  return (
    <div className="leaderboard-table">
      {leaderboardEnabled && renderCurrentUserRow()}
      {renderTableHeader()}
      <div className="table-body">
        {renderPlayerRows()}
      </div>
    </div>
  );
};

export default LeaderboardTable;
