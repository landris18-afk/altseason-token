import React, { useState } from 'react';
import { FaBolt, FaLock, FaTimes } from 'react-icons/fa';

const RequirementsModal = ({ isOpen, onClose, upgrade, requiredUpgrade }) => {
  if (!isOpen) return null;

  // Kiszámoljuk a következő szint követelményeit
  const getNextLevelRequirement = () => {
    if (!upgrade.requirements) return upgrade.requirements.level;
    return upgrade.requirements.level + (upgrade.level * 5);
  };

  const nextLevel = getNextLevelRequirement();

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-gray-900 border-2 border-yellow-500/30 rounded-2xl shadow-lg shadow-yellow-500/20 w-full max-w-lg flex flex-col max-h-[90vh] animate-fade-in-up">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h3 className="text-2xl font-bold text-yellow-400">🚀 New Upgrade Available!</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <p className="text-gray-300 text-lg mb-2">
              <span className="text-yellow-400 font-bold">{upgrade.name}</span> is waiting to be unlocked! 🔒
            </p>
            <p className="text-gray-400">
              To unlock this powerful upgrade, you need to reach Level {nextLevel} of{' '}
              <span className="text-yellow-400">{requiredUpgrade.name}</span>.
            </p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <p className="text-gray-300">
              Keep grinding and upgrading your {requiredUpgrade.name} to unlock this game-changing upgrade! 💪
            </p>
            <p className="text-yellow-400 mt-2">
              Current Progress: Level {requiredUpgrade.level} / {nextLevel} 🎯
            </p>
          </div>
        </div>
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="bg-yellow-500 text-black font-bold py-2 px-8 rounded-lg hover:bg-yellow-400 transition-all"
          >
            <p className="text-gray-300 mb-4">
              Let&apos;s Go! 🚀
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

const InsufficientFundsModal = ({ isOpen, onClose, cost, marketCap }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-gray-900 border-2 border-yellow-500/30 rounded-2xl shadow-lg shadow-yellow-500/20 w-full max-w-lg flex flex-col max-h-[90vh] animate-fade-in-up">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h3 className="text-2xl font-bold text-yellow-400">💰 Need More Market Cap!</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <p className="text-gray-300 text-lg mb-2">
              Not enough Market Cap to purchase this upgrade! 💸
            </p>
            <div className="flex items-center justify-between mt-3">
              <div>
                <p className="text-gray-400">Required:</p>
                <p className="text-yellow-400 font-bold">${cost.toLocaleString()} 💰</p>
              </div>
              <div>
                <p className="text-gray-400">Your Balance:</p>
                <p className="text-red-400 font-bold">${marketCap.toLocaleString()} 💸</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <p className="text-gray-300">
              Keep clicking and upgrading to earn more Market Cap! The bull market is waiting! 🐂
            </p>
            <p className="text-yellow-400 mt-2">
              You need ${(cost - marketCap).toLocaleString()} more to unlock this upgrade! 💪
            </p>
          </div>
        </div>
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="bg-yellow-500 text-black font-bold py-2 px-8 rounded-lg hover:bg-yellow-400 transition-all"
          >
            Back to Grinding! 💪
          </button>
        </div>
      </div>
    </div>
  );
};

