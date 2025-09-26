/**
 * LeaderboardControls - Ranglista vezérlő komponens
 * 
 * Ez a komponens kezeli a ranglista vezérlőit:
 * - View mode váltás (Top 10, 50, 100)
 * - Frissítés gomb
 * - Loading, error, empty state kezelése
 */

import React from 'react';
import LeaderboardLoader from '../ui/LeaderboardLoader';

const LeaderboardControls = ({ 
  viewMode, 
  onViewModeChange, 
  onRefresh,
  loading = false,
  error = null,
  hasData = false,
  totalPlayers = 0
}) => {
  const renderViewModeButtons = () => (
    <div className="footer-left">
      <button 
        className={`toggle-btn ${viewMode === 'top10' ? 'active' : ''}`}
        onClick={() => onViewModeChange('top10')}
      >
        Top 10
      </button>
      <button 
        className={`toggle-btn ${viewMode === 'top50' ? 'active' : ''}`}
        onClick={() => onViewModeChange('top50')}
      >
        Top 50
      </button>
      <button 
        className={`toggle-btn ${viewMode === 'top100' ? 'active' : ''}`}
        onClick={() => onViewModeChange('top100')}
      >
        Top 100
      </button>
      {/* Refresh button - visible on both mobile and desktop */}
      <button 
        className={`refresh-icon-btn ${loading ? 'loading' : ''}`}
        onClick={onRefresh}
        disabled={loading}
        title={loading ? "Refreshing..." : "Refresh Leaderboard"}
      >
        <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  );


  const renderLoadingState = () => (
    <LeaderboardLoader />
  );

  const renderErrorState = () => (
    <div className="flex justify-center items-center py-8">
      <div className="text-red-400 text-lg">Error loading leaderboard: {error}</div>
      <button 
        onClick={onRefresh}
        className="ml-4 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400"
      >
        Retry
      </button>
    </div>
  );


  const renderStats = () => {
    if (totalPlayers > 0) {
      return (
        <div className="footer-right">
          <span className="text-sm text-gray-400">
            Total Players: {totalPlayers}
          </span>
        </div>
      );
    }
    return null;
  };

  // Error state
  if (error) {
    return renderErrorState();
  }

  // Normal state with controls (always show, even when loading)
  return (
    <div className="table-footer">
      {renderViewModeButtons()}
      {renderStats()}
    </div>
  );
};

export default LeaderboardControls;
