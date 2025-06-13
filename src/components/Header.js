'use client';

import Link from 'next/link';
import Image from 'next/image';
import { pumpFunUrl } from '@/config';
import { useState, useEffect } from 'react';

const Header = () => {
  const [activeSection, setActiveSection] = useState('about');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleClick = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80; // Header magassága
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMenuOpen(false); // Menü bezárása kattintás után
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'tokenomics', 'roadmap', 'how-to-buy'];
      const scrollPosition = window.scrollY + 100;

      // Keressük meg a legközelebbi szekciót
      let closestSection = sections[0];
      let minDistance = Infinity;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          const distance = Math.abs(offsetTop - scrollPosition);
          
          if (distance < minDistance) {
            minDistance = distance;
            closestSection = section;
          }
        }
      }

      setActiveSection(closestSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItemClass = (sectionId) => `
    text-lg font-semibold px-6 py-2 rounded-full transition-all duration-300 relative group cursor-pointer
    ${activeSection === sectionId 
      ? 'bg-yellow-500 text-black' 
      : 'text-white hover:text-yellow-500'
    }
  `;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg text-white border-b border-yellow-500/20">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo és név */}
          <div className="flex items-center space-x-3">
            <div className="relative w-8 h-8 md:w-10 md:h-10">
              <Image
                src="/images/bull.png"
                alt="ALTSEASON Logo"
                fill
                className="object-contain"
                quality={100}
              />
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-wider text-yellow-500">
              ALTSEASON
            </h1>
          </div>

          {/* Mobil menü gomb */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            <div className="w-6 h-0.5 bg-yellow-500 mb-1.5"></div>
            <div className="w-6 h-0.5 bg-yellow-500 mb-1.5"></div>
            <div className="w-6 h-0.5 bg-yellow-500"></div>
          </button>

          {/* Navigáció */}
          <nav className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-center absolute md:relative top-20 md:top-0 left-0 right-0 bg-black/95 md:bg-transparent p-4 md:p-0 space-y-4 md:space-y-0`}>
            <a 
              href="#about" 
              onClick={(e) => handleClick(e, 'about')}
              className={menuItemClass('about')}
            >
              About
            </a>
            <div className="hidden md:block w-px h-6 bg-yellow-500/20 mx-2"></div>
            <a 
              href="#tokenomics" 
              onClick={(e) => handleClick(e, 'tokenomics')}
              className={menuItemClass('tokenomics')}
            >
              Launch Info
            </a>
            <div className="hidden md:block w-px h-6 bg-yellow-500/20 mx-2"></div>
            <a 
              href="#roadmap" 
              onClick={(e) => handleClick(e, 'roadmap')}
              className={menuItemClass('roadmap')}
            >
              Roadmap
            </a>
            <div className="hidden md:block w-px h-6 bg-yellow-500/20 mx-2"></div>
            <a 
              href="#how-to-buy" 
              onClick={(e) => handleClick(e, 'how-to-buy')}
              className={menuItemClass('how-to-buy')}
            >
              How To Buy
            </a>
          </nav>

          {/* Vásárlás gomb */}
          <a 
            href={pumpFunUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 md:py-2.5 md:px-6 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/30 text-sm md:text-base"
          >
            Buy on Pump.fun
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;