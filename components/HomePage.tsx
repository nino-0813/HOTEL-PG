'use client';

import React, { useEffect } from 'react';
import Header from './Header';
import Hero from './Hero';
import Section from './Section';
import News from './News';
import Blog from './Blog';
import Reservation from './Reservation';
import StayPlans from './StayPlans';
import Hotels from './Hotels';
import Gallery from './Gallery';
import FAQ from './FAQ';
import Contact from './Contact';
import Recruit from './Recruit';
import Footer from './Footer';
import { useCms } from '@/context/CmsContext';

const HomePage: React.FC = () => {
  const { content } = useCms();

  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash.slice(1) : '';
    if (!hash) return;
    const scrollToId = () => {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    scrollToId();
    requestAnimationFrame(scrollToId);
    const t = setTimeout(scrollToId, 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen relative">
      <div className="bg-noise" />
      <Header />

      <main className="relative w-full">
        <div className="relative h-screen sm:h-[80vh] md:h-screen w-full z-0">
          <Hero />
        </div>

        <div className="relative z-10 bg-background shadow-[0_-40px_80px_rgba(0,0,0,0.05)] rounded-t-[20px] sm:rounded-t-[40px] sm:-mt-20 pt-0 sm:pt-20 pb-20 sm:pb-32">
          <Section id="concept" data={content.concept} index={0} />
          <Section id="rooms" data={content.rooms} reverse index={1} />
          <Section id="dining" data={content.dining} index={2} />
          <Section id="activity" data={content.activity} reverse index={3} />
          <Gallery />
          <Reservation />
          <StayPlans />
          <Blog />
          <Hotels />
          <News />
          <FAQ />
          <Contact />
          <Recruit />
        </div>

        <div className="relative z-10 w-full">
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
