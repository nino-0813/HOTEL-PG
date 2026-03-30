import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { trackReservationClick } from '../utils/analytics';

const Reservation: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="reservation" className="relative py-10 sm:py-16 md:py-24 lg:py-32 bg-background">
      <div ref={ref} className="container mx-auto px-4 sm:px-6 md:px-12">
        {/* Section Title */}
        <motion.div
          className="mb-8 sm:mb-12 md:mb-16 text-center sm:text-left"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-textMain mb-2 sm:mb-4">
            Reservation
          </h2>
          <p className="font-serif text-xs sm:text-sm text-gray-500 tracking-widest">
            ご予約
          </p>
          <div className="w-12 h-[1px] bg-gray-300 mt-4 sm:mt-6 mx-auto sm:mx-0"></div>
        </motion.div>

        {/* Reservation Cards */}
        <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
          {/* HOTEL PG -I- */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="border border-gray-200 p-4 sm:p-6 md:p-8 rounded-lg hover:border-textMain transition-all duration-300 group bg-white shadow-sm hover:shadow-md"
          >
            <h3 className="font-display text-lg sm:text-xl md:text-2xl font-light text-textMain mb-4 sm:mb-6 tracking-[0.05em] sm:tracking-[0.1em] leading-tight">
              HOTEL PG -I-
            </h3>
            <a
              href="https://vacation-stay.jp/listings/917598?utm_source=ig&utm_medium=social&utm_content=link_in_bio"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackReservationClick('HOTEL PG -I-')}
              className="block w-full sm:inline-block sm:w-auto text-center font-display text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white bg-textMain px-6 sm:px-8 py-3 sm:py-4 hover:bg-textLight transition-colors duration-300 group-hover:shadow-lg rounded"
            >
              予約する →
            </a>
          </motion.div>

          {/* HOTEL PG -II- シングルタイプ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="border border-gray-200 p-4 sm:p-6 md:p-8 rounded-lg hover:border-textMain transition-all duration-300 group bg-white shadow-sm hover:shadow-md"
          >
            <h3 className="font-display text-lg sm:text-xl md:text-2xl font-light text-textMain mb-4 sm:mb-6 tracking-[0.05em] sm:tracking-[0.1em] leading-tight">
              <span className="block sm:inline">HOTEL PG -II-</span>
              <span className="block sm:inline sm:ml-2 text-base sm:text-lg md:text-xl">【シングルタイプ】</span>
            </h3>
            <a
              href="https://vacation-stay.jp/listings/1138330?utm_source=ig&utm_medium=social&utm_content=link_in_bio"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackReservationClick('HOTEL PG -II- シングルタイプ')}
              className="block w-full sm:inline-block sm:w-auto text-center font-display text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white bg-textMain px-6 sm:px-8 py-3 sm:py-4 hover:bg-textLight transition-colors duration-300 group-hover:shadow-lg rounded"
            >
              予約する →
            </a>
          </motion.div>

          {/* HOTEL PG -II- ファミリータイプ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="border border-gray-200 p-4 sm:p-6 md:p-8 rounded-lg hover:border-textMain transition-all duration-300 group bg-white shadow-sm hover:shadow-md"
          >
            <h3 className="font-display text-lg sm:text-xl md:text-2xl font-light text-textMain mb-4 sm:mb-6 tracking-[0.05em] sm:tracking-[0.1em] leading-tight">
              <span className="block sm:inline">HOTEL PG -II-</span>
              <span className="block sm:inline sm:ml-2 text-base sm:text-lg md:text-xl">【ファミリータイプ】</span>
            </h3>
            <a
              href="https://vacation-stay.jp/listings/1138335?utm_source=ig&utm_medium=social&utm_content=link_in_bio"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackReservationClick('HOTEL PG -II- ファミリータイプ')}
              className="block w-full sm:inline-block sm:w-auto text-center font-display text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white bg-textMain px-6 sm:px-8 py-3 sm:py-4 hover:bg-textLight transition-colors duration-300 group-hover:shadow-lg rounded"
            >
              予約する →
            </a>
          </motion.div>

          {/* HOTEL PG -III- */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="border border-gray-200 p-4 sm:p-6 md:p-8 rounded-lg hover:border-textMain transition-all duration-300 group bg-white shadow-sm hover:shadow-md"
          >
            <h3 className="font-display text-lg sm:text-xl md:text-2xl font-light text-textMain mb-2 sm:mb-3 tracking-[0.05em] sm:tracking-[0.1em] leading-tight">
              HOTEL PG -III-
            </h3>
            <p className="font-serif text-xs sm:text-sm text-textMain mb-4 sm:mb-6 font-medium">
              電話でご予約可能
            </p>
            <a
              href="tel:07083289154"
              onClick={() => trackReservationClick('HOTEL PG -III- 電話予約')}
              className="block w-full sm:inline-block sm:w-auto text-center font-display text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white bg-textMain px-6 sm:px-8 py-3 sm:py-4 hover:bg-textLight transition-colors duration-300 group-hover:shadow-lg rounded"
            >
              電話予約はこちら →
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Reservation;

