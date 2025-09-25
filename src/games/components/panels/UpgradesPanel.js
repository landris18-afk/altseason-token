import React from 'react';
import UpgradeContainer from '../upgrades/UpgradeContainer';
import UpgradePropsAggregator from '../upgrades/UpgradePropsAggregator';
import UpgradeHookAggregator from '../upgrades/UpgradeHookAggregator';

/**
 * UpgradesPanel - Minimális upgrade panel komponens
 * 
 * Ez a komponens a legminimálisabb lehetséges wrapper:
 * - Csak props átadás
 * - Aggregátor komponensek használata
 * - Tiszta separation of concerns
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
 * @param {Function} props.onBackToLeaderboard - Vissza a ranglistához függvény
 * @returns {JSX.Element} Minimális upgrade panel komponens
 */
const UpgradesPanel = (props) => {
  return (
    <div className="w-full h-full">
      <UpgradePropsAggregator {...props}>
        {(aggregatedProps) => (
          <UpgradeHookAggregator
            upgrades={aggregatedProps.upgrades}
            marketCap={aggregatedProps.marketCap}
            buyUpgrade={aggregatedProps.buyUpgrade}
            usesLeft={aggregatedProps.usesLeft}
          >
            {(panelState, hookFunctions) => (
              <UpgradeContainer
                {...aggregatedProps}
                panelState={panelState}
                {...hookFunctions}
              />
            )}
          </UpgradeHookAggregator>
        )}
      </UpgradePropsAggregator>
    </div>
  );
};

export default UpgradesPanel;