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
    <div className="bg-gray-800/50 md:rounded-2xl md:p-6 p-4 flex flex-col h-full md:pt-6 pt-24" key={forceUpdate}>
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
