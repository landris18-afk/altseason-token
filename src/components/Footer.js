'use client';

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-yellow-500/20">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Altseason Token. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-2 max-w-2xl mx-auto">
            Disclaimer: $altseason is a meme token with no intrinsic value or expectation of financial return. It is for entertainment purposes only. Always do your own research.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 