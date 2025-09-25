/**
 * UpgradeContainer.js - Upgrade panel container komponens
 * 
 * Ez a komponens az upgrade panel teljes struktúráját kezeli:
 * - Header
 * - Tabs
 * - Lista
 * - Footer
 * - Modals
 */

import React from 'react';
import UpgradeHeader from './UpgradeHeader';
import UpgradeTabs from './UpgradeTabs';
import UpgradeList from './UpgradeList';
import UpgradeFooter from './UpgradeFooter';
import UpgradeModals from './UpgradeModals';
import { getNextLevelUses } from '../../utils/gameUtils';

/**
 * UpgradeContainer - Upgrade panel container komponens
 * 
 * @param {Object} props - Props objektum
 * @param {Array} props.upgrades - Upgrade lista
 * @param {number} props.marketCap - Market Cap érték
 * @param {Function} props.buyUpgrade - Upgrade vásárlás
 * @param {number} props.clickPower - Click power
 * @param {number} props.passiveIncome - Passzív jövedelem
 * @param {boolean} props.hasPremiumUpgrade - Premium upgrade flag
 * @param {Object} props.usesLeft - Maradék használatok
 * @param {Object} props.panelState - Panel állapot
 * @param {Function} props.onUpgradeClick - Upgrade kattintás kezelő
 * @param {Function} props.onCloseInsufficientFunds - Insufficient funds modal bezárása
 * @returns {JSX.Element} Container komponens
 */
const UpgradeContainer = ({
  upgrades,
  marketCap,
  buyUpgrade,
  clickPower,
  passiveIncome,
  hasPremiumUpgrade,
  usesLeft,
  panelState,
  onUpgradeClick,
  onCloseInsufficientFunds,
  onBackToLeaderboard
}) => {
  const {
    insufficientFundsUpgrade,
    activeTab,
    forceUpdate,
    setActiveTab
  } = panelState;

  return (
    <div className="bg-gray-800/50 md:rounded-2xl md:p-4 px-4 pt-2 flex flex-col h-full md:pt-4 md:overflow-y-auto overflow-hidden" key={forceUpdate}>
      {/* Header */}
      <UpgradeHeader onBackToLeaderboard={onBackToLeaderboard} />

      {/* Tab gombok */}
      <UpgradeTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        upgrades={upgrades}
        usesLeft={usesLeft}
        marketCap={marketCap}
      />

      {/* Upgrade lista - külön box */}
      <div className="flex-1 overflow-y-auto md:max-h-72 upgrade-scroll md:pb-0 pb-20 scrollbar-hide" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(234, 179, 8, 0.7) rgba(31, 41, 55, 0.5)'
      }}>
        <UpgradeList
          upgrades={upgrades}
          activeTab={activeTab}
          usesLeft={usesLeft}
          marketCap={marketCap}
          onUpgradeClick={onUpgradeClick}
          getNextLevelUses={getNextLevelUses}
        />
      </div>

      {/* Footer - mobilnézetben fix alul */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm border-t border-yellow-400/30 z-20">
        <UpgradeFooter
          clickPower={clickPower}
          passiveIncome={passiveIncome}
          hasPremiumUpgrade={hasPremiumUpgrade}
          marketCap={marketCap}
        />
      </div>
      
      {/* Footer - asztali nézetben külön box */}
      <div className="hidden md:block mb-4 mt-2">
        <div className="h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent mb-2"></div>
        <div className="bg-gray-800/30 rounded-lg p-2">
          <div className="flex justify-around gap-2">
            <div className="flex-1 text-center">
              <p className="text-gray-400 text-xs">MC / Click</p>
              <p className="font-bold text-white text-base">
                ${clickPower?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-gray-400 text-xs">MC / Second</p>
              <p className={`font-bold text-base ${
                hasPremiumUpgrade ? 'text-purple-400' : 'text-white'
              }`}>
                ${(hasPremiumUpgrade ? passiveIncome * 10 : passiveIncome)?.toLocaleString() || '0'}
              </p>
            </div>
          </div>
        </div>
      </div>
      

      {/* Modals */}
      <UpgradeModals
        insufficientFundsUpgrade={insufficientFundsUpgrade}
        marketCap={marketCap}
        onCloseInsufficientFunds={onCloseInsufficientFunds}
      />
    </div>
  );
};

export default UpgradeContainer;
