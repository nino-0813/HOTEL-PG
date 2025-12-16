import React, { useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NEWS_ITEMS } from '../constants';

const News: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="news" className="relative py-12 sm:py-20 md:py-32 lg:py-48">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 flex flex-col lg:flex-row gap-12 sm:gap-16 lg:gap-32">
         {/* Title */}
         <div className="lg:w-1/4">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-textMain mb-6">Journal</h2>
            <p className="font-serif text-sm text-gray-500 tracking-widest mb-8">お知らせ・読み物</p>
            <div className="w-12 h-[1px] bg-gray-300"></div>
         </div>

         {/* List */}
         <div className="lg:w-3/4">
            {/* Mobile: Accordion Style */}
            <div className="flex flex-col md:hidden space-y-2">
               {NEWS_ITEMS.map((item, idx) => (
                  <div
                     key={idx}
                     className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:border-textMain/30 transition-colors"
                  >
                     <button
                        onClick={() => toggleItem(idx)}
                        className="w-full flex items-center justify-between py-3 px-4 text-left group"
                        aria-expanded={openIndex === idx}
                     >
                        <div className="flex-1 pr-4">
                           <time className="block font-body text-[10px] tracking-widest text-gray-400 mb-1">
                              {item.date}
                           </time>
                           <span className="block font-serif text-xs text-textMain leading-snug line-clamp-2">
                              {item.title}
                           </span>
                        </div>
                        <motion.div 
                           animate={{ rotate: openIndex === idx ? 180 : 0 }}
                           transition={{ duration: 0.3 }}
                           className="flex-shrink-0"
                        >
                           <ChevronDown size={16} className="text-gray-400 group-hover:text-textMain transition-colors" />
                        </motion.div>
                     </button>
                     <AnimatePresence>
                        {openIndex === idx && (
                           <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                              className="overflow-hidden"
                           >
                              <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                                 <a 
                                    href={item.href}
                                    className="flex items-center justify-between text-xs text-textMain hover:text-textLight transition-colors pt-3"
                                 >
                                    <span>詳細を見る</span>
                                    <ArrowRight size={12} />
                                 </a>
                              </div>
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
               ))}
            </div>

            {/* Desktop: Original Style */}
            <div className="hidden md:flex flex-col">
               {NEWS_ITEMS.map((item, idx) => (
                  <a 
                     key={idx} 
                     href={item.href}
                     className="group flex flex-row items-center gap-12 py-10 border-b border-gray-200 hover:border-textMain transition-colors duration-500"
                  >
                     <time className="font-body text-xs tracking-widest text-gray-400 group-hover:text-textMain transition-colors w-32">
                        {item.date}
                     </time>
                     <span className="text-base font-serif text-textMain font-light group-hover:text-textLight transition-colors flex-1 leading-relaxed">
                        {item.title}
                     </span>
                     <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                        <ArrowRight size={12} className="text-textMain" />
                     </div>
                  </a>
               ))}
            </div>

            <div className="mt-12 md:mt-20 text-right">
               <a 
                  href="#news-all"
                  className="inline-block font-display text-sm tracking-[0.2em] uppercase text-textMain border-b border-transparent hover:border-textMain pb-1 transition-all"
                >
                  View All Archives
                </a>
            </div>
         </div>
      </div>
    </section>
  );
};

export default News;
