// src/components/BullRunGame.js
"use client";

import { useState, useEffect } from 'react';
import { FaSync, FaQuestionCircle, FaCheckCircle } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

// --- SZINTEK ADATSTRUKTÚRÁJA ---
const gameLevels = [
  // A 0. index jelöli az 1. szintet
  { threshold: 0, name: "Wet-Noodle-Handed Normie Who Missed Every Pump Since 2013" }, // Starting Rank
  { threshold: 100, name: "Sandbox Bull Noob" },
  { threshold: 500, name: "AssSweating Bull of Hopium" },
  { threshold: 1000, name: "Half-Liquidated Clickslave with Bull Delusions" },
  { threshold: 5000, name: "Goat-Humping Bull Whispering to Charts at 3AM" },
  { threshold: 10000, name: "Mouse-Mashing Madbull Who Hears Pump Voices" },
  { threshold: 25000, name: "Injecting Pure RSI into Eyeballs Bull" },
  { threshold: 50000, name: "Fulltime Candlestick Cultist with Melted Brain" },
  { threshold: 100000, name: "Bull Who Sold His Soul for One Green Candle" },
  { threshold: 200000, name: "Keyboard-Eating Bull of the Final Dump" },
  { threshold: 500000, name: "Broken Bull Who Screams \"ALTSEASON\" in His Sleep" },
  { threshold: 800000, name: "No-Wallet, Only Hopium Bull" },
  { threshold: 1000000, name: "Reality-Denying Bull Who Sees Charts in Clouds" },
  { threshold: 5000000, name: "Schizo Bull Having Zoom Calls with Satoshi" },
  { threshold: 10000000, name: "Astral Plane Bull Trying to Long the Moon" },
  { threshold: 100000000, name: "Cosmic Degenerate Who Thinks the Pump is a Person" },
  { threshold: 1000000000, name: "4th-Dimensional BULL Who Trades with Telepathy" },
  { threshold: 10000000000, name: "Time-Lost ASSBULL Who’s Been Clicking Since 2017" },
];

const LevelUpModal = ({ isOpen, onClose, levelName, twitterUrl }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
      <div className="bg-gray-900 border-2 border-green-500/50 rounded-2xl shadow-lg shadow-green-500/20 p-8 m-4 max-w-md w-full text-center text-white animate-fade-in-up">
        <FaCheckCircle className="text-6xl text-green-400 mx-auto mb-4" />
        <h3 className="text-3xl font-bold mb-2">LEVEL UP!</h3>
        <p className="text-gray-300 text-lg mb-4">Congratulations, you have become:</p>
        <p className="text-2xl font-bold text-yellow-400 mb-6">{levelName}</p>
        
        <div className="mt-4 pt-4 border-t border-gray-700">
           <p className="text-sm text-gray-400 mb-3">Flex your new rank!</p>
           <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="bg-sky-500 text-white font-bold py-3 px-6 rounded-full flex items-center justify-center space-x-2 transition-all hover:bg-sky-400 text-lg shadow-lg" title="Share on X">
             <FaXTwitter />
             <span>Share Rank</span>
           </a>
        </div>

        <button onClick={onClose} className="mt-6 bg-gray-600 font-semibold py-2 px-8 rounded-lg transition-all hover:bg-gray-500 w-full">Continue Pumping</button>
      </div>
    </div>
  );
};

const CustomModal = ({ isOpen, onClose, onConfirm, title, children, confirmText, cancelText, showConfirmButton = true }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
        <div className="bg-gray-900 border-2 border-yellow-500/30 rounded-2xl shadow-lg shadow-yellow-500/20 w-full max-w-lg flex flex-col max-h-[90vh] animate-fade-in-up">
          <h3 className="text-2xl font-bold p-6 border-b border-gray-700 flex-shrink-0">{title}</h3>
          <div className="flex-grow overflow-y-auto p-6 space-y-4">{children}</div>
          <div className="flex justify-end space-x-4 p-6 border-t border-gray-700 flex-shrink-0">
            <button onClick={onClose} className="bg-gray-600 font-semibold py-2 px-5 rounded-lg transition-all hover:bg-gray-500">{cancelText || "Cancel"}</button>
            {showConfirmButton && (<button onClick={onConfirm} className="bg-red-700 font-bold py-2 px-5 rounded-lg transition-all hover:bg-red-600">{confirmText || "Confirm"}</button>)}
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
  upgrades: [
    { id: 1, name: "Diamond Hands", description: "+1 Click Power", baseCost: 50, level: 0, power: 1, type: 'click' },
    { id: 2, name: "Shill Army", description: "+1 MC/sec", baseCost: 200, level: 0, power: 1, type: 'passive' },
    { id: 3, name: "To The Moon Rocket", description: "+10 Click Power", baseCost: 1000, level: 0, power: 10, type: 'click' },
    { id: 4, name: "CEX Listing Rumors", description: "+5 MC/sec", baseCost: 2500, level: 0, power: 5, type: 'passive' },
  ]
});

