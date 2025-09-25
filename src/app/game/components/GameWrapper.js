import React, { useState } from 'react';
import GameContent from '../../../games/components/sections/GameContent';
import ModalManager from '../../../games/components/managers/ModalManager';
import PageWrapper from './PageWrapper';

const GameWrapper = ({ gameProps, playerName, onBackToLeaderboard, children }) => {
  const [showUpgradesPage, setShowUpgradesPage] = useState(false);

  if (!gameProps || !gameProps.isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white">
        Loading game...
      </div>
    );
  }

  if (!gameProps.current || !gameProps.next) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white">
        Loading game data...
      </div>
    );
  }
  
  return (
    <PageWrapper>
      <GameContent 
        {...gameProps}
        buyUpgrade={gameProps.handleUpgrade}
        onSolanaUpgradeClick={() => {}}
        playerName={playerName}
        onBackToLeaderboard={onBackToLeaderboard}
        showUpgradesPage={showUpgradesPage}
        setShowUpgradesPage={setShowUpgradesPage}
        availableUpgradesCount={gameProps.upgrades ? gameProps.upgrades.filter(u => u.isUnlocked && u.level < u.maxLevel).length : 0}
      />
      <ModalManager {...gameProps} />
      {children}
    </PageWrapper>
  );
};

export default GameWrapper;
