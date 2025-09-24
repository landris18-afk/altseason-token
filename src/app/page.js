'use client';

import { useState, useEffect } from 'react';
import About from '@/components/About'
import Tokenomics from '@/components/Tokenomics'
import Roadmap from '@/components/Roadmap'
import HowToBuy from '@/components/HowToBuy'
import Header from '@/components/Header'
import SectionDivider from '@/components/SectionDivider'
import BullRunGame from '@/games/BullRunGame'

export default function Home() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (!mobile) {
        setIsHeaderVisible(true);
        return;
      }

      // Check if we're at the top of the page (header should be hidden)
      const aboutSection = document.getElementById('about-section');
      if (aboutSection) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            setIsHeaderVisible(!entry.isIntersecting);
          },
          {
            threshold: 0,
            rootMargin: '-100px 0px 0px 0px'
          }
        );
        observer.observe(aboutSection);
        
        return () => observer.disconnect();
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <main className="min-h-screen text-white" style={{
      background: 'url(/images/rockat_pump_bacground.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <Header />
      <div className={isMobile && !isHeaderVisible ? 'pt-0' : 'pt-20'}>
        <About />
        <SectionDivider />
        <Tokenomics />
        <SectionDivider />
        <BullRunGame />
        <SectionDivider />
        <Roadmap />
        <SectionDivider />
        <HowToBuy />
      </div>
    </main>
  )
}
