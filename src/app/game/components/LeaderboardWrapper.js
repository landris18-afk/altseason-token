import React from 'react';
import LeaderboardScreen from '../../../games/components/screens/LeaderboardScreen';
import PageWrapper from './PageWrapper';

const LeaderboardWrapper = ({ onStartGame, playerName, playerStats, onClose, children }) => (
  <PageWrapper>
    <LeaderboardScreen 
      onStartGame={onStartGame}
      playerName={playerName}
      playerStats={playerStats}
      onClose={onClose}
    />
    {children}
  </PageWrapper>
);

export default LeaderboardWrapper;

