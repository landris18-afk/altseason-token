/**
 * GameModal.js - Játék modal komponens
 * 
 * Ez a komponens a játékot egy felugró ablakban jeleníti meg:
 * - Teljes képernyős modal
 * - Sötét háttér
 * - Bezárás gomb
 * - Játék tartalom
 */

import React, { useEffect, useState, useMemo } from 'react';
import { FaTimes } from 'react-icons/fa';
import GameContent from '../sections/GameContent';
import ModalManager from '../managers/ModalManager';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import NameInputModal from '../modals/NameInputModal';
import { getUpgradeCategories, isUpgradeUnlocked, canAffordUpgrade } from '../../utils/upgradeUtils';

/**
 * GameModal - Játék modal komponens
 * 
 * @param {Object} props - Props objektum
 * @param {boolean} props.isOpen - Modal nyitott állapot
 * @param {Function} props.onClose - Bezárás kezelő
 * @param {Object} props.gameSectionProps - GameSection props
 * @param {Object} props.modalManagerProps - ModalManager props
 * @returns {JSX.Element|null} Modal komponens vagy null
 */
const GameModal = ({ isOpen, onClose, gameSectionProps, modalManagerProps }) => {
  // Game flow state within the modal
  const [gameFlowState, setGameFlowState] = useState('leaderboard');
  const [showUpgradesPage, setShowUpgradesPage] = useState(false); // 'leaderboard', 'nameInput', 'game'
  const [playerName, setPlayerName] = useState('');
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);

  // Reset game flow when modal opens and load saved name
  useEffect(() => {
    if (isOpen) {
      setGameFlowState('leaderboard');
      const savedName = localStorage.getItem('bullRunPlayerName');
      setPlayerName(savedName || '');
      setIsNameModalOpen(false);
    }
  }, [isOpen]);

  // Scroll tiltás amikor a játék modal nyitva van
  useEffect(() => {
    if (isOpen) {
      // Tiltja a body scrolling-ot
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100%';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.documentElement.style.overflow = 'hidden';
    } else {
      // Visszaállítja a scrolling-ot
      document.body.style.overflow = 'unset';
      document.body.style.height = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
      document.documentElement.style.overflow = 'unset';
    }

    // Cleanup - visszaállítja a scrolling-ot amikor a komponens unmount-ol
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.height = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Game flow handlers
  const handleStartGame = () => {
    if (playerName) {
      // If player already has a name, go directly to game
      setGameFlowState('game');
    } else {
      // If no name, show name input modal
      setIsNameModalOpen(true);
    }
  };

  const handleNameConfirm = (name) => {
    setPlayerName(name);
    localStorage.setItem('bullRunPlayerName', name);
    setIsNameModalOpen(false);
    setGameFlowState('game');
  };

  const handleNameModalClose = () => {
    setIsNameModalOpen(false);
  };

  // Reset befejezés kezelése
  const handleResetComplete = () => {
    setGameFlowState('leaderboard');
    setPlayerName(''); // Név törlése a state-ből
    setShowUpgradesPage(false);
    // localStorage-ból is töröljük a nevet, hogy a következő betöltéskor ne jelenjen meg
    localStorage.removeItem('bullRunPlayerName');
  };

  // Elérhető upgrade-ek számának kiszámítása
  const availableUpgradesCount = useMemo(() => {
    if (!gameSectionProps?.upgrades || !gameSectionProps?.usesLeft || !gameSectionProps?.marketCap) {
      return 0;
    }
    
    const { upgrades, usesLeft, marketCap } = gameSectionProps;
    const categories = getUpgradeCategories(upgrades);
    
    const availableClickUpgrades = categories.click.filter(upgrade => 
      isUpgradeUnlocked(upgrade, usesLeft) && canAffordUpgrade(upgrade, marketCap)
    ).length;
    
    const availablePassiveUpgrades = categories.passive.filter(upgrade => 
      isUpgradeUnlocked(upgrade, usesLeft) && canAffordUpgrade(upgrade, marketCap)
    ).length;
    
    return availableClickUpgrades + availablePassiveUpgrades;
  }, [gameSectionProps?.upgrades, gameSectionProps?.usesLeft, gameSectionProps?.marketCap]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 z-[9999] game-modal-open">
      {/* Close Button - Csak ranglista oldalon */}
      {!isNameModalOpen && gameFlowState === 'leaderboard' && (
        <>
          {/* Desktop close button */}
          <button 
            onClick={onClose} 
            className="hidden md:block absolute top-8 right-8 z-[10001] bg-gray-800/80 hover:bg-gray-700/90 text-white/80 hover:text-white transition-all duration-200 rounded-full p-2 backdrop-blur-sm border border-gray-600/50 hover:border-gray-500/70"
            title="Close"
          >
            <FaTimes className="text-lg" />
          </button>
          
        </>
      )}

      {/* Back to Leaderboard Button - Csak játék oldalon, csak desktop nézetben */}
      {!isNameModalOpen && gameFlowState === 'game' && (
        <button 
          onClick={() => setGameFlowState('leaderboard')} 
          className="hidden md:block absolute top-8 right-8 z-[10001] bg-gray-800/80 hover:bg-gray-700/90 text-white/80 hover:text-white transition-all duration-200 rounded-full p-2 backdrop-blur-sm border border-gray-600/50 hover:border-gray-500/70"
          title="Back to Leaderboard"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      )}

      {/* Mobile navigation buttons - only show on game page (not on upgrades page) */}
      {gameFlowState === 'game' && !showUpgradesPage && (
        <>
          <div className="md:hidden absolute top-8 left-4 right-4 flex justify-between items-center z-[10003]">
            {/* Upgrades button - left */}
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

            {/* Back to leaderboard button - right */}
            <button
              onClick={() => setGameFlowState('leaderboard')}
              className="bg-gray-800/80 hover:bg-gray-700/90 text-white/80 hover:text-white transition-all duration-200 rounded-full p-2 backdrop-blur-sm border border-gray-600/50 hover:border-gray-500/70"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          </div>
          
          {/* Elválasztó vonal a fenti gombok alatt - csak ha van név */}
          {playerName && (
            <div className="md:hidden absolute top-24 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent z-[10002]"></div>
          )}
        </>
      )}

      {/* Back to game button - only show on upgrades page */}
      {gameFlowState === 'game' && showUpgradesPage && (
        <>
          {/* Upgrades header - only on upgrades page */}
          <div className="md:hidden absolute top-6 left-4 z-[10004]">
            <h3 className="text-3xl font-bold text-gray-300">Upgrades</h3>
          </div>
          
          {/* Elválasztó vonal az egész header alatt */}
          <div className="md:hidden absolute top-22 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent z-[10004]"></div>
          
          {/* Back button */}
          <div className="md:hidden absolute top-6 right-4 z-[10003]">
            <button
              onClick={() => setShowUpgradesPage(false)}
              className="bg-gray-800/80 hover:bg-gray-700/90 text-white/80 hover:text-white transition-all duration-200 rounded-full p-2 backdrop-blur-sm border border-gray-600/50 hover:border-gray-500/70"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          </div>
        </>
      )}

      {/* Content based on game flow state */}
      <div className="w-full h-full">
        <div className="w-full h-full animate-fade-in-up">
          <div className="w-full h-full relative z-[9998] overflow-hidden">
            {gameFlowState === 'leaderboard' ? (
              <LeaderboardScreen 
                onStartGame={handleStartGame} 
                playerName={playerName} 
                playerStats={gameSectionProps ? {
                  marketCap: gameSectionProps.marketCap,
                  levelIndex: gameSectionProps.gameState?.levelIndex || 0
                } : null}
                onClose={onClose}
              />
            ) : gameFlowState === 'game' ? (
              <>
                <GameContent 
                  {...gameSectionProps} 
                  playerName={playerName} 
                  onBackToLeaderboard={() => setGameFlowState('leaderboard')}
                  showUpgradesPage={showUpgradesPage}
                  setShowUpgradesPage={setShowUpgradesPage}
                />
                <ModalManager {...modalManagerProps} onResetComplete={handleResetComplete} />
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* Name Input Modal */}
      <NameInputModal 
        isOpen={isNameModalOpen}
        onClose={handleNameModalClose}
        onConfirm={handleNameConfirm}
      />
    </div>
  );
};

export default GameModal;
