import React from 'react';

/**
 * GameHeader - Játék fejléc komponens
 * 
 * Ez a komponens megjeleníti a játék fő címét és leírását:
 * - Játék neve
 * - Motto/leírás
 * - Reszponzív design
 * 
 * @returns {JSX.Element} Játék fejléc komponens
 */
const GameHeader = () => {
  return (
    <div className="text-center mb-12">
      <h2 className="text-4xl md:text-5xl font-bold mb-4">Bull Run Clicker</h2>
      <p className="text-lg text-gray-400">How high can you pump the market cap?</p>
    </div>
  );
};

export default GameHeader;

