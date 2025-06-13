'use client';

import Header from '@/components/Header'
import About from '@/components/About'
import LaunchInfo from '@/components/Tokenomics'
import Roadmap from '@/components/Roadmap'
import HowToBuy from '@/components/HowToBuy'
import Footer from '@/components/Footer'
import SectionDivider from '@/components/SectionDivider'
import Hero from '@/components/Hero'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      <About />
      <SectionDivider />
      <LaunchInfo />
      <SectionDivider />
      <Roadmap />
      <SectionDivider />
      <HowToBuy />
      <SectionDivider />
    </main>
  )
}
