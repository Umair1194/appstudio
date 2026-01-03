import React from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { StatsPartners } from './components/StatsPartners';
import { TeamSection } from './components/TeamSection';
import { ExploreSection } from './components/ExploreSection';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
export function App() {
  return <AnimatePresence>
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.8
    }} className="min-h-screen bg-white overflow-x-hidden">
        <Header />
        <main>
          <HeroSection />
          <ServicesSection />
          <StatsPartners />
          <ExploreSection />
          <TeamSection />
          <CTASection />
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>;
}