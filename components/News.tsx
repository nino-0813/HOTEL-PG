import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { INSTAGRAM_DM_URL, INSTAGRAM_PROFILE_URL } from '../constants';

const INSTAGRAM_EMBED_URL = `${INSTAGRAM_PROFILE_URL}embed/?cr=1&v=14`;

const News: React.FC = () => {
  const [embedReady, setEmbedReady] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-20%' });

  // 表示領域に入ってから embed.js を読み込む（遅延読み込み）
  useEffect(() => {
    if (!isInView || scriptLoaded) return;

    const existing = document.querySelector('script[src="https://www.instagram.com/embed.js"]');
    const onReady = () => {
      setScriptLoaded(true);
      // embed.js が iframe を処理するまで少し待つ
      setTimeout(() => setEmbedReady(true), 150);
    };
    
    if (existing) {
      onReady();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.onload = onReady;
    script.onerror = onReady;
    document.body.appendChild(script);
  }, [isInView, scriptLoaded]);

  return (
    <section id="news" className="relative py-12 sm:py-20 md:py-32 lg:py-48">
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-textMain mb-2">
            Instagram
          </h2>
          <p className="font-serif text-sm text-gray-500 tracking-widest">
            フォローはこちら
          </p>
          <div className="w-12 h-[1px] bg-gray-300 mx-auto mt-6"></div>
        </motion.div>

        {/* embed.js 読み込み後に iframe を表示し、読み込み順を安定させる */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-5%' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 flex justify-center"
        >
          {embedReady && isInView ? (
            <iframe
              key="instagram-embed"
              id="instagram-embed-0"
              src={INSTAGRAM_EMBED_URL}
              title="HOTEL PG Instagram"
              className="instagram-media instagram-media-rendered"
              allowFullScreen
              frameBorder={0}
              scrolling="no"
              height={581}
              loading="lazy"
              style={{
                background: 'white',
                maxWidth: '540px',
                width: 'calc(100% - 2px)',
                minWidth: '326px',
                border: '1px solid rgb(219, 219, 219)',
                borderRadius: '3px',
                boxShadow: 'none',
                display: 'block',
                margin: '0 0 12px',
                padding: 0,
              }}
            />
          ) : (
            <div
              className="bg-gray-50 rounded-lg flex flex-col items-center justify-center border border-gray-200"
              style={{ minWidth: 326, maxWidth: 540, width: 'calc(100% - 2px)', height: 581 }}
            >
              {!isInView ? (
                <span className="text-gray-400 text-sm">スクロールで表示</span>
              ) : !scriptLoaded ? (
                <span className="text-gray-400 text-sm">読み込み準備中…</span>
              ) : (
                <div className="text-center">
                  <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-textMain rounded-full animate-spin mb-2"></div>
                  <span className="block text-gray-400 text-sm">読み込み中…</span>
                </div>
              )}
            </div>
          )}
        </motion.div>
        <p className="text-center mt-4 max-w-4xl mx-auto px-4">
          <a
            href={INSTAGRAM_DM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-body text-xs tracking-[0.15em] uppercase text-textMain hover:text-textLight transition-colors"
          >
            <Instagram size={14} strokeWidth={1.5} />
            @hotel_pg_ をInstagramで開く
          </a>
        </p>
      </div>
    </section>
  );
};

export default News;
