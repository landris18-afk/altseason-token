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
  onCloseInsufficientFunds
}) => {
  const {
    insufficientFundsUpgrade,
    activeTab,
    forceUpdate,
    setActiveTab
  } = panelState;

  return (
    <div className="bg-gray-800/50 md:rounded-2xl md:p-4 p-4 flex flex-col h-full md:pt-4 pt-2 md:overflow-hidden overflow-y-auto" key={forceUpdate}>
      {/* Header */}
      <UpgradeHeader />

      {/* Tab gombok */}
      <UpgradeTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        upgrades={upgrades}
        usesLeft={usesLeft}
        marketCap={marketCap}
      />

      {/* Upgrade lista */}
      <UpgradeList
        upgrades={upgrades}
        activeTab={activeTab}
        usesLeft={usesLeft}
        marketCap={marketCap}
        onUpgradeClick={onUpgradeClick}
        getNextLevelUses={getNextLevelUses}
      />

      {/* Footer */}
      <UpgradeFooter
        clickPower={clickPower}
        passiveIncome={passiveIncome}
        hasPremiumUpgrade={hasPremiumUpgrade}
      />

      {/* Mobile fixed bottom stats */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700/50 p-4 z-50">
        <div className="flex justify-center items-center gap-8">
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">MC / Click</div>
            <div className="text-lg font-bold text-yellow-400">${clickPower.toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">MC / Second</div>
            <div className="text-lg font-bold text-purple-400">${passiveIncome.toLocaleString()}</div>
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
