'use client';

import React from 'react';

const LaunchInfo = () => {
  const launchData = [
    { title: "Platform", value: "Pump.fun" },
    { title: "Launch Type", value: "Fair Launch" },
    { title: "Mechanism", value: "Bonding Curve" },
    { title: "Goal", value: "Reach Raydium LP" },
    { title: "Taxes", value: "0% Buy / 0% Sell" },
    { title: "Safety", value: "LP 100% Burned" },
  ];

  return (
    <section id="tokenomics" className="py-20 bg-gray-800/50 text-white relative overflow-hidden">
      {/* Opcionális háttér grafika */}
      <div className="absolute -bottom-1/2 -left-1/4 w-full h-full bg-[url('/images/abstract-background.svg')] bg-no-repeat opacity-5"></div>
      
      <div className="container mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Launch Info</h2>
        <p className="text-lg text-yellow-400 mb-12">Fair launch for everyone. No presale, no team tokens.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {launchData.map((item, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 transform transition-transform duration-300 hover:-translate-y-2">
              <h3 className="text-yellow-400 text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LaunchInfo; 