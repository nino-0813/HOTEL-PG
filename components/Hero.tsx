import React, { useState, useEffect } from 'react';
import { HERO_IMAGE } from '../constants';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(HERO_IMAGE);

  // フォールバック画像URL
  const fallbackImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2560&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2560&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2560&auto=format&fit=crop"
  ];

  useEffect(() => {
    // 画像のプリロードを確認
    const img = new Image();
    img.crossOrigin = "anonymous"; // CORS対応
    img.src = currentImageUrl;
    
    img.onload = () => {
      setImageLoaded(true);
      setImageError(false);
    };
    
    img.onerror = () => {
      console.error('Failed to load hero image:', currentImageUrl);
      setImageError(true);
      
      // フォールバック画像を試す
      const nextImage = fallbackImages.find(url => url !== currentImageUrl);
      if (nextImage) {
        setCurrentImageUrl(nextImage);
      }
    };
  }, [currentImageUrl]);

  return (
    <div id="home" className="relative w-full h-screen overflow-hidden">
      {/* 背景画像を確実に表示 - backgroundImageスタイルを使用 */}
      <div 
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: imageLoaded ? `url(${currentImageUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#0a0a0a', // フォールバック
          transition: 'background-image 0.5s ease-in-out'
        }}
      >
        {/* オーバーレイ */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* ズームアニメーション用の別レイヤー */}
      {imageLoaded && (
        <motion.div
          className="absolute inset-0 w-full h-full z-0"
          style={{
            backgroundImage: `url(${currentImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
          animate={{ scale: [1, 1.1] }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>
      )}

      {/* Content - タイトルとSCROLLインジケーター */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-white pb-12 pointer-events-none">
        <div className="flex flex-col items-center">
          {/* メインタイトル */}
          <motion.div
            className="overflow-hidden mb-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          >
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-[0.15em] font-light text-center leading-none text-white">
              因島の夜に
            </h1>
          </motion.div>

          {/* サブタイトル */}
          <motion.div
            className="overflow-hidden mb-12"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
          >
            <p className="font-serif text-sm md:text-base tracking-[0.3em] uppercase opacity-90 text-center drop-shadow-md">
              INNOSHIMA, HIROSHIMA
            </p>
          </motion.div>

          {/* 装飾的な区切り線 */}
          <motion.div
            className="w-[1px] bg-white/60 mb-12"
            initial={{ height: 0 }}
            animate={{ height: 80 }}
            transition={{ duration: 1, delay: 1, ease: "circOut" }}
          />

          {/* キャッチコピー */}
          <motion.div
            className="overflow-hidden"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.2, ease: "easeOut" }}
          >
            <p className="font-serif text-xs md:text-sm tracking-widest opacity-80 text-center font-light drop-shadow-md max-w-md px-6">
              瀬戸内の凪に包まれる、<br className="hidden md:block" />
              隠れ家リゾート
            </p>
          </motion.div>

          {/* HOTEL PG ブランド名 */}
          <motion.div
            className="overflow-hidden mt-10 md:mt-12"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.5, ease: "easeOut" }}
          >
            <p className="font-display text-2xl md:text-3xl lg:text-4xl tracking-[0.25em] text-white text-center font-normal drop-shadow-lg">
              HOTEL PG
            </p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-12 flex flex-col items-center gap-2 opacity-60"
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
