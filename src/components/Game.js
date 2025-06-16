'use client';

import React, { useState, useEffect } from 'react';

const Game = () => {
  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [showDescription, setShowDescription] = useState(false);
  const [upgrades, setUpgrades] = useState({
    autoClicker: 0,
    multiplier: 0
  });
  const [prices, setPrices] = useState({
    autoClicker: 10,
    multiplier: 50
  });

  useEffect(() => {
    // Load saved game state
    const savedState = localStorage.getItem('bullRunGame');
    if (savedState) {
      const { score, multiplier, upgrades, prices } = JSON.parse(savedState);
      setScore(score);
      setMultiplier(multiplier);
      setUpgrades(upgrades);
      setPrices(prices);
    }
  }, []);

  useEffect(() => {
    // Save game state
    const gameState = {
      score,
      multiplier,
      upgrades,
      prices
    };
    localStorage.setItem('bullRunGame', JSON.stringify(gameState));
  }, [score, multiplier, upgrades, prices]);

  useEffect(() => {
    // Auto-clicker logic
    const interval = setInterval(() => {
      if (upgrades.autoClicker > 0) {
        setScore(prev => prev + upgrades.autoClicker * multiplier);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [upgrades.autoClicker, multiplier]);

  const handleClick = () => {
    setScore(prev => prev + multiplier);
  };

  const buyUpgrade = (type) => {
    const price = prices[type];
    if (score >= price) {
      setScore(prev => prev - price);
      setUpgrades(prev => ({
        ...prev,
        [type]: prev[type] + 1
      }));
      setPrices(prev => ({
        ...prev,
        [type]: Math.floor(prev[type] * 1.5)
      }));
      if (type === 'multiplier') {
        setMultiplier(prev => prev * 1.5);
      }
    }
  };

  return (
    <section id="game" className="py-20 bg-gray-500/50 text-white relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Bull Run Clicker</h2>
        <p className="text-lg text-yellow-400 mb-4">Click to earn points and buy upgrades!</p>
        
        <button
          onClick={() => setShowDescription(true)}
          className="text-yellow-400 hover:text-yellow-300 underline mb-8"
        >
          What is this game?
        </button>

        {showDescription && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl p-8 max-w-2xl w-full relative">
              <button
                onClick={() => setShowDescription(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                ✕
              </button>
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">About Bull Run Clicker</h3>
              <p className="text-gray-300 text-left">
                Welcome to Bull Rum Clicker — the only game for degens so desperate for altseason bull they're smashing their mouse like maniacs. Every click is a 1 dollar virtual marketcap, and the more you hammer that button, the faster you level up to unlock sick upgrades. When you're done smashing, flex your insane score on Twitter and prove you're the ultimate alt bull degenerate.
              </p>
            </div>
          </div>
        )}

        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20">
          <div className="text-4xl font-bold mb-8">
            Score: {Math.floor(score)}
          </div>
          
          <button
            onClick={handleClick}
            className="bg-yellow-500 text-black font-bold py-4 px-8 rounded-full text-lg hover:bg-yellow-400 transition-colors duration-300 transform hover:-translate-y-1 mb-8"
          >
            Click to Earn!
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Auto Clicker</h3>
              <p className="mb-2">Level: {upgrades.autoClicker}</p>
              <p className="mb-4">Price: {prices.autoClicker}</p>
              <button
                onClick={() => buyUpgrade('autoClicker')}
                disabled={score < prices.autoClicker}
                className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-400 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy
              </button>
            </div>

            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Multiplier</h3>
              <p className="mb-2">Current: {multiplier.toFixed(1)}x</p>
              <p className="mb-4">Price: {prices.multiplier}</p>
              <button
                onClick={() => buyUpgrade('multiplier')}
                disabled={score < prices.multiplier}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-400 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Game; 