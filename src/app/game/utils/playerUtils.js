export const getPlayerName = (user) => {
  if (!user) return '';
  return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Player';
};

export const getPlayerStats = (gameProps) => {
  if (!gameProps) return null;
  return {
    marketCap: gameProps.marketCap,
    levelIndex: gameProps.levelIndex,
    solanaBlessingLevel: gameProps.solanaBlessingLevel
  };
};

