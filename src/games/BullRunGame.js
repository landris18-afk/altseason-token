"use client";

import BullRunGameWrapper from './components/containers/BullRunGameWrapper';
import { useBullRunGame } from './hooks/useBullRunGame';

/**
 * BullRunGame - Fő játék komponens
 * 
 * Ez a komponens a játék fő belépési pontja. Minden játék logika
 * a useBullRunGame hook-ban van, és a renderelés a BullRunGameWrapper
 * komponensben történik.
 * 
 * @returns {JSX.Element} A játék teljes UI-ja
 */
export default function BullRunGame() {
  // Master hook - minden game logika egy helyen
  const gameData = useBullRunGame();

  return <BullRunGameWrapper {...gameData} />;
}