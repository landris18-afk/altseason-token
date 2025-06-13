'use client';

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-yellow-500/20">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-yellow-500 mb-4">ALTSEASON 2025</h3>
          <p className="text-gray-400 mb-6">Join the movement. The bull is unstoppable.</p>
          
          <div className="flex justify-center space-x-6 mb-8">
            <a href="https://x.com/your_profile" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-500 transition-colors">
              X / Twitter
            </a>
            <a href="https://t.me/your_telegram" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-500 transition-colors">
              Telegram
            </a>
            <a href="https://discord.com/your_server" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-500 transition-colors">
              Discord
            </a>
          </div>

          <div className="border-t border-yellow-500/20 pt-6">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Altseason Token. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-2 max-w-2xl mx-auto">
              Disclaimer: $BULL is a meme token with no intrinsic value or expectation of financial return. It is for entertainment purposes only. Always do your own research.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 