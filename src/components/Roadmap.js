'use client';

import React from 'react';

const Roadmap = () => {
  const phases = [
    {
      title: "Phase 1: Launch",
      items: [
        "Fair launch on Pump.fun",
        "Community building",
        "Social media presence",
        "Website launch"
      ]
    },
    {
      title: "Phase 2: Growth",
      items: [
        "Marketing campaign",
        "Community events",
        "Partnership announcements",
        "Exchange listings"
      ]
    },
    {
      title: "Phase 3: Expansion",
      items: [
        "Major exchange listings",
        "Ecosystem development",
        "New features",
        "Global expansion"
      ]
    }
  ];

  return (
    <section id="roadmap" className="py-20 text-white relative overflow-hidden">
      {/* Finom overlay a szöveg olvashatóságához */}
      <div className="absolute inset-0 bg-black/5"></div>
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Roadmap</h2>
        <p className="text-lg text-yellow-400 text-center mb-12">Our journey to success</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {phases.map((phase, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 transform transition-transform duration-300 hover:-translate-y-2">
              <h3 className="text-yellow-400 text-2xl font-bold mb-6">{phase.title}</h3>
              <ul className="space-y-4">
                {phase.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Roadmap; 