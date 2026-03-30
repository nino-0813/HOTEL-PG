import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import HotelIIIStory from './HotelIIIStory';

const Hotels: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [showStory, setShowStory] = useState(false);

  return (
    <section id="hotels" className="relative py-12 sm:py-20 md:py-32 lg:py-48 bg-background">
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
            type="button"
            onClick={() => setShowStory(true)}
            className="relative w-full bg-white border border-gray-200 rounded-xl p-6 sm:p-8 md:p-10 lg:p-12 hover:border-textMain transition-all duration-500 hover:shadow-lg text-left group cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          >
            {/* Status Badge */}
            <span className="inline-block bg-textMain text-white text-[10px] sm:text-xs tracking-[0.15em] px-3 py-1.5 sm:px-4 sm:py-2 mb-6 rounded">
              COMING SOON
            </span>

            {/* Hotel Name */}
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-textMain mb-6 tracking-[0.1em]">
              HOTEL PG -III-
            </h3>

            {/* Lead */}
            <p className="font-serif text-base sm:text-lg text-textMain leading-relaxed mb-6">
              最新の設備と洗練されたデザインで、新しい滞在体験を。
            </p>

            {/* Description */}
            <p className="font-serif text-sm text-textLight leading-relaxed mb-8 max-w-2xl">
              HOTEL PG -I-、-II-の成功を踏まえ、さらなる進化を目指した第三のホテル。因島に誕生する新しい宿の準備を進めております。
            </p>

            {/* CTA */}
            <div className="flex items-center gap-2 text-gray-500 group-hover:text-textMain transition-colors pt-4 border-t border-gray-100">
              <span className="font-display text-xs sm:text-sm tracking-[0.15em] uppercase">
                詳細を見る
              </span>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
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

