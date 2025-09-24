/**
 * GameModal - Játék modal komponens
 * 
 * Teljes képernyős modal a játék megjelenítéséhez.
 * Kezeli a játék flow-t: leaderboard -> name input -> game
 * 
 * @param {Object} props - Props objektum
 * @param {boolean} props.isOpen - Modal nyitott állapot
 * @param {Function} props.onClose - Bezárás kezelő
 * @param {Object} props.gameSectionProps - GameSection props
 * @param {Object} props.modalManagerProps - ModalManager props
 * @returns {JSX.Element|null} Modal komponens vagy null
 */

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { FaTimes } from 'react-icons/fa';
import GameContent from '../sections/GameContent';
import ModalManager from '../managers/ModalManager';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import NameInputModal from '../modals/NameInputModal';
import { getUpgradeCategories, isUpgradeUnlocked, canAffordUpgrade } from '../../utils/upgradeUtils';
const GameModal = ({ isOpen, onClose, gameSectionProps, modalManagerProps }) => {
  // Játék flow állapotok
  const [gameFlowState, setGameFlowState] = useState('leaderboard');
  const [showUpgradesPage, setShowUpgradesPage] = useState(false);
  const [playerName, setPlayerName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bullRunPlayerName') || '';
    }
    return '';
  });
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);

  // Modal megnyitáskor játék állapot visszaállítása és mentett név betöltése
  useEffect(() => {
    if (isOpen) {
      setGameFlowState('leaderboard');
      const savedName = localStorage.getItem('bullRunPlayerName');
      setPlayerName(savedName || '');
      setIsNameModalOpen(false);
    }
  }, [isOpen]);


  // Player név szinkronizálása localStorage-szal
  useEffect(() => {
    if (playerName) {
      localStorage.setItem('bullRunPlayerName', playerName);
    } else {
      localStorage.removeItem('bullRunPlayerName');
    }
  }, [playerName]);

  // Scroll tiltás modal megnyitáskor
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100%';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.height = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
      document.documentElement.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.height = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Játék flow kezelők
  const handleStartGame = () => {
    if (playerName) {
      setGameFlowState('game');
    } else {
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

  // Elérhető upgrade-ek számának kiszámítása
  const availableUpgradesCount = useMemo(() => {
    if (!gameSectionProps?.upgrades || !gameSectionProps?.usesLeft || !gameSectionProps?.marketCap) {
      return 0;
    }
    
    const { upgrades, usesLeft, marketCap } = gameSectionProps;
    const categories = getUpgradeCategories(upgrades);
    
    const availableClickUpgrades = categories.click.filter(upgrade => 
      isUpgradeUnlocked(upgrade, usesLeft, upgrades) && canAffordUpgrade(upgrade, marketCap)
    ).length;
    
    const availablePassiveUpgrades = categories.passive.filter(upgrade => 
      isUpgradeUnlocked(upgrade, usesLeft, upgrades) && canAffordUpgrade(upgrade, marketCap)
    ).length;
    
    return availableClickUpgrades + availablePassiveUpgrades;
  }, [gameSectionProps?.upgrades, gameSectionProps?.usesLeft, gameSectionProps?.marketCap]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] game-modal-open" style={{
      background: 'url(/images/rockat_pump_bacground.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Finom sötétítés csak mobilnézetben */}
      <div className="md:hidden fixed inset-0 bg-black/20 pointer-events-none z-[9998]"></div>
      {/* Desktop bezárás gomb - csak ranglista oldalon */}
      {!isNameModalOpen && gameFlowState === 'leaderboard' && (
        <button 
          onClick={onClose} 
          className="hidden md:block absolute top-8 right-8 z-[10001] bg-gray-800/80 hover:bg-gray-700/90 text-white/80 hover:text-white transition-all duration-200 rounded-full p-2 backdrop-blur-sm border border-gray-600/50 hover:border-gray-500/70"
          title="Close"
        >
          <FaTimes className="text-lg" />
        </button>
      )}

      {/* Desktop vissza gomb - csak játék oldalon */}
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

      {/* Mobil navigációs gombok - csak játék oldalon */}
      {gameFlowState === 'game' && !showUpgradesPage && (
        <>
          <div className="md:hidden absolute top-8 left-4 right-4 flex justify-between items-center z-[10003]">
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
              onClick={() => setGameFlowState('leaderboard')}
              className="bg-gray-800/80 hover:bg-gray-700/90 text-white/80 hover:text-white transition-all duration-200 rounded-full p-2 backdrop-blur-sm border border-gray-600/50 hover:border-gray-500/70"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          </div>
          
          {playerName && (
            <div className="md:hidden absolute top-24 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent z-[10002]"></div>
          )}
        </>
      )}

      {/* Upgrades oldal header - csak upgrades oldalon */}
      {gameFlowState === 'game' && showUpgradesPage && (
        <>
          <div className="md:hidden absolute top-8 left-1/2 transform -translate-x-1/2 z-[10004]">
            <h3 className="text-3xl font-bold text-gray-300">Upgrades</h3>
          </div>
          
          <div className="md:hidden absolute top-22 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent z-[10004]"></div>
          
          <div className="md:hidden absolute top-8 right-4 z-[10003]">
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

          {/* Tartalom a játék flow állapot alapján */}
          <div className="w-full h-full">
            <div className="w-full h-full animate-fade-in-up">
              <div className="w-full h-full relative z-[9998] overflow-hidden">
            {gameFlowState === 'leaderboard' ? (
              <LeaderboardScreen 
                key={`leaderboard-${playerName}-${gameSectionProps?.marketCap || 0}`}
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
                <ModalManager {...modalManagerProps} />
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* Név bevitel modal */}
      <NameInputModal 
        isOpen={isNameModalOpen}
        onClose={handleNameModalClose}
        onConfirm={handleNameConfirm}
      />
    </div>
  );
};

export default GameModal;
