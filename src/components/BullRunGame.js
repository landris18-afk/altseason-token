// src/components/BullRunGame.js
"use client";

import { useState, useEffect } from 'react';
import { FaSync } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

// --- ÚJ, EGYEDI MODÁLIS ABLAK KOMPONENS ---
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;

  return (
    // A teljes képernyős, sötétített, elmosott háttér
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
      {/* A modális ablak */}
      <div className="bg-gray-900 border-2 border-yellow-500/30 rounded-2xl shadow-lg shadow-yellow-500/20 p-6 m-4 max-w-sm w-full text-white">
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <p className="text-gray-300 mb-6">{children}</p>
        <div className="flex justify-end space-x-4">
          <button 
            onClick={onClose}
            className="bg-gray-600 font-semibold py-2 px-5 rounded-lg transition-all hover:bg-gray-500"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="bg-red-700 font-bold py-2 px-5 rounded-lg transition-all hover:bg-red-600"
          >
            Yes, reset!
          </button>
        </div>
      </div>
    </div>
  );
};


// Az alapértelmezett állapot, ide fogunk visszatérni resetkor
const getInitialState = () => ({
  marketCap: 0,
  clickPower: 1,
  passiveIncome: 0,
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
  const [isModalOpen, setIsModalOpen] = useState(false); // Új állapot a modális ablak vezérlésére

  // Mentés és Betöltés (változatlan)
  useEffect(() => {
    const savedStateJSON = localStorage.getItem('bullRunGameState');
    if (savedStateJSON) {
      const savedState = JSON.parse(savedStateJSON);
      const initialUpgrades = getInitialState().upgrades;
      const mergedUpgrades = initialUpgrades.map(initialUpgrade => {
        const savedUpgrade = savedState.upgrades.find(su => su.id === initialUpgrade.id);
        return savedUpgrade ? { ...initialUpgrade, level: savedUpgrade.level } : initialUpgrade;
      });
      setGameState({...savedState, upgrades: mergedUpgrades});
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('bullRunGameState', JSON.stringify(gameState));
    }
  }, [gameState, isLoaded]);

  // Játék logika (változatlan)
  const handlePumpClick = () => {
    setGameState(prev => ({ ...prev, marketCap: prev.marketCap + prev.clickPower }));
  };

  const buyUpgrade = (id) => {
    const upgrade = gameState.upgrades.find(u => u.id === id);
    if (!upgrade) return;
    const cost = Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.level));
    if (gameState.marketCap >= cost) {
      setGameState(prev => {
        const newClickPower = upgrade.type === 'click' ? prev.clickPower + upgrade.power : prev.clickPower;
        const newPassiveIncome = upgrade.type === 'passive' ? prev.passiveIncome + upgrade.power : prev.passiveIncome;
        const newUpgrades = prev.upgrades.map(u => u.id === id ? { ...u, level: u.level + 1 } : u);
        return { ...prev, marketCap: prev.marketCap - cost, clickPower: newClickPower, passiveIncome: newPassiveIncome, upgrades: newUpgrades };
      });
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
  
  // --- MÓDOSÍTOTT ÚJRAKEZDÉS FUNKCIÓ ---
  const handleResetGame = () => {
    setIsModalOpen(true);
  };

  const confirmReset = () => {
    localStorage.removeItem('bullRunGameState');
    setGameState(getInitialState());
    setIsModalOpen(false);
  }
  // --- MÓDOSÍTÁS VÉGE ---

  const formatNumber = (num) => Math.round(num).toLocaleString('en-US');
  const { marketCap, clickPower, passiveIncome, upgrades } = gameState;

  const yourWebsiteUrl = "https://assbull.meme";
  const gifUrl = "https://assbull.meme/images/bullXshare.mp4";
  const shareText = `I just pumped the $assbull market cap to $${formatNumber(marketCap)} on the Altseason Bull Run Clicker! 🚀 Can you beat my score?`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(yourWebsiteUrl)}&hashtags=Altseason2025&media=${encodeURIComponent(gifUrl)}`;

  if (!isLoaded) {
    return (<div className="text-center py-20"><p>Loading Game...</p></div>);
  }
  
  return (
    <>
      {/* Ide helyezzük az új modális komponenst, ami csak akkor jelenik meg, ha az isModalOpen igaz */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmReset}
        title="Reset Game"
      >
        Are you sure you want to reset? All your progress and upgrades will be permanently deleted!
      </ConfirmModal>

      <section id="game" className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Bull Run Clicker</h2>
          <p className="text-lg text-gray-400 mb-12">How high can you pump the market cap?</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-black/50 p-8 rounded-2xl border border-white/10">
              <h3 className="text-2xl font-bold text-yellow-400">Virtual Market Cap</h3>
              <p className="text-6xl font-mono font-bold my-4">${formatNumber(marketCap)}</p>
              
              <button onClick={handlePumpClick} className="bg-yellow-500 text-black font-bold py-6 px-12 rounded-full text-2xl transition-transform duration-100 hover:scale-105 active:scale-95 shadow-lg shadow-yellow-500/20">
                PUMP THE BULL
              </button>

              <div className="mt-8 flex justify-center items-center space-x-4">
                <a 
                  href={twitterUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-gray-800 text-white font-semibold py-3 px-6 rounded-full flex items-center space-x-2 transition-all hover:bg-white hover:text-black"
                >
                  <FaXTwitter />
                  <span>Share Score</span>
                </a>
                <button onClick={handleResetGame} className="bg-red-900/70 text-white font-semibold py-3 px-6 rounded-full flex items-center space-x-2 transition-all hover:bg-red-700">
                  <FaSync />
                  <span>Reset</span>
                </button>
              </div>
              
              <div className="mt-6 text-left">
                <p className="text-lg"><span className="font-bold">{formatNumber(clickPower)}</span> MC / Click</p>
                <p className="text-lg"><span className="font-bold">{formatNumber(passiveIncome)}</span> MC / Second</p>
              </div>
            </div>
            
            <div className="bg-black/50 p-6 rounded-2xl border border-white/10">
              <h3 className="text-2xl font-bold mb-4">Upgrades</h3>
              <div className="space-y-3">
                {upgrades.map(upgrade => {
                  const cost = Math.floor(upgrade.baseCost * Math.pow(1.15, upgrade.level));
                  const canAfford = marketCap >= cost;
                  return (
                    <button key={upgrade.id} onClick={() => buyUpgrade(upgrade.id)} disabled={!canAfford} className={`w-full text-left p-3 rounded-lg border-2 transition-all ${ canAfford ? 'border-yellow-500/50 bg-gray-800 hover:bg-yellow-500 hover:text-black' : 'border-gray-700 bg-gray-800/50 text-gray-500 cursor-not-allowed'}`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold">{upgrade.name} <span className="text-xs">(Lvl {upgrade.level})</span></p>
                          <p className="text-sm">{upgrade.description}</p>
                        </div>
                        <p className="font-bold text-lg">${formatNumber(cost)}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BullRunGame;
