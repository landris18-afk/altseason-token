'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { pumpFunUrl } from '@/config';
import { FaVolumeUp, FaVolumeMute, FaTwitter } from 'react-icons/fa';
import { useMute } from '../games/components/context/MuteContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { muted, setMuted } = useMute();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '-100px 0px 0px 0px'
      }
    );

    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      observer.observe(aboutSection);
    }

    return () => {
      if (aboutSection) {
        observer.unobserve(aboutSection);
      }
    };
  }, [isMobile]);

  const handleClick = (e, sectionId) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId === 'about' ? 'about-section' : sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: 'about', elementId: 'about-section' },
        { id: 'tokenomics', elementId: 'tokenomics' },
        { id: 'game', elementId: 'game' },
        { id: 'roadmap', elementId: 'roadmap' },
        { id: 'how-to-buy', elementId: 'how-to-buy' }
      ];
      const scrollPosition = window.scrollY + 100;
      let closestSection = sections[0].id;
      let minDistance = Infinity;
      for (const section of sections) {
        const element = document.getElementById(section.elementId);
        if (element) {
          const { offsetTop } = element;
          const distance = Math.abs(offsetTop - scrollPosition);
          if (distance < minDistance) {
            minDistance = distance;
            closestSection = section.id;
          }
        }
      }
      setActiveSection(closestSection);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItemClass = (sectionId) =>
    `text-lg font-semibold px-6 py-6 transition-all duration-300 relative group cursor-pointer text-center whitespace-nowrap ${
      activeSection === sectionId ? 'bg-yellow-500 text-black -mt-1 -mb-1' : 'text-white hover:bg-yellow-500 hover:text-black'
    }`;

  const gameMenuItemClass = (sectionId) =>
    `text-lg font-semibold px-6 py-6 transition-all duration-300 relative group cursor-pointer text-center whitespace-nowrap ${
      activeSection === sectionId 
        ? 'bg-yellow-500 text-black hover:bg-yellow-600 -mt-1 -mb-1' 
        : 'text-white hover:bg-yellow-500 hover:text-black'
    }`;

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (isMobile && !isVisible) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-black/20 backdrop-blur-lg text-white border-b border-yellow-500/20 transition-all duration-500 h-20">
      <div className="max-w-7xl mx-auto px-6 h-full">
        <div className="flex items-center justify-between h-full relative md:hidden">
          {/* Hamburger ikon + X logó mobilon */}
          <div className="flex items-center">
            <button
              onClick={handleMenuToggle}
              className="p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-0.5 bg-yellow-500 mb-1.5"></div>
              <div className="w-6 h-0.5 bg-yellow-500 mb-1.5"></div>
              <div className="w-6 h-0.5 bg-yellow-500"></div>
            </button>
          </div>
          {/* Buy gomb mobilon jobbra */}
          <a
            href={pumpFunUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] hover:from-[#2a2a2a] hover:to-[#3a3a3a] text-white font-medium py-2.5 px-5 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/20 text-sm flex items-center gap-2.5 border-2 border-[#FFD700]"
          >
            <div className="relative w-5 h-5">
              <Image
                src="/images/pumpfunlogo.webp"
                alt="Pump.fun Logo"
                fill
                className="object-contain"
                quality={100}
              />
            </div>
            Buy on Pump.fun
          </a>
        </div>
        {/* Asztali: eredeti fejléc */}
        <div className="hidden md:flex items-center justify-between h-full relative">
          {/* Menü - desktop */}
          <nav className="flex flex-row items-center space-x-0">
            <a
              href="#about"
              onClick={(e) => handleClick(e, 'about')}
              className={menuItemClass('about')}
            >
              $ASSBULL
            </a>
            <a
              href="#tokenomics"
              onClick={(e) => handleClick(e, 'tokenomics')}
              className={menuItemClass('tokenomics')}
            >
              Launch Info
            </a>
            <a
              href="#game"
              onClick={(e) => handleClick(e, 'game')}
              className={gameMenuItemClass('game')}
            >
              Bull Run Clicker
            </a>
            <a
              href="#roadmap"
              onClick={(e) => handleClick(e, 'roadmap')}
              className={menuItemClass('roadmap')}
            >
              Roadmap
            </a>
            <a
              href="#how-to-buy"
              onClick={(e) => handleClick(e, 'how-to-buy')}
              className={menuItemClass('how-to-buy')}
            >
              How To Buy
            </a>
          </nav>
          
          {/* Kövess minket X-en - desktop */}
          <div className="flex items-center gap-4">
            <a
              href="https://twitter.com/assbull2025"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-yellow-400 font-medium py-2.5 px-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2.5 text-sm border border-transparent hover:border-yellow-500/30"
            >
              <span className="text-lg font-bold">X</span>
              <span>Follow</span>
            </a>
          </div>
          
          {/* Buy gomb - desktop */}
          <a
            href={pumpFunUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] hover:from-[#2a2a2a] hover:to-[#3a3a3a] text-white font-medium py-2.5 px-5 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/20 text-sm flex items-center gap-2.5 border-2 border-[#FFD700]"
          >
            <div className="relative w-5 h-5">
              <Image
                src="/images/pumpfunlogo.webp"
                alt="Pump.fun Logo"
                fill
                className="object-contain"
                quality={100}
              />
            </div>
            Buy on Pump.fun
          </a>
        </div>
      </div>
      {/* Mobil lenyíló menü - modern dizájn */}
      {isMenuOpen && (
        <div className="absolute left-0 right-0 top-full z-50 bg-black/90 backdrop-blur-md border-t border-yellow-500/20">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <nav className="space-y-2">
              {/* $ASSBULL */}
              <a
                href="#about"
                onClick={(e) => handleClick(e, 'about')}
                className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeSection === 'about' 
                    ? 'bg-yellow-500 text-black font-bold' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <span className="text-lg">$ASSBULL</span>
              </a>

              {/* Launch Info */}
              <a
                href="#tokenomics"
                onClick={(e) => handleClick(e, 'tokenomics')}
                className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeSection === 'tokenomics' 
                    ? 'bg-yellow-500 text-black font-bold' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <span className="text-lg">Launch Info</span>
              </a>

              {/* Bull Run Clicker */}
              <a
                href="#game"
                onClick={(e) => handleClick(e, 'game')}
                className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeSection === 'game' 
                    ? 'bg-yellow-500 text-black font-bold' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <span className="text-lg">Bull Run Clicker</span>
              </a>

              {/* Roadmap */}
              <a
                href="#roadmap"
                onClick={(e) => handleClick(e, 'roadmap')}
                className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeSection === 'roadmap' 
                    ? 'bg-yellow-500 text-black font-bold' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <span className="text-lg">Roadmap</span>
              </a>

              {/* How To Buy */}
              <a
                href="#how-to-buy"
                onClick={(e) => handleClick(e, 'how-to-buy')}
                className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeSection === 'how-to-buy' 
                    ? 'bg-yellow-500 text-black font-bold' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <span className="text-lg">How To Buy</span>
              </a>

              {/* Divider */}
              <div className="h-px bg-yellow-500/30 my-3"></div>

              {/* Follow us on X */}
              <a
                href="https://twitter.com/assbull2025"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-3 rounded-lg transition-all duration-200 text-white hover:bg-white/10"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">X</span>
                  <span className="text-lg">Follow us</span>
                </div>
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;