import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const Reservation: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="reservation" className="relative py-20 sm:py-32 md:py-48 bg-background">
      <div ref={ref} className="container mx-auto px-4 sm:px-6 md:px-12">
        {/* Section Title */}
        <motion.div
          className="mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-textMain mb-4">
            Reservation
          </h2>
          <p className="font-serif text-sm text-gray-500 tracking-widest">
            ご予約
          </p>
          <div className="w-12 h-[1px] bg-gray-300 mt-6"></div>
        </motion.div>

        {/* Reservation Cards */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* HOTEL PG -I- */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="border border-gray-200 p-6 sm:p-8 hover:border-textMain transition-all duration-300 group bg-white"
          >
            <h3 className="font-display text-2xl font-light text-textMain mb-3 tracking-[0.1em]">
              HOTEL PG -I-
            </h3>
            <p className="font-serif text-sm text-gray-600 mb-6 leading-relaxed">
              瀬戸内の静寂に包まれた、最初の隠れ家リゾート
            </p>
            <a
              href="https://vacation-stay.jp/listings/917598?utm_source=ig&utm_medium=social&utm_content=link_in_bio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-white bg-textMain px-6 sm:px-8 py-3 sm:py-4 hover:bg-textLight transition-colors duration-300 group-hover:shadow-lg"
            >
              予約する →
            </a>
          </motion.div>

          {/* HOTEL PG -II- シングルタイプ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="border border-gray-200 p-6 sm:p-8 hover:border-textMain transition-all duration-300 group bg-white"
          >
            <h3 className="font-display text-2xl font-light text-textMain mb-3 tracking-[0.1em]">
              HOTEL PG -II- 【シングルタイプ】
            </h3>
            <p className="font-serif text-sm text-gray-600 mb-6 leading-relaxed">
              海と空が交わる場所に佇む、第二の特別な空間
            </p>
            <a
              href="https://vacation-stay.jp/listings/1138330?utm_source=ig&utm_medium=social&utm_content=link_in_bio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-white bg-textMain px-6 sm:px-8 py-3 sm:py-4 hover:bg-textLight transition-colors duration-300 group-hover:shadow-lg"
            >
              予約する →
            </a>
          </motion.div>

          {/* HOTEL PG -II- ファミリータイプ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="border border-gray-200 p-6 sm:p-8 hover:border-textMain transition-all duration-300 group bg-white"
          >
            <h3 className="font-display text-2xl font-light text-textMain mb-3 tracking-[0.1em]">
              HOTEL PG -II- 【ファミリータイプ】
            </h3>
            <p className="font-serif text-sm text-gray-600 mb-6 leading-relaxed">
              ご家族での滞在に最適な広々とした空間
            </p>
            <a
              href="https://vacation-stay.jp/listings/1138335?utm_source=ig&utm_medium=social&utm_content=link_in_bio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-white bg-textMain px-6 sm:px-8 py-3 sm:py-4 hover:bg-textLight transition-colors duration-300 group-hover:shadow-lg"
            >
              予約する →
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Reservation;

