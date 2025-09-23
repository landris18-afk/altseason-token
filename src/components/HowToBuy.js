'use client';

import React from 'react';
import { pumpFunUrl } from '@/config';

const HowToBuy = () => {
    return (
        <section id="how-to-buy" className="py-20 bg-gray-900 text-white">
            <div className="container mx-auto px-6 lg:px-8 text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">The Only Way To Buy</h2>
                <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
                    To ensure fairness and safety, $ASSBULL is launching exclusively on Pump.fun. Click the button below to go to the official page.
                </p>
                
                <a
                    href={pumpFunUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-10 rounded-full text-xl transition-transform duration-300 hover:scale-105"
                >
                    Go to Pump.fun
                </a>
                <div className="mt-8 border-2 border-red-500/50 rounded-lg p-4 max-w-2xl mx-auto">
                    <h3 className="text-red-500 font-bold text-lg">WARNING!</h3>
                    <p className="text-gray-300">Always double-check that you are on the correct pump.fun URL. Do not buy from any other links.</p>
                </div>
            </div>
        </section>
    );
};

export default HowToBuy; 