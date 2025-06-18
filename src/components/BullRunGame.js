/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect, useRef } from 'react';
import { FaSync, FaQuestionCircle, FaCheckCircle, FaTimes, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import UpgradesPanel from './UpgradesPanel';
import SolanaPayModal from './SolanaPayModal';
import { useMute } from './MuteContext';

// --- Átfogó usesLeft javító függvény ---
const fixUsesLeft = (usesLeftRaw) => {
  const defaults = {1: Infinity, 2: Infinity, 3: Infinity, 4: Infinity, 5: 100, 6: 20};
  const fixed = {};
  for (let i = 1; i <= 6; i++) {
    const val = usesLeftRaw && usesLeftRaw[i];
    if (typeof val === 'number' && !isNaN(val)) {
      fixed[i] = val;
    } else {
      fixed[i] = defaults[i];
    }
  }
  return fixed;
};

// --- SZÍNEK SZINTENKÉNT ---
const levelColors = [
  { // 0. szint - sárga
    text: 'text-yellow-400',
    buttonBg: 'bg-yellow-500',
    buttonShadow: 'shadow-yellow-500/20',
    barFrom: 'from-yellow-400',
    barTo: 'to-yellow-600'
  },
  { // 1. szint - narancssárga
    text: 'text-orange-400',
    buttonBg: 'bg-orange-500',
    buttonShadow: 'shadow-orange-500/20',
    barFrom: 'from-orange-400',
    barTo: 'to-orange-600'
  },
  { // 2. szint - rózsaszín
    text: 'text-pink-400',
    buttonBg: 'bg-pink-500',
    buttonShadow: 'shadow-pink-500/20',
    barFrom: 'from-pink-400',
    barTo: 'to-pink-600'
  },
  { // 3. szint - piros
    text: 'text-red-400',
    buttonBg: 'bg-red-500',
    buttonShadow: 'shadow-red-500/20',
    barFrom: 'from-red-400',
    barTo: 'to-red-600'
  },
  { // 4. szint - lila
    text: 'text-purple-400',
    buttonBg: 'bg-purple-500',
    buttonShadow: 'shadow-purple-500/20',
    barFrom: 'from-purple-400',
    barTo: 'to-purple-600'
  },
  { // 5. szint - kék
    text: 'text-blue-400',
    buttonBg: 'bg-blue-500',
    buttonShadow: 'shadow-blue-500/20',
    barFrom: 'from-blue-400',
    barTo: 'to-blue-600'
  },
  { // 6. szint - türkiz
    text: 'text-cyan-400',
    buttonBg: 'bg-cyan-500',
    buttonShadow: 'shadow-cyan-500/20',
    barFrom: 'from-cyan-400',
    barTo: 'to-cyan-600'
  },
  { // 7. szint - zöld
    text: 'text-green-400',
    buttonBg: 'bg-green-500',
    buttonShadow: 'shadow-green-500/20',
    barFrom: 'from-green-400',
    barTo: 'to-green-600'
  },
  { // 8. szint - smaragd
    text: 'text-emerald-400',
    buttonBg: 'bg-emerald-500',
    buttonShadow: 'shadow-emerald-500/20',
    barFrom: 'from-emerald-400',
    barTo: 'to-emerald-600'
  },
  { // 9. szint - türkiz
    text: 'text-teal-400',
    buttonBg: 'bg-teal-500',
    buttonShadow: 'shadow-teal-500/20',
    barFrom: 'from-teal-400',
    barTo: 'to-teal-600'
  },
  { // 10. szint - indigó
    text: 'text-indigo-400',
    buttonBg: 'bg-indigo-500',
    buttonShadow: 'shadow-indigo-500/20',
    barFrom: 'from-indigo-400',
    barTo: 'to-indigo-600'
  },
  { // 11. szint - lila
    text: 'text-violet-400',
    buttonBg: 'bg-violet-500',
    buttonShadow: 'shadow-violet-500/20',
    barFrom: 'from-violet-400',
    barTo: 'to-violet-600'
  },
  { // 12. szint - rózsaszín
    text: 'text-fuchsia-400',
    buttonBg: 'bg-fuchsia-500',
    buttonShadow: 'shadow-fuchsia-500/20',
    barFrom: 'from-fuchsia-400',
    barTo: 'to-fuchsia-600'
  },
  { // 13. szint - sárga
    text: 'text-amber-400',
    buttonBg: 'bg-amber-500',
    buttonShadow: 'shadow-amber-500/20',
    barFrom: 'from-amber-400',
    barTo: 'to-amber-600'
  },
  { // 14. szint - narancssárga
    text: 'text-orange-400',
    buttonBg: 'bg-orange-500',
    buttonShadow: 'shadow-orange-500/20',
    barFrom: 'from-orange-400',
    barTo: 'to-orange-600'
  },
  { // 15. szint - piros
    text: 'text-red-400',
    buttonBg: 'bg-red-500',
    buttonShadow: 'shadow-red-500/20',
    barFrom: 'from-red-400',
    barTo: 'to-red-600'
  },
  { // 16. szint - lila
    text: 'text-purple-400',
    buttonBg: 'bg-purple-500',
    buttonShadow: 'shadow-purple-500/20',
    barFrom: 'from-purple-400',
    barTo: 'to-purple-600'
  },
  { // 17. szint - kék
    text: 'text-blue-400',
    buttonBg: 'bg-blue-500',
    buttonShadow: 'shadow-blue-500/20',
    barFrom: 'from-blue-400',
    barTo: 'to-blue-600'
  }
];

// --- SZINTEK ADATSTRUKTÚRÁJA ---
const gameLevels = [
  { threshold: 0, name: "Wet-Noodle-Handed Normie Who Missed Every Pump Since 2013" },
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
  { threshold: 10000000000, name: "Time-Lost ASSBULL Who's Been Clicking Since 2017" }
];

const LevelUpModal = ({ isOpen, onClose, levelName, twitterUrl, levelIndex }) => {
  if (!isOpen) return null;
  const currentLevelColor = levelColors[levelIndex] || levelColors[0];
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-gray-900 border-2 border-white border-opacity-50 rounded-2xl shadow-lg p-8 max-w-md w-full text-center text-white animate-fade-in-up">
        <FaCheckCircle className="text-6xl text-yellow-400 mx-auto mb-4" />
        <h3 className="text-3xl font-bold mb-2 text-white">LEVEL UP!</h3>
        <p className="text-white text-lg mb-4">Congratulations, you have become:</p>
        <p className={`text-2xl font-bold ${currentLevelColor.text} mb-6`}>{levelName}</p>
        <div className="pt-4 border-t border-white/20">
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-sky-500 text-white font-bold py-3 px-6 rounded-full flex items-center justify-center space-x-2 hover:bg-sky-400 transition-all shadow-lg"
          >
            <FaXTwitter />
            <span>Share Score</span>
          </a>
        </div>
        <button
          onClick={onClose}
          className="mt-6 bg-yellow-500 font-semibold py-2 px-8 rounded-lg hover:opacity-90 transition-all w-full text-gray-900"
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
  totalClicks: 0,
  usesLeft: {
    1: Infinity, // Diamond Hands: végtelen
    2: Infinity, // Bull's Strength: végtelen
    3: Infinity, // Moon Shot: végtelen
    4: Infinity, // Shill Army: végtelen
    5: 100, // FOMO Generator: 100 használat
    6: 20 // Whale Magnet: 20 használat
  },
  upgrades: [
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
        level: 10
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
        level: 10
      }
    },
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
        level: 10
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
        level: 10
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
        level: 15
      }
    }
  ],
  minMarketCapThisLevel: 0
});

