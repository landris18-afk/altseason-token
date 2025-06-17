/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from 'react';
import { FaSync, FaQuestionCircle, FaCheckCircle } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import UpgradesPanel from './UpgradesPanel';
import SolanaPayModal from './SolanaPayModal';

// --- SZÍNEK SZINTENKÉNT ---
// Index 0: sárga, index 1: zöld (később bővíthető)
const levelColors = [
  {
    text: 'text-yellow-400',
    buttonBg: 'bg-yellow-500',
    buttonShadow: 'shadow-yellow-500/20',
    barFrom: 'from-yellow-400',
    barTo: 'to-orange-500'
  },
  {
    text: 'text-green-400',
    buttonBg: 'bg-green-500',
    buttonShadow: 'shadow-green-500/20',
    barFrom: 'from-green-400',
    barTo: 'to-green-600'
  },
];

// --- SZINTEK ADATSTRUKTÚRÁJA ---
const gameLevels = [
  { threshold: 0,   name: "Wet-Noodle-Handed Normie Who Missed Every Pump Since 2013" },
  { threshold: 100, name: "Sandbox Bull Noob" },
  { threshold: 500, name: "AssSweating Bull of Hopium" },
  { threshold: 2500, name: "Diamond Handed Degen" },
  { threshold: 10000, name: "Gigachad of Green Candles" },
];

const LevelUpModal = ({ isOpen, onClose, levelName, twitterUrl }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-gray-900 border-2 border-green-500/50 rounded-2xl shadow-lg shadow-green-500/20 p-8 max-w-md w-full text-center text-white animate-fade-in-up">
        <FaCheckCircle className="text-6xl text-green-400 mx-auto mb-4" />
        <h3 className="text-3xl font-bold mb-2">LEVEL UP!</h3>
        <p className="text-gray-300 text-lg mb-4">Congratulations, you have become:</p>
        <p className="text-2xl font-bold text-yellow-400 mb-6">{levelName}</p>
        <div className="pt-4 border-t border-gray-700">
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-sky-500 text-white font-bold py-3 px-6 rounded-full flex items-center justify-center space-x-2 hover:bg-sky-400 transition-all shadow-lg"
          >
            <FaXTwitter />
            <span>Share Rank</span>
          </a>
        </div>
        <button
          onClick={onClose}
          className="mt-6 bg-gray-600 font-semibold py-2 px-8 rounded-lg hover:bg-gray-500 transition-all w-full"
        >
          Continue Pumping
        </button>
      </div>
    </div>
  );
};

