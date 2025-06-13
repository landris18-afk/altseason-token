'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { pumpFunUrl } from '@/config';
import SectionDivider from './SectionDivider';

const About = () => {
    return (
        <section id="about-section" className="relative min-h-screen flex items-center justify-center py-12 md:py-20 px-4 md:px-8 lg:px-16 bg-black">
            {/* Content */}
            <div className="relative z-10 flex flex-col-reverse md:flex-row items-center justify-between gap-12 max-w-7xl mx-auto">
                {/* Text Content */}
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-yellow-500">
                        ALTSEASON
                    </h1>
                    <p className="text-lg md:text-xl lg:text-2xl mb-8 text-gray-300">
                        The first token that pays you to hold during altseason. 
                        Join the revolution and earn rewards while the market grows.
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
                            src="/images/bull.png"
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