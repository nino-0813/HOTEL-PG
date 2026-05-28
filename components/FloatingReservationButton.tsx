'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

/** スクロール量がこの px を超えたら表示 */
const SHOW_AFTER_PX = 200;

export default function FloatingReservationButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > SHOW_AFTER_PX);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="floating-reserve"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[80]"
        >
          <Link
            href="/reserve"
            aria-label="ご予約はこちら"
            className="group block relative w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] md:w-[176px] md:h-[176px] drop-shadow-lg hover:drop-shadow-xl transition-all duration-300"
          >
            <Image
              src="/reservation-button.png"
              alt="ご予約はこちら"
              fill
              priority
              sizes="(max-width: 640px) 120px, (max-width: 768px) 150px, 176px"
              className="object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
