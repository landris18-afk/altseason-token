'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { pumpFunUrl } from '@/config';
import SectionDivider from './SectionDivider';

const About = () => {
    const imageRef = useRef(null);

    useEffect(() => {
        const reloadGif = () => {
            if (imageRef.current) {
                const img = imageRef.current;
                img.src = img.src;
            }
        };

        const interval = setInterval(reloadGif, 8000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section id="about-section" className="relative min-h-screen flex items-center justify-center py-12 md:py-20 px-4 md:px-8 lg:px-16 bg-black">
            {/* Content */}
            <div className="relative z-10 flex flex-col-reverse md:flex-row items-center justify-between gap-12 max-w-7xl mx-auto">
                {/* Text Content */}
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-yellow-500">
                        ALTSEASON 2025
                    </h1>
                    <p className="text-lg md:text-xl lg:text-2xl mb-8 text-gray-300">
                    Altseason Bull 2025 is the ultimate meme token for the crypto community that’s eagerly awaiting the next altseason. With a bullish symbol and the playful ticker '$ASSBULL', we’re creating a space where excitement, humor, and crypto culture come together to celebrate the upcoming market surge
                    </p>
                    <Link 
                        href="https://pump.fun/token/altseason" 
                        target="_blank"
                        className="inline-block bg-yellow-500 text-black font-bold py-4 px-8 rounded-lg text-lg md:text-xl hover:bg-yellow-400 transition-colors duration-300"
                    >
                        Buy Now
                    </Link>
                </div>

                {/* Bull Image */}
                <div className="flex-1 flex justify-center w-full">
                    <div className="relative w-full aspect-square max-w-[400px] md:max-w-[400px] lg:max-w-[500px]">
                        <Image
                            ref={imageRef}
                            src="/images/bullgif.gif"
                            alt="Bull"
                            fill
                            className="object-contain"
                            priority
                            quality={100}
                            sizes="(max-width: 768px) 400px, (max-width: 1024px) 400px, 500px"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About; 