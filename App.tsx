import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Section from './components/Section';
import News from './components/News';
import Reservation from './components/Reservation';
import Hotels from './components/Hotels';
import Gallery from './components/Gallery';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { CONTENT, PARALLAX_IMAGE_1, PARALLAX_IMAGE_2 } from './constants';
import { motion, AnimatePresence } from 'framer-motion';

// --- Sticky Divider Component ---
// 削除

const App: React.FC = () => {
  return (
    <>
      <div className="min-h-screen relative">
        {/* Background Texture */}
        <div className="bg-noise"></div>
        
        <Header />
        
        <main className="relative w-full">
          
          {/* 1. Hero Layer */}
          <div className="relative h-[70vh] sm:h-[80vh] md:h-screen w-full z-0">
            <Hero />
          </div>
          
          {/* 2. Content Layer */}
          <div className="relative z-10 bg-background shadow-[0_-40px_80px_rgba(0,0,0,0.05)] rounded-t-[20px] sm:rounded-t-[40px] sm:-mt-20 pt-0 sm:pt-20 pb-20 sm:pb-32">
             <Section id="concept" data={CONTENT.concept} index={0} />
             <Section id="rooms" data={CONTENT.rooms} reverse index={1} />
             <Section id="dining" data={CONTENT.dining} index={2} />
             <Section id="activity" data={CONTENT.activity} reverse index={3} />
             <Gallery />
             <Reservation />
             <Hotels />
             <News />
             <FAQ />
             <Contact />
          </div>

          {/* 3. Footer Layer (Normal Flow) */}
          {/* Spacer removed as Footer is now relative */}
          
          <div className="relative z-10 w-full">
             <Footer />
          </div>

        </main>
      </div>
    </>
  );
};

export default App;