export default function BullRunGame() {
  const [gameState, setGameState] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('bullRunGameState_v3');
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          const fixedUsesLeft = fixUsesLeft(parsed.usesLeft);
          const mergedUpgrades = parsed.upgrades.map(upgrade => {
            const savedUpgrade = parsed.upgrades && parsed.upgrades.find(u => u.id === upgrade.id);
            const usesLeft = fixedUsesLeft[upgrade.id];
            return {
              ...upgrade,
              ...savedUpgrade,
              isUnlocked: upgrade.id === 1 || (typeof usesLeft === 'number' && usesLeft > 0)
            };
          });
          return { ...parsed, usesLeft: fixedUsesLeft, upgrades: mergedUpgrades, minMarketCapThisLevel: parsed.minMarketCapThisLevel ?? parsed.marketCap ?? 0 };
        } catch (e) {
          console.error('Hiba a mentett állapot betöltésekor:', e);
        }
      }
    }
    return getInitialState();
  });

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [isSolanaModalOpen, setIsSolanaModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [subThousandAccumulator, setSubThousandAccumulator] = useState(0);
  const lastReqLevelRef = useRef({});
  const [pumpSound, setPumpSound] = useState(null);
  const [levelUpSound, setLevelUpSound] = useState(null);
  const [unlockSound, setUnlockSound] = useState(null);
  const [upgradeSound, setUpgradeSound] = useState(null);
  const [lastMarketCap, setLastMarketCap] = useState(0);
  const [forceUpdate, setForceUpdate] = useState(false);
  const { muted, setMuted } = useMute();
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  // Initialize audio
  useEffect(() => {
    setPumpSound(new Audio('/sound/pumpthebull.wav'));
    setLevelUpSound(new Audio('/sound/level.wav'));
    setUnlockSound(new Audio('/sound/unlock.wav'));
    setUpgradeSound(new Audio('/sound/Upgrades.wav'));
  }, []);

  // Load & persist
  useEffect(() => {
    const saved = localStorage.getItem('bullRunGameState_v3');
    if (saved) {
      const parsed = JSON.parse(saved);
      const initialState = getInitialState();
      const fixedUsesLeft = fixUsesLeft(parsed.usesLeft);
      const mergedUpgrades = initialState.upgrades.map(init => {
        const savedUpgrade = parsed.upgrades && parsed.upgrades.find(u => u.id === init.id);
        const usesLeft = fixedUsesLeft[init.id];
        return {
          ...init,
          ...savedUpgrade,
          isUnlocked: init.id === 1 || (typeof usesLeft === 'number' && usesLeft > 0)
        };
      });
      setGameState({ ...initialState, ...parsed, usesLeft: fixedUsesLeft, upgrades: mergedUpgrades, minMarketCapThisLevel: parsed.minMarketCapThisLevel ?? parsed.marketCap ?? 0 });
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem('bullRunGameState_v3', JSON.stringify(gameState));
  }, [gameState, isLoaded]);

  // MÓDOSÍTÁS: Scroll tiltása, ha BÁRMELYIK modal nyitva van
  useEffect(() => {
    const anyModalOpen = isResetModalOpen || isLevelUpModalOpen || isSolanaModalOpen || isTermsModalOpen || isRulesModalOpen;
    document.body.style.overflow = anyModalOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isResetModalOpen, isLevelUpModalOpen, isSolanaModalOpen, isTermsModalOpen, isRulesModalOpen]);

  // Level up check
  useEffect(() => {
    if (isLoaded) {
      // Ellenőrizzük, hogy érvényes-e a jelenlegi szint
      if (!gameLevels[gameState.levelIndex]) {
        console.log('Invalid level detected, resetting game...');
        confirmReset();
        return;
      }

      const currentLevel = gameLevels[gameState.levelIndex];
      const nextLevel = gameLevels[gameState.levelIndex + 1];
      
      // Csak akkor nézzük a következő szintet, ha van még következő szint
      if (nextLevel && gameState.marketCap >= nextLevel.threshold) {
        if (levelUpSound && !muted) {
          levelUpSound.currentTime = 0;
          levelUpSound.play().catch(error => console.log('Audio playback failed:', error));
        }
        setIsLevelUpModalOpen(true);
        setGameState(p => ({
          ...p,
          levelIndex: p.levelIndex + 1,
          minMarketCapThisLevel: nextLevel.threshold // A következő szint thresholdjától indul
        }));
      }
    }
  }, [gameState.marketCap, gameState.levelIndex, isLoaded, levelUpSound, muted]);

  // Új: Képességek feloldásának kezelése
  useEffect(() => {
    if (isLoaded) {
      // végigmegyünk azokon az upgrade-eken, amelyeknek van követelménye
      for (let id = 2; id <= 6; id++) {
        const req = gameState.upgrades.find(u => u.id === id - 1);
        const upgrade = gameState.upgrades.find(u => u.id === id);
        if (!req || !upgrade || !upgrade.requirements) continue;
        
        const lvl = req.level;
        const last = lastReqLevelRef.current[id];
        
        // Csak akkor unlockolunk, ha most lépte át a requirements.level-t
        if (last !== undefined && last < upgrade.requirements.level && lvl >= upgrade.requirements.level) {
          setGameState(p => {
            const newUses = fixUsesLeft(p.usesLeft);
            if (id === 1) {
              newUses[id] = Infinity; // Diamond Hands: végtelen
            } else if (id === 2) {
              newUses[id] = Infinity; // Bull's Strength: végtelen
            } else if (id === 3) {
              newUses[id] = Infinity; // Moon Shot: végtelen
            } else if (id === 4) {
              newUses[id] = Infinity; // Shill Army: végtelen
            } else if (id === 5) {
              newUses[id] = 100; // FOMO Generator: 100 használat
            } else if (id === 6) {
              newUses[id] = 20; // Whale Magnet: 20 használat
            }
            
            return {
              ...p,
              usesLeft: newUses,
              upgrades: p.upgrades.map(u => 
                u.id === id 
                  ? { ...u, isUnlocked: true }
                  : u
              )
            };
          });
          
          // Hang lejátszása a használatok újratöltésekor, de csak ha nincs némítva
          if (unlockSound && !muted) {
            unlockSound.currentTime = 0;
            unlockSound.play().catch(error => console.log('Audio playback failed:', error));
          }
        }
        lastReqLevelRef.current[id] = lvl;
      }
    }
  }, [gameState.upgrades, isLoaded, unlockSound, muted]);

  // Disable scroll when modal is open
  useEffect(() => {
    if (isTermsModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isTermsModalOpen]);

  const getUpgradeCost = (upgrade) => {
    const getPriceMultiplier = (id) => {
      if (id === 1) return 1.02; // Diamond Hands: 2% growth
      if (id === 5 || id === 6) return 1.15; // FOMO Generator és Whale Magnet
      return 1.10; // Minden más fejlesztés
    };
    const cost = upgrade.baseCost * getPriceMultiplier(upgrade.id) ** upgrade.level;
    return Math.round(cost); // Kerekítés a legközelebbi egész számra
  };

  // MÓDOSÍTÁS: Passzív jövedelem és Click Power kezelése a szorzóval
  useEffect(() => {
    if (gameState.passiveIncome > 0 || gameState.clickPower > 1) {
      const incomeInterval = setInterval(() => {
        setGameState(p => {
          const multiplier = p.solanaBlessingLevel + 1;
          const incomeToAdd = p.passiveIncome * multiplier;

          let newMarketCap = p.marketCap;
          let newSubAccumulator = subThousandAccumulator;

          if (typeof window !== 'undefined' && window.innerWidth >= 768) {
            if (p.marketCap < 1e6) {
              newMarketCap = Math.min(p.marketCap + incomeToAdd, 5e12);
            } else {
              newSubAccumulator += incomeToAdd;
              if (p.marketCap >= 1e12) {
                if (newSubAccumulator >= 1e9) {
                  const billionsToAdd = Math.floor(newSubAccumulator / 1e9);
                  newSubAccumulator = newSubAccumulator % 1e9;
                  newMarketCap = Math.min(p.marketCap + (billionsToAdd * 1e9), 5e12);
                }
              } else if (p.marketCap >= 1e8) {
                if (newSubAccumulator >= 1e6) {
                  const millionsToAdd = Math.floor(newSubAccumulator / 1e6);
                  newSubAccumulator = newSubAccumulator % 1e6;
                  newMarketCap = Math.min(p.marketCap + (millionsToAdd * 1e6), 5e12);
                }
              } else {
                if (newSubAccumulator >= 1e5) {
                  const hundredsToAdd = Math.floor(newSubAccumulator / 1e5);
                  newSubAccumulator = newSubAccumulator % 1e5;
                  newMarketCap = Math.min(p.marketCap + (hundredsToAdd * 1e5), 5e12);
                }
              }
            }
          } else {
            if (p.marketCap < 1e4) {
              newMarketCap = Math.min(p.marketCap + incomeToAdd, 5e12);
            } else {
              newSubAccumulator += incomeToAdd;
              if (p.marketCap >= 1e12) {
                if (newSubAccumulator >= 1e11) {
                  const hundredsOfBillionsToAdd = Math.floor(newSubAccumulator / 1e11);
                  newSubAccumulator = newSubAccumulator % 1e11;
                  newMarketCap = Math.min(p.marketCap + (hundredsOfBillionsToAdd * 1e11), 5e12);
                }
              } else if (p.marketCap >= 1e9) {
                if (newSubAccumulator >= 1e8) {
                  const hundredsOfMillionsToAdd = Math.floor(newSubAccumulator / 1e8);
                  newSubAccumulator = newSubAccumulator % 1e8;
                  newMarketCap = Math.min(p.marketCap + (hundredsOfMillionsToAdd * 1e8), 5e12);
                }
              } else if (p.marketCap >= 1e8) {
                if (newSubAccumulator >= 1e6) {
                  const millionsToAdd = Math.floor(newSubAccumulator / 1e6);
                  newSubAccumulator = newSubAccumulator % 1e6;
                  newMarketCap = Math.min(p.marketCap + (millionsToAdd * 1e6), 5e12);
                }
              } else if (p.marketCap >= 1e6) {
                if (newSubAccumulator >= 1e5) {
                  const hundredsToAdd = Math.floor(newSubAccumulator / 1e5);
                  newSubAccumulator = newSubAccumulator % 1e5;
                  newMarketCap = Math.min(p.marketCap + (hundredsToAdd * 1e5), 5e12);
                }
              } else {
                if (newSubAccumulator >= 1000) {
                  const thousandsToAdd = Math.floor(newSubAccumulator / 1000);
                  newSubAccumulator = newSubAccumulator % 1000;
                  newMarketCap = Math.min(p.marketCap + (thousandsToAdd * 1000), 5e12);
                }
              }
            }
          }
          setSubThousandAccumulator(newSubAccumulator);
          return { ...p, marketCap: newMarketCap };
        });
      }, 1000);
      return () => clearInterval(incomeInterval);
    }
  }, [gameState.passiveIncome, gameState.solanaBlessingLevel, gameState.clickPower, subThousandAccumulator, muted]);

  const handlePump = () => {
    // Maximum 5T
    if (gameState.marketCap >= 5e12) return;
    
    if (gameState.levelIndex >= gameLevels.length - 1) return;
    
    if (pumpSound && !muted) {
      pumpSound.currentTime = 0;
      pumpSound.play().catch(error => console.log('Audio playback failed:', error));
    }
    
    const newIncrement = gameState.clickPower * (gameState.solanaBlessingLevel + 1);
    
    // Asztali nézet: fő számláló növekszik, ha M alatt van
    if (window.innerWidth >= 768) { // md breakpoint
      if (gameState.marketCap < 1e6) {
        setGameState(p => ({
          ...p,
          marketCap: Math.min(p.marketCap + newIncrement, 5e12),
          totalClicks: (p.totalClicks || 0) + 1
        }));
      } else {
        // M felett a második számláló növekszik
        const newAccumulator = subThousandAccumulator + newIncrement;
        
        // 1T felett 1B-ig gyűjtünk
        if (gameState.marketCap >= 1e12) {
          if (newAccumulator >= 1e9) {
            const billionsToAdd = Math.floor(newAccumulator / 1e9);
            const remainder = newAccumulator % 1e9;
            
            setSubThousandAccumulator(remainder);
            setGameState(p => ({
              ...p,
              marketCap: Math.min(p.marketCap + (billionsToAdd * 1e9), 5e12),
              totalClicks: (p.totalClicks || 0) + 1
            }));
          } else {
            setSubThousandAccumulator(newAccumulator);
            setGameState(p => ({
              ...p,
              totalClicks: (p.totalClicks || 0) + 1
            }));
          }
        }
        // 100M és 1T között 1M-ig gyűjtünk
        else if (gameState.marketCap >= 1e8) {
          if (newAccumulator >= 1e6) {
            const millionsToAdd = Math.floor(newAccumulator / 1e6);
            const remainder = newAccumulator % 1e6;
            
            setSubThousandAccumulator(remainder);
            setGameState(p => ({
              ...p,
              marketCap: Math.min(p.marketCap + (millionsToAdd * 1e6), 5e12),
              totalClicks: (p.totalClicks || 0) + 1
            }));
          } else {
            setSubThousandAccumulator(newAccumulator);
            setGameState(p => ({
              ...p,
              totalClicks: (p.totalClicks || 0) + 1
            }));
          }
        }
        // 1M és 100M között 100K-ig gyűjtünk
        else {
          if (newAccumulator >= 1e5) {
            const hundredsToAdd = Math.floor(newAccumulator / 1e5);
            const remainder = newAccumulator % 1e5;
            
            setSubThousandAccumulator(remainder);
            setGameState(p => ({
              ...p,
              marketCap: Math.min(p.marketCap + (hundredsToAdd * 1e5), 5e12),
              totalClicks: (p.totalClicks || 0) + 1
            }));
          } else {
            setSubThousandAccumulator(newAccumulator);
            setGameState(p => ({
              ...p,
              totalClicks: (p.totalClicks || 0) + 1
            }));
          }
        }
      }
    }
      // Mobilnézet: ugyanaz a logika
    else {
      if (gameState.marketCap < 1e4) {
        setGameState(p => ({
          ...p,
          marketCap: Math.min(p.marketCap + newIncrement, 5e12),
          totalClicks: (p.totalClicks || 0) + 1
        }));
      } else {
        const newAccumulator = subThousandAccumulator + newIncrement;
        
        // 1T felett 100B-ig gyűjtünk
        if (gameState.marketCap >= 1e12) {
          if (newAccumulator >= 1e11) {
            const hundredsOfBillionsToAdd = Math.floor(newAccumulator / 1e11);
            const remainder = newAccumulator % 1e11;
            
            setSubThousandAccumulator(remainder);
            setGameState(p => ({
              ...p,
              marketCap: Math.min(p.marketCap + (hundredsOfBillionsToAdd * 1e11), 5e12),
              totalClicks: (p.totalClicks || 0) + 1
            }));
          } else {
            setSubThousandAccumulator(newAccumulator);
            setGameState(p => ({
              ...p,
              totalClicks: (p.totalClicks || 0) + 1
            }));
          }
        }
        // 1B és 1T között 100M-ig gyűjtünk
        else if (gameState.marketCap >= 1e9) {
          if (newAccumulator >= 1e8) {
            const hundredsOfMillionsToAdd = Math.floor(newAccumulator / 1e8);
            const remainder = newAccumulator % 1e8;
            
            setSubThousandAccumulator(remainder);
            setGameState(p => ({
              ...p,
              marketCap: Math.min(p.marketCap + (hundredsOfMillionsToAdd * 1e8), 5e12),
              totalClicks: (p.totalClicks || 0) + 1
            }));
          } else {
            setSubThousandAccumulator(newAccumulator);
            setGameState(p => ({
              ...p,
              totalClicks: (p.totalClicks || 0) + 1
            }));
          }
        }
        // 100M és 1B között 1M-ig gyűjtünk
        else if (gameState.marketCap >= 1e8) {
          if (newAccumulator >= 1e6) {
            const millionsToAdd = Math.floor(newAccumulator / 1e6);
            const remainder = newAccumulator % 1e6;
            
            setSubThousandAccumulator(remainder);
            setGameState(p => ({
              ...p,
              marketCap: Math.min(p.marketCap + (millionsToAdd * 1e6), 5e12),
              totalClicks: (p.totalClicks || 0) + 1
            }));
          } else {
            setSubThousandAccumulator(newAccumulator);
            setGameState(p => ({
              ...p,
              totalClicks: (p.totalClicks || 0) + 1
            }));
          }
        }
        // 1M és 100M között 100K-ig gyűjtünk
        else if (gameState.marketCap >= 1e6) {
          if (newAccumulator >= 1e5) {
            const hundredsToAdd = Math.floor(newAccumulator / 1e5);
            const remainder = newAccumulator % 1e5;
            
            setSubThousandAccumulator(remainder);
            setGameState(p => ({
              ...p,
              marketCap: Math.min(p.marketCap + (hundredsToAdd * 1e5), 5e12),
              totalClicks: (p.totalClicks || 0) + 1
            }));
          } else {
            setSubThousandAccumulator(newAccumulator);
            setGameState(p => ({
              ...p,
              totalClicks: (p.totalClicks || 0) + 1
            }));
          }
        }
        // 10K és 1M között 1000-ig gyűjtünk
        else {
          if (newAccumulator >= 1000) {
            const thousandsToAdd = Math.floor(newAccumulator / 1000);
            const remainder = newAccumulator % 1000;
            
            setSubThousandAccumulator(remainder);
            setGameState(p => ({
              ...p,
              marketCap: Math.min(p.marketCap + (thousandsToAdd * 1000), 5e12),
              totalClicks: (p.totalClicks || 0) + 1
            }));
      } else {
            setSubThousandAccumulator(newAccumulator);
        setGameState(p => ({
          ...p,
          totalClicks: (p.totalClicks || 0) + 1
        }));
          }
        }
      }
    }
  };
  
  const handleUpgrade = (upgrade) => {
    const cost = getUpgradeCost(upgrade);
    if (gameState.marketCap >= cost) {
      if (upgradeSound && !muted) {
        upgradeSound.currentTime = 0;
        upgradeSound.play().catch(error => console.log('Audio playback failed:', error));
      }
      const wasLocked = !upgrade.isUnlocked;
      setGameState(p => {
        const newUses = fixUsesLeft(p.usesLeft);
        if (upgrade.id !== 1) {
          newUses[upgrade.id] = (typeof newUses[upgrade.id] === 'number' ? newUses[upgrade.id] : Infinity) - 1;
          if (newUses[upgrade.id] <= 0) newUses[upgrade.id] = 0;
        }
        // Vásárlás után frissítjük a minMarketCapThisLevel-t a gameState-ben
        return {
          ...p,
          marketCap: p.marketCap - cost,
          clickPower: p.clickPower + (upgrade.type === 'click' ? upgrade.power : 0),
          passiveIncome: p.passiveIncome + (upgrade.type === 'passive' ? upgrade.power : 0),
          usesLeft: newUses,
          upgrades: p.upgrades.map(u =>
            u.id === upgrade.id
              ? { ...u, level: u.level + 1, isUnlocked: true }
              : u
          ),
          minMarketCapThisLevel: p.marketCap - cost
        };
      });
      if (wasLocked && unlockSound && !muted) {
        unlockSound.currentTime = 0;
        unlockSound.play().catch(error => console.log('Audio playback failed:', error));
      }
    }
  };

  const confirmReset = () => {
    localStorage.removeItem('bullRunGameState_v3');
    const initialState = getInitialState();
    setGameState({
      ...initialState,
      levelIndex: 0,
      marketCap: 0,
      totalClicks: 0,
      clickPower: 1,
      passiveIncome: 0,
      solanaBlessingLevel: 0,
      hasPremiumUpgrade: false,
      usesLeft: {
        1: Infinity, // Diamond Hands: végtelen
        2: 0, // Bull's Strength: lezárva
        3: 0, // Moon Shot: lezárva
        4: 0, // Shill Army: lezárva
        5: 0, // FOMO Generator: lezárva
        6: 0 // Whale Magnet: lezárva
      },
      upgrades: initialState.upgrades.map(upgrade => ({
        ...upgrade,
        level: 0,
        isUnlocked: upgrade.id === 1 // Csak a Diamond Hands legyen feloldva
      })),
      minMarketCapThisLevel: 0
    });
    // Reseteljük a lastReqLevelRef-et is
    Object.keys(lastReqLevelRef.current).forEach(key => {
      lastReqLevelRef.current[key] = undefined;
    });
    setIsResetModalOpen(false);
  };

  // ÚJ: funkció a sikeres fizetés után
  const activatePremiumUpgrade = () => {
    setGameState(p => ({ 
      ...p, 
      hasPremiumUpgrade: true,
      solanaBlessingLevel: p.solanaBlessingLevel + 1 
    }));
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

  const acceptTerms = () => {
    if (!isCheckboxChecked) return;
    setIsTermsAccepted(true);
    setIsTermsModalOpen(false);
  };

  // Formázás és változók
  const fmt = n => Math.round(n).toLocaleString('en-US');
  const { marketCap, clickPower, passiveIncome, upgrades, levelIndex, solanaBlessingLevel, hasPremiumUpgrade } = gameState;
  const displayedClickPower = clickPower * (solanaBlessingLevel + 1);
  const displayedPassiveIncome = hasPremiumUpgrade ? passiveIncome * 10 : passiveIncome;
  const current = gameLevels[levelIndex];
  const next = gameLevels[levelIndex + 1];
  
  // Progress bar számítása (mostantól a minMarketCapThisLevel-től indul)
  const safeNumber = v => (typeof v === 'number' && !isNaN(v) ? v : 0);
  const safeCurrent = current && typeof current.threshold === 'number' ? current : { threshold: 0 };
  const safeNext = next && typeof next.threshold === 'number' ? next : null;
  const safeMarketCap = safeNumber(marketCap);
  const safeSubThousand = safeNumber(subThousandAccumulator);
  const safeMinMarketCap = safeNumber(gameState.minMarketCapThisLevel);

  let prog = 0;
  if (isDesktop) {
    if (safeNext && safeMarketCap < safeNext.threshold) {
      const denom = safeNext.threshold - safeMinMarketCap;
      prog = denom > 0 ? Math.min(((safeMarketCap - safeMinMarketCap) / denom) * 100, 100) : 0;
    } else if (safeMarketCap >= 1e12) {
      prog = Math.min((safeSubThousand / 1e11) * 100, 100);
    } else if (safeMarketCap >= 1e9) {
      prog = Math.min((safeSubThousand / 1e8) * 100, 100);
    } else if (safeMarketCap >= 1e8) {
      prog = Math.min((safeSubThousand / 1e6) * 100, 100);
    } else {
      prog = Math.min((safeSubThousand / 1e5) * 100, 100);
    }
  } else {
    if (safeNext && safeMarketCap < safeNext.threshold) {
      const denom = safeNext.threshold - safeMinMarketCap;
      prog = denom > 0 ? Math.min(((safeMarketCap - safeMinMarketCap) / denom) * 100, 100) : 0;
    } else if (safeMarketCap >= 1e12) {
      prog = Math.min((safeSubThousand / 1e11) * 100, 100);
    } else if (safeMarketCap >= 1e9) {
      prog = Math.min((safeSubThousand / 1e8) * 100, 100);
    } else if (safeMarketCap >= 1e8) {
      prog = Math.min((safeSubThousand / 1e6) * 100, 100);
    } else if (safeMarketCap >= 1e6) {
      prog = Math.min((safeSubThousand / 1e5) * 100, 100);
    } else {
      prog = Math.min((safeSubThousand / 1000) * 100, 100);
    }
  }
  
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

  if (!isTermsAccepted) {
    return (
      <section id="game" className="py-20 bg-gray-900 text-white relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Blurred Game Content */}
            <div className="backdrop-blur-md">
              <div className="flex justify-between items-center mb-8">
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-2">Bull Run Clicker</h1>
                  <p className="text-gray-400">Pump the market to the moon!</p>
                </div>
                <button
                  onClick={() => setMuted(m => !m)}
                  className="ml-4 text-2xl text-gray-400 hover:text-yellow-400 focus:outline-none"
                  aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
                >
                  {muted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
              </div>
              <div className="bg-gray-800/50 rounded-2xl p-8 mb-8 text-center">
                <div className="text-6xl font-bold mb-4">$0</div>
                <p className="text-gray-400">Market Cap</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-800/50 rounded-2xl p-6">
                  <h2 className="text-xl font-bold mb-4">Upgrades</h2>
                  <div className="space-y-4">
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold">Diamond Hands</h3>
                          <p className="text-sm text-gray-400">+1 MC per click</p>
                        </div>
                        <div className="text-right">
                          <div className="text-yellow-400">$100</div>
                          <div className="text-sm text-gray-400">Level 0</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Locked Game Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gray-900/95 border-2 border-yellow-500/30 rounded-2xl p-8 max-w-lg w-full text-center shadow-lg shadow-yellow-500/20">
                <div className="text-4xl mb-4">🔒</div>
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">Bull Run Clicker</h2>
                <p className="text-gray-300 mb-6">
                  Accept the terms and conditions to start your bull market adventure!
                </p>
                <button
                  onClick={() => setIsTermsModalOpen(true)}
                  className="bg-yellow-500 text-black font-bold py-2 px-8 rounded-lg hover:bg-yellow-400 transition-all"
                >
                  Unlock Game
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Terms Modal */}
        {isTermsModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-yellow-500/30 rounded-3xl shadow-2xl shadow-yellow-500/20 w-full max-w-[95%] sm:max-w-2xl flex flex-col max-h-[90vh] animate-fade-in-up overflow-hidden">
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-lg">🚀</span>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">Welcome to Bull Run!</h3>
                    <p className="text-gray-400 text-sm">Let's get you started</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsTermsModalOpen(false)} 
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-full"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {/* Welcome Message */}
                <div className="text-center mb-6">
                  <h4 className="text-2xl font-bold text-yellow-400 mb-2">Ready to Pump?</h4>
                  <p className="text-gray-300 text-lg">
                    Before you start your bull run, here's what you need to know:
                  </p>
                </div>

                {/* Game Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">🎮</span>
                      <h5 className="font-semibold text-white">Pure Entertainment</h5>
                    </div>
                    <p className="text-gray-400 text-sm">
                      This is a fun clicker game for entertainment only
                    </p>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">💰</span>
                      <h5 className="font-semibold text-white">Virtual Currency</h5>
                    </div>
                    <p className="text-gray-400 text-sm">
                      All in-game values are virtual and have no real value
                    </p>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">💾</span>
                      <h5 className="font-semibold text-white">Local Progress</h5>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Your progress is saved locally in your browser
                    </p>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">🎯</span>
                      <h5 className="font-semibold text-white">No Investment</h5>
                    </div>
                    <p className="text-gray-400 text-sm">
                      This is not a financial investment or trading platform
                    </p>
                  </div>
                </div>

                {/* Important Notice */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-yellow-400 text-xl">⚠️</span>
                    <div>
                      <h5 className="font-semibold text-yellow-400 mb-1">Important</h5>
                      <p className="text-gray-300 text-sm">
                        This is purely a game for fun. No real money can be earned, invested, or withdrawn. 
                        Just enjoy the bull run!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700">
                <div className="space-y-4">
                  {/* Checkbox */}
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={isCheckboxChecked}
                        onChange={(e) => setIsCheckboxChecked(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 border-2 rounded-md transition-all duration-200 flex items-center justify-center
                        ${isCheckboxChecked 
                          ? 'bg-yellow-500 border-yellow-500' 
                          : 'border-yellow-500/50 group-hover:border-yellow-500'}`}
                      >
                        {isCheckboxChecked && (
                          <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors text-sm">
                      I understand this is a game for entertainment only
                    </span>
                  </label>

                  {/* Action Button */}
                  <button
                    onClick={acceptTerms}
                    disabled={!isCheckboxChecked}
                    className={`w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-4 px-8 rounded-xl transition-all text-lg shadow-lg
                      ${isCheckboxChecked 
                        ? 'hover:from-yellow-400 hover:to-yellow-500 hover:shadow-xl hover:scale-105 transform' 
                        : 'opacity-50 cursor-not-allowed'}`}
                  >
                    Start Bull Run!
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }

  const shareText = `Just became a ${current.name} with $${fmt(marketCap)} MC! The bull run is real - join before you miss out: assbull.meme #BullRun #Altseason @assbull2025`;
  
  // Twitter share URL without duplicate website link
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  
  // Custom share function for video/gif (note: Twitter web intent doesn't support direct media upload)
  const handleCustomShare = () => {
    // For now, we'll use the standard Twitter share
    // In the future, this could be enhanced with Twitter API for media upload
    window.open(twitterUrl, '_blank');
  };

  return (
    <>
      <LevelUpModal
        isOpen={isLevelUpModalOpen}
        onClose={() => setIsLevelUpModalOpen(false)}
        levelName={gameLevels[gameState.levelIndex]?.name || "Unknown Level"}
        twitterUrl={twitterUrl}
        levelIndex={gameState.levelIndex}
      />
      <CustomModal isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)} onConfirm={confirmReset} title="Reset Game" confirmText="Yes, Reset" cancelText="No, Keep Progress">
        <p>Are you sure you want to reset? All your progress and upgrades will be permanently deleted!</p>
      </CustomModal>
      
      {/* How to Play Modal - Modern Design */}
      {isRulesModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-yellow-500/30 rounded-3xl shadow-2xl shadow-yellow-500/20 w-full max-w-[95%] sm:max-w-2xl flex flex-col max-h-[90vh] animate-fade-in-up overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-lg">🎮</span>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">How to Play</h3>
                  <p className="text-gray-400 text-sm">Master the Bull Run Clicker</p>
                </div>
              </div>
              <button 
                onClick={() => setIsRulesModalOpen(false)} 
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-full"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {/* Goal Section */}
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🎯</span>
                  <h4 className="font-semibold text-white text-lg">The Goal</h4>
                </div>
                <p className="text-gray-300">
                  Pump the Virtual Market Cap to reach new levels and become the ultimate bull! 
                  The higher you go, the more legendary your rank becomes.
                </p>
              </div>

              {/* How to Play Steps */}
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🚀</span>
                  <h4 className="font-semibold text-white text-lg">How to Play</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="bg-yellow-500 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">1</span>
                    <p className="text-gray-300">Smash <span className="text-yellow-400 font-semibold">"PUMP THE BULL"</span> to increase the market cap with each click.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-yellow-500 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">2</span>
                    <p className="text-gray-300">Buy <span className="text-yellow-400 font-semibold">Upgrades</span> to get more MC per click or passive income per second.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-yellow-500 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">3</span>
                    <p className="text-gray-300">Hit the <span className="text-yellow-400 font-semibold">Next Level threshold</span> to advance and change colors!</p>
                  </div>
                </div>
              </div>

              {/* Competition Section */}
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🏆</span>
                  <h4 className="font-semibold text-white text-lg">Compete & Share</h4>
                </div>
                <p className="text-gray-300">
                  Share your rank on X to challenge friends! See who can become the ultimate bull and reach the highest levels.
                </p>
              </div>

              {/* Tips Section */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-yellow-400 text-xl">💡</span>
                  <div>
                    <h5 className="font-semibold text-yellow-400 mb-1">Pro Tips</h5>
                    <p className="text-gray-300 text-sm">
                      • Focus on upgrades that give you the best return on investment<br/>
                      • Passive income upgrades work even when you're not clicking<br/>
                      • Higher levels unlock more powerful upgrades<br/>
                      • Don't forget to share your achievements!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700">
              <button
                onClick={() => setIsRulesModalOpen(false)}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-4 px-8 rounded-xl transition-all text-lg shadow-lg hover:from-yellow-400 hover:to-yellow-500 hover:shadow-xl hover:scale-105 transform"
              >
                Got it! Let's Pump!
              </button>
            </div>
          </div>
        </div>
      )}
      
      <SolanaPayModal
        isOpen={isSolanaModalOpen}
        onClose={() => setIsSolanaModalOpen(false)}
        onPaymentSuccess={activatePremiumUpgrade}
        currentLevel={solanaBlessingLevel}
      />

      <section id="game" className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-6 text-center max-w-7xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Bull Run Clicker</h2>
          <p className="text-lg text-gray-400 mb-12">How high can you pump the market cap?</p>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Panel */}
            <div className="xl:col-span-2 bg-black/50 p-8 rounded-2xl border border-white/10 flex flex-col justify-between">
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
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4 mt-1">
                  <div
                    className={`h-4 rounded-full transition-all duration-300 bg-gradient-to-r ${currentBarFrom} ${currentBarTo}`}
                    style={{ width: `${prog}%` }}
                  />
                </div>
                <div className="w-full text-right mt-1">
                  <p className="text-sm text-gray-400">{ next ? `Next: $${fmt(marketCap)}/${fmt(next.threshold)}` : (window.innerWidth >= 768 ? "MAX LEVEL" : "MAX") }</p>
                </div>
              </div>

              {/* Market Cap & Pump Button */}
              <div className="flex flex-col items-center mb-6">
                <h3 className="text-2xl md:text-3xl font-bold text-yellow-400">Virtual Market Cap</h3>
                
                {/* Mobilnézet */}
                <div className="md:hidden flex flex-col items-center">
                  <p className="text-6xl font-mono font-bold my-2 text-white drop-shadow-lg">
                    ${marketCap >= 1e12 ? 
                      `${(marketCap / 1e12).toFixed(1)}T` :
                      marketCap >= 1e9 ? 
                        `${(marketCap / 1e9).toFixed(1)}B` :
                        marketCap >= 1e6 ? 
                          `${(marketCap / 1e6).toFixed(1)}M` :
                          marketCap >= 1e4 ? 
                            `${Math.floor(marketCap / 1e3)}K` :
                          fmt(marketCap)
                    }
                  </p>
                  {marketCap >= 1e4 && marketCap < 1e6 && (
                    <p className="text-3xl font-mono font-bold text-white">
                      +${fmt(subThousandAccumulator)}
                    </p>
                  )}
                  {marketCap >= 1e6 && marketCap < 1e9 && (
                    <p className="text-3xl font-mono font-bold text-white">
                      +${fmt(subThousandAccumulator)}
                    </p>
                  )}
                  {marketCap >= 1e9 && marketCap < 1e12 && (
                    <p className="text-3xl font-mono font-bold text-white">
                      +${fmt(subThousandAccumulator)}
                    </p>
                  )}
                  {marketCap >= 1e12 && (
                    <p className="text-3xl font-mono font-bold text-white">
                      +${fmt(Math.min(subThousandAccumulator, 99999999))}
                    </p>
                  )}
                </div>

                {/* Asztali nézet */}
                <div className="hidden md:flex flex-col items-center">
                  <p className={`${
                    marketCap < 1e8 ? 'text-8xl' : 'text-6xl'
                  } font-mono font-bold my-2 text-white drop-shadow-lg`}>
                    ${marketCap >= 1e12 ? 
                      `${(marketCap / 1e12).toFixed(1)}T` :
                      marketCap >= 1e9 ? 
                        `${(marketCap / 1e9).toFixed(1)}B` :
                        marketCap >= 1e6 ? 
                      `${(marketCap / 1e6).toFixed(1)}M` :
                        fmt(marketCap)
                    }
                  </p>
                  {marketCap >= 1e6 && marketCap < 1e9 && (
                    <p className="text-4xl font-mono font-bold text-white">
                      +${fmt(subThousandAccumulator)}
                    </p>
                  )}
                  {marketCap >= 1e9 && marketCap < 1e12 && (
                    <p className="text-4xl font-mono font-bold text-white">
                      +${fmt(subThousandAccumulator)}
                    </p>
                  )}
                  {marketCap >= 1e12 && (
                    <p className="text-4xl font-mono font-bold text-white">
                      +${fmt(Math.min(subThousandAccumulator, 99999999))}
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <button
                    onClick={handlePump}
                    disabled={gameState.levelIndex >= gameLevels.length - 1 || gameState.marketCap >= 5e12}
                    className={`relative py-6 px-12 rounded-full font-bold text-2xl transition-all duration-300 ${
                      gameState.levelIndex >= gameLevels.length - 1 || gameState.marketCap >= 5e12
                        ? 'cursor-not-allowed bg-gray-800 border-2 border-gray-700'
                        : 'bg-yellow-500 hover:opacity-90 active:scale-95 shadow-yellow-500/20 text-gray-900'
                    }`}
                  >
                    {gameState.marketCap >= 5e12 ? "MAXIMUM REACHED" : 
                     gameState.levelIndex >= gameLevels.length - 1 ? "MAX LEVEL REACHED" : 
                     "PUMP THE BULL"}
                  </button>
                </div>
              </div>

              {/* Controls */}
              <div className="hidden md:flex justify-center items-center space-x-4 mt-8">
                <button onClick={() => setIsRulesModalOpen(true)} className="bg-blue-900/70 text-white py-3 px-6 rounded-full flex items-center space-x-2 hover:bg-blue-700 transition-all">
                  <FaQuestionCircle className="text-xl"/> <span>How to Play</span>
                </button>
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className={`bg-gray-800 text-white py-3 px-6 rounded-full inline-flex items-center space-x-2 transition-all shadow-lg ${window.innerWidth < 768 ? 'h-16 text-lg hover:bg-gray-800' : 'hover:bg-white hover:text-black'}`}> 
                  <FaXTwitter/><span>Share Score</span>
                </a>
                <button onClick={() => setIsResetModalOpen(true)} className="bg-red-900/70 text-white py-3 px-6 rounded-full flex items-center space-x-2 hover:bg-red-700 transition-all">
                  <FaSync className="text-xl"/> <span>Reset</span>
                </button>
                <button onClick={() => setMuted(m => !m)} className="p-3 bg-yellow-600 rounded-full hover:bg-yellow-700 transition-all" aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}>
                  {muted ? <FaVolumeMute className="text-2xl text-white" /> : <FaVolumeUp className="text-2xl text-white" />}
                </button>
              </div>

              {/* Mobile Controls */}
              <div className="md:hidden flex flex-col items-center gap-6 mt-8">
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className={`bg-gray-800 text-white py-3 px-6 rounded-full inline-flex items-center space-x-2 transition-all shadow-lg ${window.innerWidth < 768 ? 'h-16 text-lg hover:bg-gray-800' : 'hover:bg-white hover:text-black'}`}> 
                  <FaXTwitter/><span>Share Score</span>
                </a>
                <div className="flex space-x-6">
                  <button onClick={() => setIsRulesModalOpen(true)} className="p-3 bg-blue-900/70 rounded-full hover:bg-blue-700 transition-all">
                    <FaQuestionCircle className="text-2xl text-white"/>
                  </button>
                  <button onClick={() => setIsResetModalOpen(true)} className="p-3 bg-red-900/70 rounded-full hover:bg-red-700 transition-all">
                    <FaSync className="text-2xl text-white"/>
                  </button>
                  <button onClick={() => setMuted(m => !m)} className="p-3 bg-yellow-600 rounded-full hover:bg-yellow-700 transition-all" aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}>
                    {muted ? <FaVolumeMute className="text-2xl text-white" /> : <FaVolumeUp className="text-2xl text-white" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Upgrades Panel */}
            <UpgradesPanel 
              upgrades={gameState.upgrades}
              marketCap={gameState.marketCap}
              buyUpgrade={handleUpgrade}
              clickPower={gameState.clickPower}
              passiveIncome={gameState.passiveIncome}
              hasPremiumUpgrade={gameState.hasPremiumUpgrade}
              onSolanaUpgradeClick={() => setIsSolanaModalOpen(true)}
              unlockSound={unlockSound}
              usesLeft={gameState.usesLeft}
              getNextLevelUses={(upgradeId) => {
                if (upgradeId === 1) return Infinity; // Diamond Hands
                if (upgradeId === 2) return Infinity; // Bull's Strength
                if (upgradeId === 3) return Infinity; // Moon Shot
                if (upgradeId === 4) return Infinity; // Shill Army
                if (upgradeId === 5) return 100; // FOMO Generator
                if (upgradeId === 6) return 20; // Whale Magnet
                return 0;
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