const CustomModal = ({ isOpen, onClose, onConfirm, title, children, confirmText, cancelText, showConfirmButton = true }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-gray-900 border-2 border-yellow-500/30 rounded-2xl shadow-lg shadow-yellow-500/20 w-full max-w-lg flex flex-col max-h-[90vh] animate-fade-in-up">
        <h3 className="text-2xl font-bold p-6 border-b border-gray-700">{title}</h3>
        <div className="flex-grow overflow-y-auto p-6 space-y-4">{children}</div>
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-700">
          <button onClick={onClose} className="bg-gray-600 py-2 px-5 rounded-lg hover:bg-gray-500 transition-all">
            {cancelText || "Cancel"}
          </button>
          {showConfirmButton && (
            <button onClick={onConfirm} className="bg-red-700 py-2 px-5 rounded-lg hover:bg-red-600 transition-all">
              {confirmText || "Confirm"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const getInitialState = () => ({
  marketCap: 0,
  clickPower: 1,
  passiveIncome: 0,
  levelIndex: 0,
  solanaBlessingLevel: 0,
  hasPremiumUpgrade: false,
  upgrades: [
    // Click Power fejlesztések
    { 
      id: 1, 
      name: "Diamond Hands", 
      description: "+1 Click Power", 
      baseCost: 100, 
      level: 0, 
      power: 1, 
      type: 'click' 
    },
    { 
      id: 2, 
      name: "Bull's Strength", 
      description: "+5 Click Power", 
      baseCost: 400, 
      level: 0, 
      power: 5, 
      type: 'click',
      requirements: {
        upgradeId: 1,
        level: 5
      }
    },
    { 
      id: 3, 
      name: "Moon Shot", 
      description: "+10 Click Power", 
      baseCost: 500, 
      level: 0, 
      power: 10, 
      type: 'click',
      requirements: {
        upgradeId: 2,
        level: 5
      }
    },

    // Passzív jövedelem fejlesztések
    { 
      id: 4, 
      name: "Shill Army", 
      description: "+1 MC/sec", 
      baseCost: 10000, 
      level: 0, 
      power: 1, 
      type: 'passive',
      requirements: {
        upgradeId: 3,
        level: 3
      }
    },
    { 
      id: 5, 
      name: "FOMO Generator", 
      description: "+10 MC/sec", 
      baseCost: 80000, 
      level: 0, 
      power: 10, 
      type: 'passive',
      requirements: {
        upgradeId: 4,
        level: 5
      }
    },
    { 
      id: 6, 
      name: "Whale Magnet", 
      description: "+50 MC/sec", 
      baseCost: 250000, 
      level: 0, 
      power: 50, 
      type: 'passive',
      requirements: {
        upgradeId: 5,
        level: 5
      }
    }
  ]
});

export default function BullRunGame() {
  const [gameState, setGameState] = useState(getInitialState());
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isSolanaModalOpen, setIsSolanaModalOpen] = useState(false);

  // Load & persist
  useEffect(() => {
    const saved = localStorage.getItem('bullRunGameState_v3');
    if (saved) {
      const parsed = JSON.parse(saved);
      const initialState = getInitialState();
      const mergedUpgrades = initialState.upgrades.map(init =>
        (parsed.upgrades && parsed.upgrades.find(u => u.id === init.id)) || init
      );
      setGameState({ ...initialState, ...parsed, upgrades: mergedUpgrades });
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem('bullRunGameState_v3', JSON.stringify(gameState));
  }, [gameState, isLoaded]);

  // MÓDOSÍTÁS: Scroll tiltása, ha BÁRMELYIK modal nyitva van
  useEffect(() => {
    const anyModalOpen = isResetModalOpen || isRulesModalOpen || isLevelUpModalOpen || isSolanaModalOpen;
    document.body.style.overflow = anyModalOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isResetModalOpen, isRulesModalOpen, isLevelUpModalOpen, isSolanaModalOpen]);

  // Szintlépés figyelése
  useEffect(() => {
    if (!isLoaded) return;
    const nextLevel = gameLevels[gameState.levelIndex + 1];
    if (nextLevel && gameState.marketCap >= nextLevel.threshold) {
      setGameState(prev => ({ ...prev, levelIndex: prev.levelIndex + 1 }));
      setIsLevelUpModalOpen(true);
    }
  }, [gameState.marketCap, gameState.levelIndex, isLoaded]);

  // Akciók
  const handlePump = () => setGameState(p => ({ ...p, marketCap: p.marketCap + p.clickPower }));
  
  const buyUpgrade = id => {
    const u = gameState.upgrades.find(x => x.id === id);
    if (!u) return;
    const cost = Math.floor(u.baseCost * 1.15 ** u.level);
    if (gameState.marketCap >= cost) {
      setGameState(p => ({
        ...p,
        marketCap: p.marketCap - cost,
        clickPower: u.type === 'click' ? p.clickPower + u.power : p.clickPower,
        passiveIncome: u.type === 'passive' ? p.passiveIncome + u.power : p.passiveIncome,
        upgrades: p.upgrades.map(x => x.id === id ? { ...x, level: x.level + 1 } : x)
      }));
    }
  };

  // MÓDOSÍTÁS: Passzív jövedelem és Click Power kezelése a szorzóval
  useEffect(() => {
    if (gameState.passiveIncome > 0 || gameState.clickPower > 1) {
      const incomeInterval = setInterval(() => {
        setGameState(p => {
          const multiplier = p.solanaBlessingLevel + 1; // 0 = nincs, 1 = 2x, 2 = 3x, stb.
          const incomeToAdd = p.passiveIncome * multiplier;
          return { ...p, marketCap: p.marketCap + incomeToAdd };
        });
      }, 1000);
      return () => clearInterval(incomeInterval);
    }
  }, [gameState.passiveIncome, gameState.solanaBlessingLevel]);

  const confirmReset = () => {
    localStorage.removeItem('bullRunGameState_v3');
    setGameState(getInitialState());
    setIsResetModalOpen(false);
  };

  // ÚJ: funkció a sikeres fizetés után
  const activatePremiumUpgrade = () => {
    setGameState(p => ({ ...p, hasPremiumUpgrade: true }));
  };

  // ÚJ: Solana Bull's Blessing vásárlás kezelése
  const buySolanaBlessing = () => {
    const currentLevel = gameState.solanaBlessingLevel;
    if (currentLevel >= 9) return; // Maximum 10x (0-9 szint)

    const basePrice = 0.05; // Első szint ára
    const price = basePrice * Math.pow(1.5, currentLevel); // 50% emelkedés minden szinten

    // Itt majd a Solana fizetés kezelése lesz
    // Sikeres fizetés után:
    setGameState(p => ({
      ...p,
      solanaBlessingLevel: p.solanaBlessingLevel + 1
    }));
  };

  // Formázás és változók
  const fmt = n => Math.round(n).toLocaleString('en-US');
  const { marketCap, clickPower, passiveIncome, upgrades, levelIndex, solanaBlessingLevel, hasPremiumUpgrade } = gameState;
  const displayedClickPower = clickPower * (solanaBlessingLevel + 1);
  const displayedPassiveIncome = passiveIncome * (solanaBlessingLevel + 1);
  const current = gameLevels[levelIndex];
  const next = gameLevels[levelIndex + 1];
  const prog = next ? Math.min(((marketCap - current.threshold) / (next.threshold - current.threshold)) * 100, 100) : 100;
  
  // Biztonságosabb színválasztás
  const colorIndex = Math.min(levelIndex, levelColors.length - 1);
  const {
    text: currentTextColor,
    buttonBg: currentButtonBg,
    buttonShadow: currentButtonShadow,
    barFrom: currentBarFrom,
    barTo: currentBarTo
  } = levelColors[colorIndex];

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-yellow-500/30 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 border-4 border-t-yellow-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full animate-ping"></div>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2 animate-pulse">Loading Bull Run Clicker</h2>
        <p className="text-gray-400 text-sm">Preparing your bull market adventure...</p>
        <div className="mt-8 flex gap-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    );
  }

  const shareText = `I have reached the rank of ${current.name} on the Bull Run Clicker!`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent("https://your-website-url.com")}&hashtags=BullRun,ClickerGame`;

  return (
    <>
      <LevelUpModal isOpen={isLevelUpModalOpen} onClose={() => setIsLevelUpModalOpen(false)} levelName={current.name} twitterUrl={twitterUrl} />
      <CustomModal isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)} onConfirm={confirmReset} title="Reset Game" confirmText="Yes, Reset!" cancelText="Cancel">
        <p>Are you sure you want to reset? All your progress and upgrades will be permanently deleted!</p>
      </CustomModal>
      <CustomModal isOpen={isRulesModalOpen} onClose={() => setIsRulesModalOpen(false)} title="How to Play" cancelText="Got it!" showConfirmButton={false}>
        <div className="text-gray-300 space-y-2">
          <p className="font-bold text-white">The Goal:</p>
          <p>Pump the Virtual Market Cap to reach new levels and become the ultimate bull!</p>
          <p className="font-bold text-white">How to Play:</p>
          <p>1. Smash "PUMP THE BULL" to increase the market cap.</p>
          <p>2. Buy Upgrades to get more MC/click or passive income.</p>
          <p>3. Hit the Next Level threshold to advance and change colors!</p>
          <p className="font-bold text-white">Compete:</p>
          <p>Share your rank on X to challenge friends!</p>
        </div>
      </CustomModal>
      <SolanaPayModal
        isOpen={isSolanaModalOpen}
        onClose={() => setIsSolanaModalOpen(false)}
        onPaymentSuccess={activatePremiumUpgrade}
        currentLevel={solanaBlessingLevel}
      />

      <section id="game" className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Bull Run Clicker</h2>
          <p className="text-lg text-gray-400 mb-12">How high can you pump the market cap?</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Panel */}
            <div className="lg:col-span-2 bg-black/50 p-8 rounded-2xl border border-white/10 flex flex-col justify-between">
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="md:hidden">
                  <p className="text-lg font-bold text-gray-400 text-left">Current Rank:</p>
                  <p className={`text-xl font-bold ${currentTextColor} text-left -mt-1`}>{current.name}</p>
                </div>
                <div className="hidden md:flex justify-between items-end mb-1">
                  <p className="text-lg font-bold">
                    <span className="text-gray-400 font-normal">Current Rank: </span>
                    <span className={currentTextColor}>{current.name}</span>
                  </p>
                  <p className="text-sm text-gray-400">{ next ? `Next: $${fmt(next.threshold)}` : "MAX LEVEL" }</p>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4 mt-1">
                  <div
                    className={`h-4 rounded-full transition-all duration-300 bg-gradient-to-r ${currentBarFrom} ${currentBarTo}`}
                    style={{ width: `${prog}%` }}
                  />
                </div>
                <div className="md:hidden text-right mt-1">
                  <p className="text-sm text-gray-400">{ next ? `Next: $${fmt(next.threshold)}` : "MAX" }</p>
                </div>
              </div>

              {/* Market Cap & Pump Button */}
              <div className="flex flex-col items-center">
                <h3 className={`text-2xl md:text-3xl font-bold ${currentTextColor}`}>Virtual Market Cap</h3>
                <p className={`${marketCap < 1e5 ? 'text-8xl' : marketCap < 1e9 ? 'text-6xl' : 'text-5xl'} font-mono font-bold my-2 text-white drop-shadow-lg`}>
                  ${fmt(marketCap)}
                </p>
                <button
                  onClick={handlePump}
                  className={`${currentButtonBg} text-black font-bold py-6 px-10 rounded-full text-lg md:text-3xl transition-transform duration-100 hover:scale-105 active:scale-95 shadow-lg ${currentButtonShadow} mt-4`}
                >
                  PUMP THE BULL
                </button>
              </div>

              {/* Controls */}
              <div className="hidden md:flex justify-center items-center space-x-4 mt-8">
                <button onClick={() => setIsRulesModalOpen(true)} className="bg-blue-900/70 text-white py-3 px-6 rounded-full flex items-center space-x-2 hover:bg-blue-700 transition-all">
                  <FaQuestionCircle className="text-xl"/> <span>How to Play</span>
                </button>
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="bg-gray-800 text-white py-3 px-6 rounded-full flex items-center space-x-2 hover:bg-white hover:text-black transition-all shadow-lg">
                  <FaXTwitter/> <span>Share Rank</span>
                </a>
                <button onClick={() => setIsResetModalOpen(true)} className="bg-red-900/70 text-white py-3 px-6 rounded-full flex items-center space-x-2 hover:bg-red-700 transition-all">
                  <FaSync className="text-xl"/> <span>Reset</span>
                </button>
              </div>

              {/* Mobile Controls */}
              <div className="md:hidden flex flex-col items-center gap-3 mt-8">
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="bg-gray-800 text-white py-3 px-6 rounded-full inline-flex items-center space-x-2 hover:bg-white hover:text-black transition-all shadow-lg">
                  <FaXTwitter/><span>Share Rank</span>
                </a>
                <div className="flex space-x-6">
                  <button onClick={() => setIsRulesModalOpen(true)} className="p-3 bg-blue-900/70 rounded-full hover:bg-blue-700 transition-all">
                    <FaQuestionCircle className="text-2xl text-white"/>
                  </button>
                  <button onClick={() => setIsResetModalOpen(true)} className="p-3 bg-red-900/70 rounded-full hover:bg-red-700 transition-all">
                    <FaSync className="text-2xl text-white"/>
                  </button>
                </div>
              </div>
            </div>

            {/* Upgrades Panel */}
            <UpgradesPanel 
              upgrades={upgrades}
              marketCap={marketCap}
              buyUpgrade={buyUpgrade}
              clickPower={displayedClickPower}
              passiveIncome={displayedPassiveIncome}
              hasPremiumUpgrade={hasPremiumUpgrade}
              onSolanaUpgradeClick={() => setIsSolanaModalOpen(true)}
            />
          </div>
        </div>
      </section>
    </>
  );
}
