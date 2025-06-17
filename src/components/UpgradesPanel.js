import React from 'react';
import { FaBolt } from 'react-icons/fa';

const UpgradesPanel = ({ 
  upgrades, 
  marketCap, 
  buyUpgrade, 
  clickPower, 
  passiveIncome, 
  hasPremiumUpgrade,
  onSolanaUpgradeClick 
}) => {
  const fmt = n => Math.round(n).toLocaleString('en-US');
  const displayedPassiveIncome = hasPremiumUpgrade ? passiveIncome * 10 : passiveIncome;

  return (
    <div className="bg-black/50 p-6 rounded-2xl border border-white/10 flex flex-col">
      <h3 className="text-2xl font-bold mb-4">Upgrades</h3>
      <div className="space-y-3 flex-grow overflow-y-auto">
        {upgrades.map(u => {
          const cost = Math.floor(u.baseCost * 1.15 ** u.level);
          const canBuy = marketCap >= cost;
          return (
            <button
              key={u.id}
              onClick={() => buyUpgrade(u.id)}
              disabled={!canBuy}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                canBuy
                  ? 'border-yellow-500/50 bg-gray-800 hover:bg-yellow-500 hover:text-black'
                  : 'border-gray-700 bg-gray-800/50 text-gray-500 cursor-not-allowed'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{u.name} <span className="text-xs">(Lvl {u.level})</span></p>
                  <p className="text-sm" dangerouslySetInnerHTML={{ __html: u.description.replace(/'/g, '&apos;') }} />
                </div>
                <p className="font-bold text-lg">${fmt(cost)}</p>
              </div>
            </button>
          );
        })}

        {/* Solana Premium Upgrade - most az utolsó fejlesztésként */}
        {!hasPremiumUpgrade && (
          <button 
            onClick={onSolanaUpgradeClick} 
            className="w-full p-3 rounded-lg border-2 border-purple-500 bg-purple-900/50 hover:bg-purple-800 transition-all group"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="text-left">
                <p className="font-bold text-white flex items-center">
                  <FaBolt className="text-yellow-400 mr-2" />
                  Solana Bull&apos;s Blessing
                </p>
                <p className="text-sm text-gray-300 mt-1">
                  Permanently multiply your passive income by 10x!
                </p>
              </div>
              <div className="text-center shrink-0">
                <p className="font-bold text-lg text-white">0.05</p>
                <p className="text-xs text-gray-400">SOL</p>
              </div>
            </div>
          </button>
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
    </div>
  );
};

export default UpgradesPanel; 