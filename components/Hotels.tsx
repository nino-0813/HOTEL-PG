import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import HotelIIIStory from './HotelIIIStory';

const Hotels: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [showStory, setShowStory] = useState(false);

  return (
    <section id="hotels" className="relative py-20 sm:py-32 md:py-48 bg-background">
      <div ref={ref} className="container mx-auto px-4 sm:px-6 md:px-12">
        {/* Section Title */}
        <motion.div
          className="mb-16 md:mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-textMain mb-4">
            HOTEL PG -III-
          </h2>
          <p className="font-serif text-sm text-gray-500 tracking-widest">
            新築完成予定
          </p>
          <div className="w-12 h-[1px] bg-gray-300 mt-6"></div>
        </motion.div>

        {/* HOTEL PG -III- Feature Card */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <button
            onClick={() => setShowStory(true)}
            className="relative w-full bg-white border border-gray-200 p-12 md:p-16 hover:border-textMain transition-all duration-500 hover:shadow-lg text-left group"
          >
            {/* Status Badge */}
            <div className="absolute top-6 right-6 bg-textMain text-white text-xs tracking-widest px-4 py-2">
              COMING SOON
            </div>

            {/* Hotel Name */}
            <h3 className="font-display text-3xl md:text-4xl font-light text-textMain mb-6 tracking-[0.15em]">
              HOTEL PG -III-
            </h3>

            {/* Description */}
            <p className="font-serif text-base md:text-lg text-gray-700 leading-relaxed mb-8">
              新築完成予定。最新の設備と洗練されたデザインで、新しい滞在体験を。
            </p>

            {/* Concept Preview */}
            <div className="mb-8">
              <p className="font-serif text-sm text-gray-600 leading-relaxed">
                HOTEL PG -I-、-II-の成功を踏まえ、さらなる進化を目指した第三のホテル。
                最新の設備と洗練されたデザインで、これまでにない新しい滞在体験をお届けする準備を進めております。
              </p>
            </div>

            {/* Decorative Line */}
            <div className="w-12 h-[1px] bg-gray-300 group-hover:bg-textMain transition-colors duration-500"></div>

            {/* Hover Effect Indicator */}
            <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="font-display text-sm tracking-[0.2em] text-textMain uppercase">
                Learn More →
              </span>
            </div>
          </button>
        </motion.div>

        {/* Hotel III Story Page */}
        <AnimatePresence>
          {showStory && (
            <HotelIIIStory onClose={() => setShowStory(false)} />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Hotels;

