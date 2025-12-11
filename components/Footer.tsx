import React from 'react';
import { Instagram } from 'lucide-react';
import { NAV_ITEMS, CTA_IMAGE } from '../constants';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <footer className="w-full h-full relative flex flex-col overflow-hidden text-white">
       {/* Background Image - より暗くして文字を見やすくする */}
       <div className="absolute inset-0 -z-10 bg-black">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-60 transition-transform duration-[30s] ease-linear hover:scale-105"
            style={{ backgroundImage: `url(${CTA_IMAGE})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
       </div>

      <div className="container mx-auto px-6 md:px-12 flex-1 flex flex-col justify-center py-20">
        
        {/* Main CTA - シンプルに */}
        <div className="flex flex-col items-center justify-center mb-24 text-center z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-display text-5xl md:text-7xl tracking-wider mb-10 text-white font-light"
            >
              Reserve a Stay
            </motion.h2>
            
            <motion.a 
               href="#reserve" 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="inline-block px-12 py-4 border border-white/30 hover:border-white hover:bg-white hover:text-black transition-all duration-500 font-body text-xs tracking-[0.2em] uppercase"
            >
               CHECK AVAILABILITY
            </motion.a>
        </div>

        {/* Minimal Footer Info */}
        <div className="flex flex-col md:flex-row justify-between items-end border-t border-white/10 pt-10 gap-8">
           <div className="flex flex-col gap-4">
              <h3 className="font-display text-2xl tracking-widest">HOTEL PG</h3>
              <p className="text-xs text-white/50 font-serif">広島県尾道市因島田熊町</p>
           </div>

           <div className="flex gap-8 text-[10px] tracking-widest uppercase text-white/50">
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span>© HOTEL PG</span>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
