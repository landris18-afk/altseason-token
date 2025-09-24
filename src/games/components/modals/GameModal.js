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


          {/* Tartalom a játék flow állapot alapján */}
          <div className="w-full h-full">
            <div className="w-full h-full animate-fade-in-up">
              <div className="w-full h-full relative z-[9998] md:overflow-hidden overflow-y-auto">
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
                  availableUpgradesCount={availableUpgradesCount}
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