const UpgradesPanel = ({ 
  upgrades, 
  marketCap, 
  buyUpgrade, 
  clickPower, 
  passiveIncome, 
  hasPremiumUpgrade,
  onSolanaUpgradeClick 
}) => {
  const [selectedUpgrade, setSelectedUpgrade] = useState(null);
  const [insufficientFundsUpgrade, setInsufficientFundsUpgrade] = useState(null);
  const [activeTab, setActiveTab] = useState('click'); // 'click' or 'passive'
  const fmt = n => Math.round(n).toLocaleString('en-US');
  const displayedPassiveIncome = hasPremiumUpgrade ? passiveIncome * 10 : passiveIncome;

  // Segédfüggvény az előfeltételek ellenőrzéséhez
  const checkRequirements = (upgrade) => {
    // Ha nincs requirements, akkor nincs előfeltétel
    if (!upgrade.requirements) return true;

    // Megkeressük a szükséges fejlesztést
    const requiredUpgrade = upgrades.find(u => u.id === upgrade.requirements.upgradeId);
    if (!requiredUpgrade) return false;

    // Ha a fejlesztés már van szintje, akkor ellenőrizzük a következő szinthez szükséges követelményeket
    if (upgrade.level > 0) {
      const nextLevelRequirement = upgrade.requirements.level + (upgrade.level * 5);
      return requiredUpgrade.level >= nextLevelRequirement;
    }

    // Ha még nincs szintje, akkor az alap követelményeket ellenőrizzük
    return requiredUpgrade.level >= upgrade.requirements.level;
  };

  const handleUpgradeClick = (u) => {
    // Először ellenőrizzük, hogy zárolva van-e
    const isLocked = !checkRequirements(u);
    if (isLocked) {
      const requiredUpgrade = upgrades.find(x => x.id === u.requirements?.upgradeId);
      setSelectedUpgrade({ upgrade: u, requiredUpgrade });
      return;
    }

    // Ha nincs zárolva, ellenőrizzük a pénzt
    const cost = Math.floor(u.baseCost * 1.15 ** u.level);
    if (marketCap < cost) {
      setInsufficientFundsUpgrade({ cost, marketCap });
      return;
    }

    // Ha minden rendben, megvásároljuk
    buyUpgrade(u.id);
  };

  const handleCloseRequirementsModal = () => {
    setSelectedUpgrade(null);
  };

  // Szűrjük a fejlesztéseket típus szerint
  const clickUpgrades = upgrades.filter(u => u.type === 'click');
  const passiveUpgrades = upgrades.filter(u => u.type === 'passive');

  // ÚJ: Solana Bull's Blessing ár számítás
  const calculateSolanaPrice = (level) => {
    const basePrice = 0.05;
    return basePrice * Math.pow(1.5, level);
  };

  // ÚJ: Solana Bull's Blessing szorzó számítás
  const calculateMultiplier = (level) => {
    return level + 1; // 0 = nincs, 1 = 2x, 2 = 3x, stb.
  };

  return (
    <div className="bg-black/50 p-6 rounded-2xl border border-white/10 flex flex-col">
      <h3 className="text-2xl font-bold mb-4">Upgrades</h3>
      
      {/* Tabs */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveTab('click')}
          className={`flex-1 py-2 px-4 rounded-lg font-bold transition-all ${
            activeTab === 'click'
              ? 'bg-yellow-500 text-black'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Click Power
        </button>
        <button
          onClick={() => setActiveTab('passive')}
          className={`flex-1 py-2 px-4 rounded-lg font-bold transition-all ${
            activeTab === 'passive'
              ? 'bg-yellow-500 text-black'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          MC/Second
        </button>
      </div>

      <div className="space-y-3 flex-grow overflow-y-auto">
        {(activeTab === 'click' ? clickUpgrades : passiveUpgrades).map(u => {
          const cost = Math.floor(u.baseCost * 1.15 ** u.level);
          const isLocked = !checkRequirements(u);
          const canBuy = !isLocked && marketCap >= cost;

          return (
            <button
              key={u.id}
              onClick={() => handleUpgradeClick(u)}
              className={`relative w-full p-4 rounded-xl text-left transition-all ${
                isLocked 
                  ? 'bg-gray-700/30'
                  : canBuy 
                    ? 'border-2 border-yellow-500/50 bg-gray-800 hover:bg-yellow-500 hover:text-black'
                    : 'border-2 border-gray-700 bg-gray-800/50 text-gray-500'
              }`}
            >
              {isLocked && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] rounded-lg flex items-center justify-center z-10">
                  <div className="bg-gray-900/50 rounded-full p-4">
                    <FaLock className="text-yellow-500 text-4xl" />
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold">{u.name}</p>
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded">Lvl {u.level}</span>
                  </div>
                  <p className="text-sm mt-1" dangerouslySetInnerHTML={{ __html: u.description.replace(/'/g, '&apos;') }} />
                </div>
                <p className="font-bold text-lg">${fmt(cost)}</p>
              </div>
            </button>
          );
        })}

        {/* Solana Bull's Blessing */}
        {!hasPremiumUpgrade && (
          <div className="mt-6 pt-6 border-t-2 border-white/10">
            <button
              onClick={onSolanaUpgradeClick}
              className="w-full p-4 rounded-lg border-2 border-purple-500 bg-purple-900/50 hover:bg-purple-800 transition-all group"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-left">
                  <p className="font-bold text-white flex items-center">
                    <FaBolt className="text-yellow-400 mr-2" />
                    Solana Bull&apos;s Blessing
                  </p>
                  <p className="text-sm text-gray-300 mt-1">
                    Multiply your Click Power and MC/sec by {calculateMultiplier(0)}x!
                  </p>
                </div>
                <div className="text-center shrink-0">
                  <p className="font-bold text-lg text-white">{calculateSolanaPrice(0)}</p>
                  <p className="text-xs text-gray-400">SOL</p>
                </div>
              </div>
            </button>
          </div>
        )}

        {hasPremiumUpgrade && (
          <div className="mt-6 pt-6 border-t-2 border-white/10">
            <button
              onClick={onSolanaUpgradeClick}
              className="w-full p-4 rounded-lg border-2 border-purple-500 bg-purple-900/50 hover:bg-purple-800 transition-all group"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-left">
                  <p className="font-bold text-white flex items-center">
                    <FaBolt className="text-yellow-400 mr-2" />
                    Solana Bull&apos;s Blessing
                  </p>
                  <p className="text-sm text-gray-300 mt-1">
                    Current: {calculateMultiplier(0)}x | Next: {calculateMultiplier(1)}x
                  </p>
                </div>
                <div className="text-center shrink-0">
                  <p className="font-bold text-lg text-white">{calculateSolanaPrice(0)}</p>
                  <p className="text-xs text-gray-400">SOL</p>
                </div>
              </div>
            </button>
          </div>
        )}
      </div>

      <div className="mt-auto pt-4 border-t-2 border-white/10 text-center">
        <div className="flex justify-around">
          <div>
            <p className="text-gray-400 text-sm">MC / Click</p>
            <p className="font-bold text-white text-lg">{fmt(clickPower)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">MC / Second</p>
            <p className={`font-bold text-lg transition-colors ${hasPremiumUpgrade ? 'text-purple-400' : 'text-white'}`}>
              {fmt(displayedPassiveIncome)}
            </p>
          </div>
        </div>
      </div>

      <RequirementsModal
        isOpen={selectedUpgrade !== null}
        onClose={handleCloseRequirementsModal}
        upgrade={selectedUpgrade?.upgrade}
        requiredUpgrade={selectedUpgrade?.requiredUpgrade}
      />

      <InsufficientFundsModal
        isOpen={insufficientFundsUpgrade !== null}
        onClose={() => setInsufficientFundsUpgrade(null)}
        cost={insufficientFundsUpgrade?.cost}
        marketCap={insufficientFundsUpgrade?.marketCap}
      />
    </div>
  );
};

export default UpgradesPanel; 