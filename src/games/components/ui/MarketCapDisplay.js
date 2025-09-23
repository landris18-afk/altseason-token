import React from 'react';
import { fmt } from '../../utils/gameUtils';

/**
 * MarketCapDisplay - Market Cap megjelenítő komponens
 * 
 * Ez a komponens megjeleníti a játék Market Cap értékét:
 * - Fő Market Cap érték formázva
 * - Sub-thousand akkumulátor megjelenítése
 * - Desktop és mobile nézetek
 * - Reszponzív formázás
 * 
 * @param {Object} props - Props objektum
 * @param {number} props.marketCap - Market Cap érték
 * @param {number} props.subThousandAccumulator - Sub-thousand akkumulátor
 * @param {boolean} props.isDesktop - Desktop nézet flag
 * @returns {JSX.Element} Market Cap megjelenítő komponens
 */
const MarketCapDisplay = ({ 
  marketCap, 
  subThousandAccumulator, 
  isDesktop 
}) => {
  // A fő számláló csak a marketCap értéket mutatja
  // A második számláló mutatja a subThousandAccumulator-t

  // Market Cap formázása
  const formatMarketCap = (value) => {
    if (value >= 1e12) {
      return `${(value / 1e12).toFixed(1)}T`;
    } else if (value >= 1e9) {
      return `${(value / 1e9).toFixed(1)}B`;
    } else if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1)}M`;
    } else if (value >= 1e4) {
      return `${Math.floor(value / 1e3)}K`;
    } else {
      return fmt(value);
    }
  };

  // Sub-accumulator megjelenítése
  const renderSubAccumulator = () => {
    if (isDesktop) {
      // Desktop nézet: 10K felett jelenik meg a második számláló
      if (marketCap >= 1e12) {
        return (
          <p className="text-3xl font-mono font-bold text-white">
            +${fmt(Math.min(subThousandAccumulator, 99999999))}
          </p>
        );
      } else if (marketCap >= 1e9) {
        return (
          <p className="text-3xl font-mono font-bold text-white">
            +${fmt(subThousandAccumulator)}
          </p>
        );
      } else if (marketCap >= 1e6) {
        return (
          <p className="text-3xl font-mono font-bold text-white">
            +${fmt(subThousandAccumulator)}
          </p>
        );
      } else if (marketCap >= 1e4) {
        return (
          <p className="text-3xl font-mono font-bold text-white">
            +${fmt(subThousandAccumulator)}
          </p>
        );
      }
    } else {
      // Mobile nézet: 10K felett jelenik meg a második számláló
      if (marketCap >= 1e12) {
        return (
          <p className="text-4xl font-mono font-bold text-white">
            +${fmt(Math.min(subThousandAccumulator, 99999999))}
          </p>
        );
      } else if (marketCap >= 1e9) {
        return (
          <p className="text-4xl font-mono font-bold text-white">
            +${fmt(subThousandAccumulator)}
          </p>
        );
      } else if (marketCap >= 1e8) {
        return (
          <p className="text-4xl font-mono font-bold text-white">
            +${fmt(subThousandAccumulator)}
          </p>
        );
      } else if (marketCap >= 1e6) {
        return (
          <p className="text-4xl font-mono font-bold text-white">
            +${fmt(subThousandAccumulator)}
          </p>
        );
      } else if (marketCap >= 1e4) {
        return (
          <p className="text-4xl font-mono font-bold text-white">
            +${fmt(subThousandAccumulator)}
          </p>
        );
      }
    }
    return null;
  };

  // Ellenőrizzük, hogy van-e második számláló
  const hasSecondaryCounter = renderSubAccumulator() !== null;

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
        <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
          $ASS
        </span>
        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          {' '}Market Cap
        </span>
      </h3>
      
      {/* Mobile nézet - fix magasságú konténer */}
      <div className="md:hidden flex flex-col items-center h-40 justify-center">
        {hasSecondaryCounter ? (
          // Ha van második számláló, a fő számláló felül van
          <>
            <p className="text-7xl font-mono font-bold my-3 text-white drop-shadow-lg">
              ${formatMarketCap(marketCap)}
            </p>
            {renderSubAccumulator()}
          </>
        ) : (
          // Ha nincs második számláló, a fő számláló középen van
          <p className="text-8xl font-mono font-bold my-2 text-white drop-shadow-lg">
            ${formatMarketCap(marketCap)}
          </p>
        )}
      </div>

      {/* Desktop nézet - fix magasságú konténer */}
      <div className="hidden md:flex flex-col items-center h-40 justify-center">
        {hasSecondaryCounter ? (
          // Ha van második számláló, a fő számláló felül van
          <>
            <p className="text-7xl font-mono font-bold my-3 text-white drop-shadow-lg">
              ${formatMarketCap(marketCap)}
            </p>
            {renderSubAccumulator()}
          </>
        ) : (
          // Ha nincs második számláló, a fő számláló középen van
          <p className={`${
            marketCap < 1e8 ? 'text-8xl' : 'text-6xl'
          } font-mono font-bold my-2 text-white drop-shadow-lg`}>
            ${formatMarketCap(marketCap)}
          </p>
        )}
      </div>
    </div>
  );
};

export default MarketCapDisplay;