const BullRunGame = () => {
  const [gameState, setGameState] = useState(getInitialState());
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  useEffect(() => {
    const savedStateJSON = localStorage.getItem('bullRunGameState_v3');
    if (savedStateJSON) {
      const savedState = JSON.parse(savedStateJSON);
      const initialUpgrades = getInitialState().upgrades;
      const mergedUpgrades = initialUpgrades.map(initialUpgrade => {
        const savedUpgrade = savedState.upgrades.find(su => su.id === initialUpgrade.id);
        return savedUpgrade ? { ...initialUpgrade, level: savedUpgrade.level } : initialUpgrade;
      });
      setGameState({...getInitialState(), ...savedState, upgrades: mergedUpgrades});
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('bullRunGameState_v3', JSON.stringify(gameState));
    }
  }, [gameState, isLoaded]);
  
  useEffect(() => {
    if (isResetModalOpen || isRulesModalOpen || isLevelUpModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isResetModalOpen, isRulesModalOpen, isLevelUpModalOpen]);

  useEffect(() => {
    if (!isLoaded) return;
    
    const nextLevelIndex = gameState.levelIndex + 1;
    if (nextLevelIndex < gameLevels.length && gameState.marketCap >= gameLevels[nextLevelIndex].threshold) {
      setGameState(prev => ({
        ...prev,
        levelIndex: nextLevelIndex,
      }));
      setIsLevelUpModalOpen(true);
    }
  }, [gameState.marketCap, gameState.levelIndex, isLoaded]);

  const handlePumpClick = () => setGameState(prev => ({ ...prev, marketCap: prev.marketCap + prev.clickPower }));

  const buyUpgrade = (id) => {
    const upgrade = gameState.upgrades.find(u => u.id === id);
    if (!upgrade) return;
    const cost = Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.level));
    if (gameState.marketCap >= cost) {
      setGameState(prev => ({ ...prev, marketCap: prev.marketCap - cost, clickPower: upgrade.type === 'click' ? prev.clickPower + upgrade.power : prev.clickPower, passiveIncome: upgrade.type === 'passive' ? prev.passiveIncome + upgrade.power : prev.passiveIncome, upgrades: prev.upgrades.map(u => u.id === id ? { ...u, level: u.level + 1 } : u) }));
    }
  };

  useEffect(() => {
    if (gameState.passiveIncome > 0) {
      const interval = setInterval(() => {
        setGameState(prev => ({ ...prev, marketCap: prev.marketCap + prev.passiveIncome }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameState.passiveIncome]);
  
  const confirmReset = () => {
    localStorage.removeItem('bullRunGameState_v3');
    setGameState(getInitialState());
    setIsResetModalOpen(false);
  };

  const formatNumber = (num) => Math.round(num).toLocaleString('en-US');
  const { marketCap, clickPower, passiveIncome, upgrades, levelIndex } = gameState;
  
  const currentLevel = gameLevels[levelIndex];
  const nextLevel = gameLevels[levelIndex + 1];
  const progressPercent = nextLevel ? Math.min(((marketCap - currentLevel.threshold) / (nextLevel.threshold - currentLevel.threshold)) * 100, 100) : 100;

  const formattedMarketCap = formatNumber(marketCap);
  let marketCapSizeClass;

  if (formattedMarketCap.length >= 13) {
    marketCapSizeClass = 'text-5xl lg:text-7xl';
  } else if (formattedMarketCap.length >= 9) {
    marketCapSizeClass = 'text-6xl lg:text-8xl';
  } else if (formattedMarketCap.length >= 5) {
    marketCapSizeClass = 'text-7xl lg:text-9xl';
  } else {
    marketCapSizeClass = 'text-8xl lg:text-9xl';
  }

  const yourWebsiteUrl = "https://your-website-url.com";
  const yourTwitterHandle = "YourTwitterHandle";
  const shareText = `I reached the "${currentLevel.name}" rank on the $AS25 Bull Run Clicker! Can you beat me?`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(yourWebsiteUrl)}&hashtags=Altseason2025,AS25,Solana,memecoin,pumpfun&via=${yourTwitterHandle}`;

  if (!isLoaded) { return (<div className="text-center py-20"><p>Loading Game...</p></div>); }
  
  return (
    <>
      <LevelUpModal isOpen={isLevelUpModalOpen} onClose={() => setIsLevelUpModalOpen(false)} levelName={currentLevel.name} twitterUrl={twitterUrl} />
      <CustomModal isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)} onConfirm={confirmReset} title="Reset Game" confirmText="Yes, Reset!" cancelText="Cancel">
        <p>Are you sure you want to reset? All your progress and upgrades will be permanently deleted!</p>
      </CustomModal>
      <CustomModal isOpen={isRulesModalOpen} onClose={() => setIsRulesModalOpen(false)} title="How to Play" cancelText="Got it!" showConfirmButton={false}>
        <div className="text-gray-300">
          <p className="font-bold text-white">The Goal:</p><p>Pump the Virtual Market Cap to reach new levels and become the ultimate bull!</p><br/>
          <p className="font-bold text-white">How to Play:</p><p>1. Smash "PUMP THE BULL" to increase the market cap.</p><p>2. Use your earnings to buy Upgrades.</p><p>3. Reach the "Next Level" target to level up and earn rewards!</p><br/>
          <p className="font-bold text-white">Compete:</p><p>Share your rank on X to challenge your friends!</p>
        </div>
      </CustomModal>

      <section id="game" className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Bull Run Clicker</h2>
          <p className="text-lg text-gray-400 mb-12">How high can you pump the market cap?</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="relative lg:col-span-2 bg-black/50 p-8 rounded-2xl border border-white/10 overflow-hidden">
                <img 
                    src="/images/bika-karakter.png"
                    alt="Bull Character"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full object-contain opacity-10 z-0 pointer-events-none"
                />

                <div className="relative z-10 flex flex-col justify-between h-full min-h-[500px]">
                    <div>
                        <div className="mb-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-1">
                                <p className="text-lg font-bold text-left">
                                    <span className="text-gray-400 font-normal">Current Rank: </span>
                                    <span className="text-yellow-400">{currentLevel.name}</span>
                                </p>
                                <p className="text-sm text-gray-400 mt-1 sm:mt-0">{nextLevel ? `Next: $${formatNumber(nextLevel.threshold)}` : "MAX LEVEL REACHED"}</p>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-4"><div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div></div>
                        </div>
                    </div>

                    <div className="flex-grow flex flex-col justify-center items-center">
                        <h3 className="text-3xl font-bold text-yellow-400">Virtual Market Cap</h3>
                        <p className={`${marketCapSizeClass} font-mono font-bold my-2 text-white drop-shadow-lg`}>${formattedMarketCap}</p>
                        {/* --- JAVÍTOTT GOMB --- */}
                        <button 
                            onClick={(e) => {
                                handlePumpClick();
                                e.currentTarget.blur(); // Elveszi a fókuszt a gombról
                            }}
                            className="bg-yellow-500 text-black font-bold py-6 px-12 rounded-full text-2xl transition-transform duration-100 hover:scale-105 active:scale-95 shadow-lg shadow-yellow-500/20 mt-4"
                        >
                            PUMP THE BULL
                        </button>
                    </div>
                    
                    <div className="mt-8">
                        <div className="flex justify-center items-center space-x-4">
                            <button onClick={() => setIsRulesModalOpen(true)} className="bg-blue-900/70 text-white font-semibold py-3 px-4 md:px-6 rounded-full flex items-center space-x-2 transition-all hover:bg-blue-700" title="How to Play">
                                <FaQuestionCircle className="text-xl"/>
                                <span className="hidden md:inline">How to Play</span>
                            </button>
                            <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="bg-gray-800 text-white font-bold py-3 px-6 rounded-full flex items-center space-x-2 transition-all hover:bg-white hover:text-black text-lg shadow-lg" title="Share on X">
                                <FaXTwitter />
                                <span>Share Rank</span>
                            </a>
                            <button onClick={() => setIsResetModalOpen(true)} className="bg-red-900/70 text-white font-semibold py-3 px-4 md:px-6 rounded-full flex items-center space-x-2 transition-all hover:bg-red-700" title="Reset Game">
                                <FaSync className="text-xl"/>
                                <span className="hidden md:inline">Reset</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-black/50 p-6 rounded-2xl border border-white/10 flex flex-col">
              <h3 className="text-2xl font-bold mb-4">Upgrades</h3>
              <div className="space-y-3 flex-grow overflow-y-auto">
                {upgrades.map(upgrade => {
                  const cost = Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.level));
                  const canAfford = marketCap >= cost;
                  return (<button key={upgrade.id} onClick={() => buyUpgrade(upgrade.id)} disabled={!canAfford} className={`w-full text-left p-3 rounded-lg border-2 transition-all ${ canAfford ? 'border-yellow-500/50 bg-gray-800 hover:bg-yellow-500 hover:text-black' : 'border-gray-700 bg-gray-800/50 text-gray-500 cursor-not-allowed'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold">{upgrade.name} <span className="text-xs">(Lvl {upgrade.level})</span></p>
                        <p className="text-sm">{upgrade.description}</p>
                      </div>
                      <p className="font-bold text-lg">${formatNumber(cost)}</p>
                    </div>
                  </button>);
                })}
              </div>

              <div className="mt-auto pt-4 border-t-2 border-white/10 text-center">
                <div className="flex justify-around">
                    <div>
                        <p className="text-gray-400 text-sm">MC / Click</p>
                        <p className="font-bold text-white text-lg">{formatNumber(clickPower)}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">MC / Second</p>
                        <p className="font-bold text-white text-lg">{formatNumber(passiveIncome)}</p>
                    </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BullRunGame;
