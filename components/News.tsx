import React from 'react';
import { ArrowRight } from 'lucide-react';
import { NEWS_ITEMS } from '../constants';

const News: React.FC = () => {
  return (
    <section id="news" className="relative py-32 md:py-48">
      <div className="container mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16 lg:gap-32">
         {/* Title */}
         <div className="lg:w-1/4">
            <h2 className="font-display text-4xl md:text-5xl font-light text-textMain mb-6">Journal</h2>
            <p className="font-serif text-sm text-gray-500 tracking-widest mb-8">お知らせ・読み物</p>
            <div className="w-12 h-[1px] bg-gray-300"></div>
         </div>

         {/* List */}
         <div className="lg:w-3/4">
            <div className="flex flex-col">
               {NEWS_ITEMS.map((item, idx) => (
                  <a 
                     key={idx} 
                     href={item.href}
                     className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-12 py-10 border-b border-gray-200 hover:border-textMain transition-colors duration-500"
                  >
                     <time className="font-body text-xs tracking-widest text-gray-400 group-hover:text-textMain transition-colors w-32">
                        {item.date}
                     </time>
                     <span className="text-sm md:text-base font-serif text-textMain font-light group-hover:text-textLight transition-colors flex-1 leading-relaxed">
                        {item.title}
                     </span>
                     <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                        <ArrowRight size={12} className="text-textMain" />
                     </div>
                  </a>
               ))}
            </div>

            <div className="mt-20 text-right">
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
