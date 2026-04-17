import React, { useState } from 'react';
import Image from 'next/image';
import { HERO_IMAGE } from '../constants';
import { motion } from 'framer-motion';

const fallbackImages = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2560&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2560&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2560&auto=format&fit=crop',
];

const Hero: React.FC = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(HERO_IMAGE);

  return (
    <div id="home" className="relative w-full h-screen sm:h-[80vh] md:h-screen overflow-hidden bg-[#0a0a0a]">
      {/* 背景画像 - next/image で最適化 */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src={currentImageUrl}
          alt="因島の夜"
          fill
          priority
          sizes="100vw"
          quality={70}
          className="object-cover"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            const nextImage = fallbackImages.find(url => url !== currentImageUrl);
            if (nextImage) setCurrentImageUrl(nextImage);
          }}
        />
      </div>

      {/* ズームアニメーション用の別レイヤー */}
      {imageLoaded && (
        <motion.div
          className="absolute inset-0 w-full h-full z-0 overflow-hidden"
          animate={{ scale: [1, 1.1] }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <Image
            src={currentImageUrl}
            alt=""
            fill
            sizes="100vw"
            quality={70}
            className="object-cover pointer-events-none"
          />
        </motion.div>
      )}
      
      {/* オーバーレイ（文字の視認性のため軽く） */}
      <div className="absolute inset-0 bg-black/15 z-10" />

      {/* Content - タイトルとSCROLLインジケーター */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-white pointer-events-none">
        <div className="flex flex-col items-center space-y-3 sm:space-y-4 md:space-y-6">
          {/* メインタイトル */}
          <motion.div
            className="overflow-hidden"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          >
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl tracking-[0.1em] sm:tracking-[0.15em] font-light text-center leading-tight text-white px-4">
              因島の夜に
            </h1>
          </motion.div>

          {/* サブタイトル */}
          <motion.div
            className="overflow-hidden"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
          >
            <p className="font-serif text-xs sm:text-sm md:text-base tracking-[0.2em] sm:tracking-[0.3em] uppercase opacity-90 text-center drop-shadow-md px-4">
              INNOSHIMA, HIROSHIMA
            </p>
          </motion.div>

          {/* 装飾的な区切り線 */}
          <motion.div
            className="w-[1px] bg-white/60"
            initial={{ height: 0 }}
            animate={{ height: 40 }}
            transition={{ duration: 1, delay: 1, ease: "circOut" }}
          />

          {/* キャッチコピー */}
          <motion.div
            className="overflow-hidden"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.2, ease: "easeOut" }}
          >
            <p className="font-serif text-xs sm:text-sm md:text-sm tracking-widest opacity-80 text-center font-light drop-shadow-md max-w-md px-4 sm:px-6">
              瀬戸内の凪に包まれる、<br className="hidden sm:block" />
              隠れ家リゾート
            </p>
          </motion.div>

          {/* HOTEL PG ブランド名 */}
          <motion.div
            className="overflow-hidden"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.5, ease: "easeOut" }}
          >
            <p className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-[0.2em] sm:tracking-[0.25em] text-white text-center font-normal drop-shadow-lg px-4">
              HOTEL PG
            </p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 sm:bottom-12 flex flex-col items-center gap-2 opacity-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <span className="text-[10px] tracking-widest uppercase writing-vertical h-16 border-r border-white/50 pr-2">Scroll</span>
          <motion.div 
            className="w-[1px] h-12 bg-white"
            animate={{ scaleY: [0, 1, 0], transformOrigin: ["top", "top", "bottom"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
