/**
 * UpgradePropsAggregator.js - Upgrade props aggregátor komponens
 * 
 * Ez a komponens aggregálja az upgrade props-okat:
 * - Props csoportosítása
 * - Validáció
 * - Default értékek
 */

import React from 'react';

/**
 * UpgradePropsAggregator - Upgrade props aggregátor komponens
 * 
 * @param {Object} props - Props objektum
 * @param {Array} props.upgrades - Upgrade lista
 * @param {number} props.marketCap - Market Cap érték
 * @param {Function} props.buyUpgrade - Upgrade vásárlás
 * @param {number} props.clickPower - Click power
 * @param {number} props.passiveIncome - Passzív jövedelem
 * @param {boolean} props.hasPremiumUpgrade - Premium upgrade flag
 * @param {Audio} props.unlockSound - Unlock hang
 * @param {Object} props.usesLeft - Maradék használatok
 * @param {Function} props.children - Gyerek komponens renderelő
 * @returns {JSX.Element} Aggregált props-okkal renderelt gyerek komponens
 */
const UpgradePropsAggregator = ({
  upgrades,
  marketCap,
  buyUpgrade,
  clickPower,
  passiveIncome,
  hasPremiumUpgrade,
  unlockSound,
  usesLeft,
  children
}) => {
  // Props validáció
  if (!upgrades || !Array.isArray(upgrades)) {
    console.warn('UpgradePropsAggregator: upgrades prop is missing or invalid');
    return null;
  }

  if (typeof marketCap !== 'number') {
    console.warn('UpgradePropsAggregator: marketCap prop is missing or invalid');
    return null;
  }

  if (typeof buyUpgrade !== 'function') {
    console.warn('UpgradePropsAggregator: buyUpgrade prop is missing or invalid');
    return null;
  }

  // Aggregált props objektum
  const aggregatedProps = {
    upgrades,
    marketCap,
    buyUpgrade,
    clickPower: clickPower || 1,
    passiveIncome: passiveIncome || 0,
    hasPremiumUpgrade: hasPremiumUpgrade || false,
    unlockSound,
    usesLeft: usesLeft || {}
  };

  // Gyerek komponens renderelése aggregált props-okkal
  return children(aggregatedProps);
};

export default UpgradePropsAggregator;
