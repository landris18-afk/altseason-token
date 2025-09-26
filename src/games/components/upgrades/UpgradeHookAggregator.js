/**
 * UpgradeHookAggregator.js - Upgrade hook aggregátor komponens
 * 
 * Ez a komponens aggregálja az upgrade hook-okat:
 * - Hook állapot kezelés
 * - Hook funkciók csoportosítása
 * - Állapot validáció
 */

import React from 'react';
import { useUpgradePanel } from '../../hooks/useUpgradePanel';

/**
 * UpgradeHookAggregator - Upgrade hook aggregátor komponens
 * 
 * @param {Object} props - Props objektum
 * @param {Array} props.upgrades - Upgrade lista
 * @param {number} props.marketCap - Market Cap érték
 * @param {Function} props.buyUpgrade - Upgrade vásárlás
 * @param {Object} props.usesLeft - Maradék használatok
 * @param {number} props.subThousandAccumulator - Sub-thousand akkumulátor
 * @param {Function} props.children - Gyerek komponens renderelő
 * @returns {JSX.Element} Hook állapottal renderelt gyerek komponens
 */
const UpgradeHookAggregator = ({
  upgrades,
  marketCap,
  buyUpgrade,
  usesLeft,
  subThousandAccumulator = 0,
  children
}) => {
  // Hook használata
  const panelState = useUpgradePanel(upgrades, marketCap, buyUpgrade, usesLeft, subThousandAccumulator);

  // Hook állapot validáció
  if (!panelState) {
    console.warn('UpgradeHookAggregator: panelState is null or undefined');
    return null;
  }

  // Hook funkciók csoportosítása
  const hookFunctions = {
    onUpgradeClick: panelState.handleUpgradeClick,
    onCloseRequirements: panelState.handleCloseRequirementsModal,
    onCloseInsufficientFunds: panelState.handleCloseInsufficientFundsModal
  };

  // Gyerek komponens renderelése hook állapottal és funkciókkal
  return children(panelState, hookFunctions);
};

export default UpgradeHookAggregator;
