import React, { useState, useEffect, useRef } from 'react';
import { FaBolt, FaLock, FaTimes } from 'react-icons/fa';

const RequirementsModal = ({ isOpen, onClose, upgrade, requiredUpgrade }) => {
    if (!isOpen || !upgrade || !requiredUpgrade) return null;

    const currentUses = usesLeft[upgrade.id] ?? 0;
    const tiers = Math.floor(requiredUpgrade.level / 5);
    const maxUses = tiers * getNextLevelUses(upgrade.id);
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
    unlockSound
}) => {
    const [selectedUpgrade, setSelectedUpgrade] = useState(null);
    const [insufficientFundsUpgrade, setInsufficientFundsUpgrade] = useState(null);
    const [activeTab, setActiveTab] = useState('click');
    const [usesLeft, setUsesLeft] = useState({});
    const lastReqLevelRef = useRef({});

    const fmt = n => Math.round(n).toLocaleString('en-US');
    const displayedPassiveIncome = hasPremiumUpgrade ? passiveIncome * 10 : passiveIncome;

    const isUnlocked = u => {
        if (u.id === 1) return true; // Diamond Hands mindig feloldott
        const currentUses = usesLeft[u.id] ?? 0;
        return currentUses > 0;
    };

    const priceMultiplier = (id) => {
        if (id === 1) return 1.02;         // Diamond Hands: 2% growth
        if (id === 5 || id === 6) return 1.15;
        return 1.10;
    };

    const getNextLevelUses = (upgradeId) => {
        if (upgradeId === 1) return Infinity; // Diamond Hands mindig végtelen
        if (upgradeId === 2) return 5; // Bull's Strength: mindig 5
        if (upgradeId === 3) return 4; // Moon Shot: mindig 4
        if (upgradeId === 4) return 3; // Shill Army: mindig 3
        if (upgradeId === 5) return 2; // FOMO Generator: mindig 2
        return 1; // Whale Magnet: mindig 1
    };

    useEffect(() => {
        // végigmegyünk azokon az upgrade-eken, amelyeknek van követelménye
        for (let id = 2; id <= 6; id++) {
            const req = upgrades.find(u => u.id === id - 1);
            if (!req) continue;
            const lvl = req.level;
            // csak akkor reset-eljük, ha új 5-ös többszörösre léptünk
            if (lvl >= 5 && lvl % 5 === 0) {
                const last = lastReqLevelRef.current[id];
                if (last !== lvl) {
                    setUsesLeft(prev => ({
                        ...prev,
                        [id]: (prev[id] ?? 0) + getNextLevelUses(id),
                    }));
                    lastReqLevelRef.current[id] = lvl;
                    // Hang lejátszása a használatok újratöltésekor
                    if (unlockSound) {
                        unlockSound.currentTime = 0;
                        unlockSound.play().catch(error => console.log('Audio playback failed:', error));
                    }
                }
            }
        }
    }, [upgrades, unlockSound]);

    // Új useEffect a használati számláló változásának figyelésére
    useEffect(() => {
        // Ha egy upgrade használatai 0-ról nagyobb értékre ugranak, játszuk le a hangot
        Object.entries(usesLeft).forEach(([id, uses]) => {
            if (uses > 0 && lastReqLevelRef.current[id] === null) {
                if (unlockSound) {
                    unlockSound.currentTime = 0;
                    unlockSound.play().catch(error => console.log('Audio playback failed:', error));
                }
                lastReqLevelRef.current[id] = upgrades.find(u => u.id === parseInt(id))?.level || 0;
            }
        });
    }, [usesLeft, unlockSound, upgrades]);

    const handleUpgradeClick = (u) => {
        // Diamond Hands esetén ne ellenőrizzük a használatokat
        if (u.id !== 1) {
            const currentUses = usesLeft[u.id] ?? 0;
            
            // Ha nincs több használat, akkor lezárjuk
            if (currentUses <= 0) {
                const req = upgrades.find(x => x.id === u.requirements?.upgradeId);
                setSelectedUpgrade({ upgrade: u, requiredUpgrade: req });
                // Töröljük a lastReqLevelRef-et, hogy újra lejátszódjon a hang
                lastReqLevelRef.current[u.id] = null;
                return;
            }

            // Ha nincs feloldva, akkor lezárjuk
            if (!isUnlocked(u)) {
                const req = upgrades.find(x => x.id === u.requirements?.upgradeId);
                setSelectedUpgrade({ upgrade: u, requiredUpgrade: req });
                // Töröljük a lastReqLevelRef-et, hogy újra lejátszódjon a hang
                lastReqLevelRef.current[u.id] = null;
                return;
            }
        }

        const cost = Math.floor(u.baseCost * priceMultiplier(u.id) ** u.level);
        if (marketCap >= cost) {
            buyUpgrade(u);
            // Csökkentjük a használatot (kivéve Diamond Hands)
            if (u.id !== 1) {
                setUsesLeft(prev => {
                    const newUses = {
                        ...prev,
                        [u.id]: (prev[u.id] ?? 0) - 1
                    };
                    // Ha elfogyott a használat, akkor lezárjuk az upgrade-et
                    if (newUses[u.id] <= 0) {
                        newUses[u.id] = 0;
                    }
                    return newUses;
                });
            }
        } else {
            setInsufficientFundsUpgrade({ upgrade: u, cost, marketCap });
        }
    };

    const handleCloseRequirementsModal = () => setSelectedUpgrade(null);

    const clickUpgrades = upgrades.filter(u => u.type === 'click');
    const passiveUpgrades = upgrades.filter(u => u.type === 'passive');
    const solPrice = lvl => (0.05 * Math.pow(1.5, lvl)).toFixed(2);
    const solMult = lvl => lvl + 1;

    return (
        <div className="bg-gray-800/50 rounded-2xl p-6 flex flex-col h-full">
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
            <div className="space-y-3 flex-grow overflow-y-auto">
                {(activeTab === 'click' ? clickUpgrades : passiveUpgrades).map(u => {
                    const cost = Math.floor(u.baseCost * priceMultiplier(u.id) ** u.level);
                    const locked = !isUnlocked(u);
                    const canBuy = isUnlocked(u) && marketCap >= cost;
                    const req = upgrades.find(r => r.id === u.requirements?.upgradeId);
                    const currentUses = usesLeft[u.id] ?? 0;
                    let maxUses = Infinity;
                    if (u.id !== 1 && req) {
                        // hány teljes 5-ös küszöb van meg?
                        const tiers = Math.floor(req.level / 5);
                        // összesen ennyi használatot kaptatok eddig
                        maxUses = tiers * getNextLevelUses(u.id);
                    }
                    // Requirement szintek kiszámítása
                    let reqDisplay = '';
                    if (u.id !== 1 && req) {
                        const currentReqLevel = req.level;
                        // A következő szint mindig az aktuális szint + 5, ha az aktuális szint 5-tel osztható
                        const nextUnlockLevel = currentReqLevel % 5 === 0 ? currentReqLevel + 5 : Math.ceil(currentReqLevel / 5) * 5;
                        reqDisplay = `Requires: ${req.name} (level ${currentReqLevel}/${nextUnlockLevel})`;
                    }

                    return (
                        <button
                            key={u.id}
                            onClick={() => handleUpgradeClick(u)}
                            disabled={!canBuy}
                            className={`w-full group transition-all duration-300 ${
                                locked ? 'opacity-50 cursor-not-allowed' : 
                                canBuy ? 'hover:scale-105' : 'opacity-70'
                            }`}
                        >
                            <div className={`bg-gray-800/50 rounded-xl p-4 border-2 ${
                                locked ? 'border-gray-700' : 
                                canBuy ? 'border-yellow-500/50 group-hover:border-yellow-500' : 'border-gray-600'
                            } transition-all duration-300`}>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="flex items-center text-lg font-bold">
                                            {locked ? (
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
                                            {u.type === 'click' ? ` (${u.power} MC/click)` : ` (${u.power} MC/sec)`}
                                        </p>
                                        {u.id !== 1 && (
                                            <p className="text-xs text-red-400">
                                                {locked ? reqDisplay : ''}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold text-xl ${
                                            locked ? 'text-gray-400' : 
                                            canBuy ? 'text-yellow-400' : 'text-gray-500'
                                        }`}>
                                            ${fmt(cost)}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            Level {u.level}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {u.id === 1 ? 'Unlimited uses' : `Uses: ${currentUses}/${maxUses}`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="mt-auto pt-4 border-t-2 border-white/10 text-center">
                <div className="flex justify-around">
                    <div>
                        <p className="text-gray-400 text-sm">MC / Click</p>
                        <p className="font-bold text-white text-lg">{fmt(clickPower)}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">MC / Second</p>
                        <p className={`font-bold text-lg transition-colors ${
                            hasPremiumUpgrade ? 'text-purple-400' : 'text-white'
                        }`}
                        >
                            {fmt(displayedPassiveIncome)}
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