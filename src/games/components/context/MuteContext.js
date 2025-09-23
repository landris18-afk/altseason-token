"use client";

import React, { createContext, useContext, useState } from 'react';

/**
 * MuteContext - Némítás kontextus
 * 
 * Ez a kontextus kezeli a játék hang némítását:
 * - Globális némítás állapot
 * - Némítás váltó funkció
 * - Context provider és hook
 */

const MuteContext = createContext();

/**
 * MuteProvider - Némítás provider komponens
 * 
 * @param {Object} props - Props objektum
 * @param {React.ReactNode} props.children - Gyerek komponensek
 * @returns {JSX.Element} Context provider
 */
export const MuteProvider = ({ children }) => {
  const [muted, setMuted] = useState(false);
  
  return (
    <MuteContext.Provider value={{ muted, setMuted }}>
      {children}
    </MuteContext.Provider>
  );
};

/**
 * useMute - Némítás hook
 * 
 * @returns {Object} Némítás állapot és kezelő funkciók
 */
export const useMute = () => useContext(MuteContext); 