import React, { useState, useEffect, useRef } from 'react';
import { FaBolt, FaLock, FaTimes } from 'react-icons/fa';
import { useMute } from './MuteContext';

const RequirementsModal = ({ isOpen, onClose, upgrade, requiredUpgrade }) => {
    if (!isOpen || !upgrade || !requiredUpgrade) return null;

    const currentUses = usesLeft[upgrade.id] ?? 0;
    const tiers = Math.floor(requiredUpgrade.level / 5);
    const maxUses = tiers * getNextLevelUses(upgrade.id, upgrades);
    const isLocked = currentUses <= 0;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <div className="bg-gray-900 border-2 border-yellow-500/30 rounded-2xl shadow-lg shadow-yellow-500/20 w-full max-w-lg flex flex-col max-h-[90vh] animate-fade-in-up">
                <div className="flex justify-between items-center p-6 border-b border-gray-700">
                    <h3 className="text-2xl font-bold text-yellow-400">Upgrade Requirements</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <FaTimes />
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto p-6 space-y-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                        <h4 className="text-xl font-bold mb-2 text-yellow-400">{upgrade.name}</h4>
                        <p className="text-gray-300 mb-4">{upgrade.description}</p>
                        
                        {isLocked ? (
                            <div className="text-red-400">
                                <p className="font-bold mb-2">This upgrade is currently locked!</p>
                                <p>You need to wait until {requiredUpgrade.name} reaches level {requiredUpgrade.requirements?.level || 5} to unlock more uses.</p>
                            </div>
                        ) : (
                            <div className="text-green-400">
                                <p className="font-bold mb-2">This upgrade is available!</p>
                                <p>Uses remaining: {currentUses}/{maxUses}</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-end space-x-4 p-6 border-t border-gray-700">
                    <button
                        onClick={onClose}
                        className="bg-gray-600 py-2 px-5 rounded-lg hover:bg-gray-500 transition-all"
                    >
                        Close
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
                    <h3 className="text-2xl font-bold text-yellow-400">Need More Market Cap!</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <FaTimes />
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto p-6 space-y-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                        <p className="text-gray-300 text-lg mb-2">
                            Not enough Market Cap to purchase this upgrade!
                        </p>
                        <div className="flex items-center justify-between mt-3">
                            <div>
                                <p className="text-gray-400">Required:</p>
                                <p className="text-yellow-400 font-bold">${cost.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">Your Balance:</p>
                                <p className="text-red-400 font-bold">${marketCap.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                        <p className="text-gray-300">Keep clicking to earn more Market Cap!</p>
                        <p className="text-yellow-400 mt-2">You need ${(cost - marketCap).toLocaleString()} more!</p>
                    </div>
                </div>
                <div className="flex justify-end space-x-4 p-6 border-t border-gray-700">
                    <button
                        onClick={onClose}
                        className="bg-yellow-500 text-black font-bold py-2 px-8 rounded-lg hover:bg-yellow-400 transition-all"
                    >
                        Let&apos;s Go!
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
    unlockSound,
    usesLeft,
    getNextLevelUses
}) => {
    const [selectedUpgrade, setSelectedUpgrade] = useState(null);
    const [insufficientFundsUpgrade, setInsufficientFundsUpgrade] = useState(null);
    const [activeTab, setActiveTab] = useState('click');
    const [forceUpdate, setForceUpdate] = useState(false);
    const lastReqLevelRef = useRef({});
    const { muted: globalMuted } = useMute();

    // Reset usesLeft when marketCap is 0 (game reset)
    useEffect(() => {
        if (marketCap === 0) {
            setForceUpdate(prev => !prev);
        }
    }, [marketCap]);

    const fmt = n => Math.round(n).toLocaleString('en-US');
    const displayedPassiveIncome = hasPremiumUpgrade ? passiveIncome * 10 : passiveIncome;

    const isUnlocked = u => {
        if (u.id === 1) return true; // Diamond Hands mindig feloldott
        const currentUses = usesLeft[u.id] ?? 0;
        // Ellenőrizzük mind a használatokat, mind a feloldási állapotot
        return currentUses > 0 && u.isUnlocked;
    };

    const priceMultiplier = (id) => {
        if (id === 1) return 1.02;         // Diamond Hands: 2% growth
        if (id === 5 || id === 6) return 1.15;
        return 1.10;
    };

    useEffect(() => {
        // végigmegyünk azokon az upgrade-eken, amelyeknek van követelménye
        for (let id = 2; id <= 6; id++) {
            const req = upgrades.find(u => u.id === id - 1);
            const upgrade = upgrades.find(u => u.id === id);
            if (!req || !upgrade || !upgrade.requirements) continue;
            const lvl = req.level;
            const last = lastReqLevelRef.current[id];
            // Csak akkor unlockolunk, ha most lépte át a requirements.level-t
            lastReqLevelRef.current[id] = lvl;
        }
    }, [upgrades]);

    const handleUpgradeClick = (u) => {
        // Diamond Hands esetén ne ellenőrizzük a használatokat
        if (u.id !== 1) {
            const currentUses = usesLeft[u.id] ?? 0;
            
            // Ha nincs több használat, akkor lezárjuk
            if (currentUses <= 0) {
                const req = upgrades.find(x => x.id === u.requirements?.upgradeId);
                setSelectedUpgrade({ upgrade: u, requiredUpgrade: req });
                return;
            }

            // Ha nincs feloldva, akkor lezárjuk
            if (!isUnlocked(u)) {
                const req = upgrades.find(x => x.id === u.requirements?.upgradeId);
                setSelectedUpgrade({ upgrade: u, requiredUpgrade: req });
                return;
            }
        }

        const cost = Math.floor(u.baseCost * priceMultiplier(u.id) ** u.level);
        if (marketCap >= cost) {
            buyUpgrade(u);
        } else {
            setInsufficientFundsUpgrade({ upgrade: u, cost });
        }
    };

    const handleCloseRequirementsModal = () => setSelectedUpgrade(null);

    const clickUpgrades = upgrades.filter(u => u.type === 'click');
    const passiveUpgrades = upgrades.filter(u => u.type === 'passive');
    const solPrice = lvl => (0.05 * Math.pow(1.5, lvl)).toFixed(2);
    const solMult = lvl => lvl + 1;

    return (
        <div className="bg-gray-800/50 rounded-2xl p-6 flex flex-col h-full" key={forceUpdate}>
            <h3 className="text-2xl font-bold mb-4">Upgrades</h3>

            {/* Tabs */}
            <div className="flex space-x-2 mb-4">
                <button
                    onClick={() => setActiveTab('click')}
                    className={`flex-1 py-2 px-4 rounded-lg font-bold transition-all ${
                        activeTab === 'click' ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                >
                    Click Power
                </button>
                <button
                    onClick={() => setActiveTab('passive')}
                    className={`flex-1 py-2 px-4 rounded-lg font-bold transition-all ${
                        activeTab === 'passive' ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                >
                    MC/Second
                </button>
            </div>

            {/* Upgrade list */}
            <div className="space-y-4 pb-2">
                {activeTab === 'click' ? (
                    clickUpgrades.map((u, index) => (
                        <div key={u.id} className={`flex justify-between items-center ${index === clickUpgrades.length - 1 ? 'mb-6' : ''}`}>
                            <button
                                onClick={() => handleUpgradeClick(u)}
                                disabled={!isUnlocked(u) || marketCap < Math.floor(u.baseCost * priceMultiplier(u.id) ** u.level)}
                                className={`w-full group transition-all duration-300 ${
                                    !isUnlocked(u) ? 'opacity-50 cursor-not-allowed' : 
                                    marketCap >= Math.floor(u.baseCost * priceMultiplier(u.id) ** u.level) ? 'hover:scale-105' : 'opacity-70'
                                }`}
                            >
                                <div className={`bg-gray-800/50 rounded-xl p-4 border-2 ${
                                    !isUnlocked(u) ? 'border-gray-700' : 
                                    marketCap >= Math.floor(u.baseCost * priceMultiplier(u.id) ** u.level) ? 'border-yellow-500/50 group-hover:border-yellow-500' : 'border-gray-600'
                                } transition-all duration-300`}>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="flex items-center text-lg font-bold">
                                                {!isUnlocked(u) ? (
                                                    <>
                                                        <FaLock className="mr-2 text-gray-400" />
                                                        <span className="text-gray-400">{u.name}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaBolt className="mr-2 text-yellow-300 transition-transform duration-300 group-hover:scale-125" />
                                                        <span className="text-white">{u.name}</span>
                                                    </>
                                                )}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                {u.description}
                                                {u.type === 'click' ? ` ($${u.power} MC/click)` : ` ($${u.power} MC/sec)`}
                                            </p>
                                            {!isUnlocked(u) && u.requirements && (() => {
                                                const req = upgrades.find(x => x.id === u.requirements.upgradeId);
                                                return (
                                                    <p className="text-xs text-red-500 mt-1 text-left">
                                                        * {req?.name || 'Unknown'} (lvl {req?.level ?? 0}/{u.requirements.level})
                                                    </p>
                                                );
                                            })()}
                                        </div>
                                        <div className="flex flex-col items-end min-w-[90px]">
                                            <span className="text-lg font-bold text-gray-100">${fmt(Math.floor(u.baseCost * priceMultiplier(u.id) ** u.level))}</span>
                                            <div className="flex flex-row gap-2 mt-1">
                                                <span className="text-xs text-gray-400">Lvl {u.level}</span>
                                                <span className="text-xs text-gray-500">{[1,2,3,4].includes(u.id) ? 'infinite' : `${usesLeft[u.id] ?? 0}/${getNextLevelUses(u.id, upgrades)}`}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </div>
                    ))
                ) : (
                    passiveUpgrades.map((u, index) => (
                        <div key={u.id} className={`flex justify-between items-center ${index === passiveUpgrades.length - 1 ? 'mb-6' : ''}`}>
                            <button
                                onClick={() => handleUpgradeClick(u)}
                                disabled={!isUnlocked(u) || marketCap < Math.floor(u.baseCost * priceMultiplier(u.id) ** u.level)}
                                className={`w-full group transition-all duration-300 ${
                                    !isUnlocked(u) ? 'opacity-50 cursor-not-allowed' : 
                                    marketCap >= Math.floor(u.baseCost * priceMultiplier(u.id) ** u.level) ? 'hover:scale-105' : 'opacity-70'
                                }`}
                            >
                                <div className={`bg-gray-800/50 rounded-xl p-4 border-2 ${
                                    !isUnlocked(u) ? 'border-gray-700' : 
                                    marketCap >= Math.floor(u.baseCost * priceMultiplier(u.id) ** u.level) ? 'border-yellow-500/50 group-hover:border-yellow-500' : 'border-gray-600'
                                } transition-all duration-300`}>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="flex items-center text-lg font-bold">
                                                {!isUnlocked(u) ? (
                                                    <>
                                                        <FaLock className="mr-2 text-gray-400" />
                                                        <span className="text-gray-400">{u.name}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaBolt className="mr-2 text-yellow-300 transition-transform duration-300 group-hover:scale-125" />
                                                        <span className="text-white">{u.name}</span>
                                                    </>
                                                )}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                {u.description}
                                                {u.type === 'click' ? ` ($${u.power} MC/click)` : ` ($${u.power} MC/sec)`}
                                            </p>
                                            {!isUnlocked(u) && u.requirements && (() => {
                                                const req = upgrades.find(x => x.id === u.requirements.upgradeId);
                                                return (
                                                    <p className="text-xs text-red-500 mt-1 text-left">
                                                        * {req?.name || 'Unknown'} (lvl {req?.level ?? 0}/{u.requirements.level})
                                                    </p>
                                                );
                                            })()}
                                        </div>
                                        <div className="flex flex-col items-end min-w-[90px]">
                                            <span className="text-lg font-bold text-gray-100">${fmt(Math.floor(u.baseCost * priceMultiplier(u.id) ** u.level))}</span>
                                            <div className="flex flex-row gap-2 mt-1">
                                                <span className="text-xs text-gray-400">Lvl {u.level}</span>
                                                <span className="text-xs text-gray-500">{[1,2,3,4].includes(u.id) ? 'infinite' : `${usesLeft[u.id] ?? 0}/${getNextLevelUses(u.id, upgrades)}`}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="mt-auto pt-4 border-t-2 border-white/10 text-center">
                <div className="flex justify-around">
                    <div>
                        <p className="text-gray-400 text-sm">MC / Click</p>
                        <p className="font-bold text-white text-lg">${fmt(clickPower)}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">MC / Second</p>
                        <p className={`font-bold text-lg transition-colors ${
                            hasPremiumUpgrade ? 'text-purple-400' : 'text-white'
                        }`}
                        >
                            ${fmt(displayedPassiveIncome)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {selectedUpgrade && (
                <RequirementsModal
                    key={`${selectedUpgrade.upgrade.id}-${usesLeft[selectedUpgrade.upgrade.id] ?? 0}`}
                    isOpen
                    onClose={handleCloseRequirementsModal}
                    upgrade={selectedUpgrade.upgrade}
                    requiredUpgrade={selectedUpgrade.requiredUpgrade}
                />
            )}
            {insufficientFundsUpgrade && (
                <InsufficientFundsModal
                    isOpen
                    onClose={() => setInsufficientFundsUpgrade(null)}
                    cost={insufficientFundsUpgrade.cost}
                    marketCap={insufficientFundsUpgrade.marketCap}
                />
            )}
        </div>
    );
};

export default UpgradesPanel;