'use client';

import About from '@/components/About'
import Tokenomics from '@/components/Tokenomics'
import Roadmap from '@/components/Roadmap'
import HowToBuy from '@/components/HowToBuy'
import Header from '@/components/Header'
import SectionDivider from '@/components/SectionDivider'
import BullRunGame from '@/games/BullRunGame'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      <div className="pt-20">
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
