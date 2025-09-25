// src/components/About.js
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const About = () => {
    // A GIF újraindító logikát eltávolítottuk, mert a Next.js Image komponenssel nem működik, 
    // és az `unoptimized` prop a helyes megközelítés a GIF-ekhez.

    return (
        <section id="about-section" className="relative pt-0 pb-4 md:pt-0 md:pb-0 h-auto md:h-[calc(100vh-5rem)] overflow-y-auto flex items-center justify-center px-4 md:px-8 lg:px-16">
            {/* Content */}
            <div className="relative z-10 flex flex-col-reverse md:flex-row items-center justify-between gap-8 max-w-7xl mx-auto">
                {/* Text Content */}
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-4 text-yellow-500">
                        ALTSEASON 2025
                    </h1>
                    {/* JAVÍTVA: Az összes aposztróf ki lett cserélve a biztonságos &apos;-ra */}
                    <p className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-6 text-gray-300 text-justify">
                        Altseason Bull 2025 is the ultimate meme token for the crypto community that&apos;s eagerly awaiting the next altseason. With a bullish symbol and the playful ticker &apos;$ASSBULL&apos;, we&apos;re creating a space where excitement, humor, and crypto culture come together to celebrate the upcoming market surge.
                    </p>
                    <Link 
                        href="https://pump.fun/token/altseason" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-yellow-500 text-black font-bold py-4 px-8 rounded-lg text-lg md:text-xl hover:bg-yellow-400 transition-colors duration-300 mb-8"
                    >
                        Buy Now
                    </Link>
                </div>

                {/* Bull Image */}
                <div className="flex-1 flex justify-center w-full">
                    <div className="relative w-full aspect-square max-w-[400px] md:max-w-[400px] lg:max-w-[500px]">
                        <Image
                            src="/images/bullgif.gif"
                            alt="Bull"
                            fill
                            className="object-contain"
                            priority
                            quality={100}
                            unoptimized={true} // A GIF animációkhoz ez a javasolt beállítás
                            sizes="(max-width: 768px) 400px, (max-width: 1024px) 400px, 500px"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
