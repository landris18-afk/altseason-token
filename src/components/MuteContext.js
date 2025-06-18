"use client";

import React, { createContext, useContext, useState } from 'react';

const MuteContext = createContext();

export const MuteProvider = ({ children }) => {
  const [muted, setMuted] = useState(false);
  return (
    <MuteContext.Provider value={{ muted, setMuted }}>
      {children}
    </MuteContext.Provider>
  );
};

export const useMute = () => useContext(MuteContext); 