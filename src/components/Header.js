'use client';

import Link from 'next/link';
import Image from 'next/image';
import { pumpFunUrl } from '@/config';
import { useState, useEffect } from 'react';

const Header = () => {
  const [activeSection, setActiveSection] = useState('about');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
    const element = document.getElementById(sectionId === 'about' ? 'about-section' : sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: 'about', elementId: 'about-section' },
        { id: 'tokenomics', elementId: 'tokenomics' },
        { id: 'roadmap', elementId: 'roadmap' },
        { id: 'how-to-buy', elementId: 'how-to-buy' }
      ];
      const scrollPosition = window.scrollY + 100;

      let closestSection = sections[0].id;
      let minDistance = Infinity;

      for (const section of sections) {
        const element = document.getElementById(section.elementId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
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

  const menuItemClass = (sectionId) => `
    text-lg font-semibold px-6 py-2 rounded-full transition-all duration-300 relative group cursor-pointer
    ${activeSection === sectionId 
      ? 'bg-yellow-500 text-black' 
      : 'text-white hover:text-yellow-500'
    }
  `;

  if (isMobile && !isVisible) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-black/80 backdrop-blur-lg text-white border-b border-yellow-500/20 transition-all duration-500 h-20">
      <div className="container mx-auto px-6 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo és név - csak asztali nézetben */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="relative w-10 h-10">
              <Image
                src="/images/bull.png"
                alt="ALTSEASON Logo"
                fill
                className="object-contain"
                quality={100}
              />
            </div>
            <h1 className="text-2xl font-bold tracking-wider text-yellow-500">
              ALTSEASON
            </h1>
          </div>

          {/* Mobil menü gomb - bal oldalon */}
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
              href="#about-section" 
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
            className="bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] hover:from-[#2a2a2a] hover:to-[#3a3a3a] text-white font-medium py-2.5 px-5 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/20 text-sm md:text-base flex items-center gap-2.5 border-2 border-[#FFD700]"
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
    </header>
  );
};

export default Header;