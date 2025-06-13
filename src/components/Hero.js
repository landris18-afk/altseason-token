'use client';

import React from 'react';
import Image from 'next/image';
import { pumpFunUrl } from '@/config';

const Hero = () => {
  return (
    <section id="hero" className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
      {/* HÁTTÉR: Ide jöhet a bika videó vagy animáció */}
      <div className="absolute top-0 left-0 w-full h-full bg-black z-0">
        {/* Háttérkép */}
        <Image
          src="/images/hero-background.jpg"
          alt="Hero Background"
          fill
          priority
          className="object-cover"
          quality={100}
        />
        {/* Opcionális: Finom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
      </div>

      {/* TARTALOM */}
      <div className="relative z-10 p-4">
        <h2 className="text-5xl md:text-8xl lg:text-9xl font-extrabold uppercase tracking-widest">
          <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 bg-clip-text text-transparent">
            Unleash
          </span>
        </h2>
        <h3 className="text-4xl md:text-7xl font-bold mt-2 md:mt-4">
          The 2025 Altseason
        </h3>
        <p className="max-w-2xl mx-auto mt-6 text-lg md:text-xl text-gray-300">
          Live on Pump.fun! The Bull is here.
        </p>
        <div className="mt-10">
          <a 
            href={pumpFunUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-10 rounded-full text-xl transition-transform duration-300 hover:scale-105 animate-pulse"
          >
            BUY NOW
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero; 