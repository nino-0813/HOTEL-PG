import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { HERO_IMAGE } from '../constants';
import BrandLogo from './BrandLogo';

const HERO_DESKTOP_VIDEO = '/videos/hotel-pg-hero-desktop.mp4?v=20261106-2';

const Hero: React.FC = () => {
  return (
    <div
      id="home"
      className="relative h-[54dvh] min-h-[420px] max-h-[560px] w-full overflow-hidden bg-[#0a0a0a] md:h-screen md:min-h-0 md:max-h-none"
    >
      {/* デスクトップ表示は従来どおり、全画面の自動再生動画を維持 */}
      <video
        className="absolute inset-0 z-0 hidden h-full w-full object-cover md:block"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={HERO_IMAGE}
        aria-hidden="true"
      >
        <source src={HERO_DESKTOP_VIDEO} type="video/mp4" />
      </video>

      {/* スマートフォンは既存写真を維持し、直下の紹介動画まで見える高さに調整 */}
      <div className="absolute inset-0 z-0 md:hidden">
        <Image
          src={HERO_IMAGE}
          alt="因島の海と橋を望む風景"
          fill
          priority
          sizes="100vw"
          quality={70}
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/55" aria-hidden="true" />
      </div>

      <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center text-white">
        <div className="flex flex-col items-center space-y-2.5 px-5 pt-8 md:hidden">
          <motion.div
            className="overflow-hidden"
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
          >
            <h1 className="text-center font-display text-[2.35rem] font-light leading-tight tracking-[0.12em] drop-shadow-lg">
              因島の夜に
            </h1>
          </motion.div>

          <motion.p
            className="font-serif text-[10px] tracking-[0.28em] opacity-90 drop-shadow-md"
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 0.9 }}
            transition={{ duration: 0.9, delay: 0.45, ease: 'easeOut' }}
          >
            INNOSHIMA, HIROSHIMA
          </motion.p>

          <motion.div
            className="h-8 w-px bg-white/65"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.7, delay: 0.7, ease: 'circOut' }}
          />

          <motion.p
            className="text-center font-serif text-[11px] font-light leading-6 tracking-[0.16em] opacity-90 drop-shadow-md"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 0.9 }}
            transition={{ duration: 0.9, delay: 0.85, ease: 'easeOut' }}
          >
            瀬戸内の凪に包まれる、隠れ家リゾート
          </motion.p>

          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 1, ease: 'easeOut' }}
          >
            <BrandLogo className="h-16 w-16 shadow-lg" sizes="64px" priority />
          </motion.div>
        </div>

        {/* デスクトップのスクロール案内は従来どおり */}
        <motion.div
          className="absolute bottom-12 hidden flex-col items-center gap-2 opacity-60 md:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <span className="writing-vertical h-16 border-r border-white/50 pr-2 text-[10px] uppercase tracking-widest">Scroll</span>
          <motion.div
            className="h-12 w-px bg-white"
            animate={{ scaleY: [0, 1, 0], transformOrigin: ['top', 'top', 'bottom'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
