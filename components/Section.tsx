import React, { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { SectionContent } from '../types';

interface SectionProps {
  id: string;
  data: SectionContent;
  reverse?: boolean;
  index: number;
}

const Section: React.FC<SectionProps> = ({ id, data, reverse, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  return (
    <section id={id} ref={ref} className={`relative bg-background ${id === 'concept' ? 'pt-0 sm:pt-20' : 'pt-8 sm:pt-20'} pb-12 sm:pb-20 md:py-32 lg:py-48 overflow-hidden z-20`}>
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        <div className="flex flex-col lg:block relative">

            {/* Background Number */}
            <motion.div 
              className={`absolute top-0 ${reverse ? 'right-0 lg:right-[-4rem]' : 'left-0 lg:left-[-4rem]'} z-0 pointer-events-none select-none`}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
                <span className="block font-display text-[12rem] lg:text-[20rem] text-[#f0f0f0] leading-none">
                    0{index + 1}
                </span>
            </motion.div>

            {/* Title Area */}
            <motion.div 
              className={`relative z-20 mb-16 lg:mb-0 lg:absolute lg:top-12 ${reverse ? 'lg:right-12 text-right' : 'lg:left-12 text-left'} pointer-events-none`}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
            >
                <h2 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-9xl text-textMain mix-blend-multiply tracking-wide">
                    {data.title}
                </h2>
            </motion.div>

            {/* Main Image */}
            <div className={`w-full px-6 sm:px-4 md:px-0 lg:w-[65%] ${reverse ? 'lg:mr-auto lg:ml-0' : 'lg:ml-auto lg:mr-0'} relative mt-4 lg:mt-32 mb-6 sm:mb-8 md:mb-12 lg:mb-0 group z-10`}>
                <div className="relative sm:aspect-[4/5] md:aspect-[16/11] max-w-[85%] sm:max-w-full mx-auto overflow-hidden shadow-2xl">
                    <motion.div
                      className="absolute inset-0 bg-[#e5e5e5] z-20"
                      initial={{ scaleX: 1, transformOrigin: "left" }}
                      animate={isInView ? { scaleX: 0, transformOrigin: "right" } : {}}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                    />
                    <motion.img 
                        src={data.images[0]} 
                        alt={data.title} 
                        style={{ scale: imageScale }}
                        className="w-full h-auto sm:h-full object-cover"
                    />
                </div>
                <div className={`hidden lg:block absolute -bottom-16 ${reverse ? '-right-12' : '-left-12'} text-[10px] font-body tracking-[0.3em] text-gray-400 writing-vertical h-32`}>
                    FIG. 0{index + 1} — {data.title.toUpperCase()}
                </div>
            </div>

            {/* Content Text Box */}
            <motion.div 
              className={`relative z-30 lg:w-[42%] ${reverse ? 'lg:ml-auto lg:-mt-64 lg:mr-24' : 'lg:mr-auto lg:-mt-56 lg:ml-24'} bg-white/90 backdrop-blur-xl p-6 sm:p-8 lg:p-16 shadow-lg border border-white/40`}
              style={{ y }}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.4 }}
            >
                <div className="flex items-start gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-10">
                    <div className="w-[1px] h-8 sm:h-10 lg:h-12 bg-textMain/30"></div>
                    <h3 className="font-serif text-lg sm:text-xl md:text-2xl tracking-widest leading-relaxed text-textMain pt-1 sm:pt-2">
                        {data.subtitle}
                    </h3>
                </div>

                <div className="space-y-4 sm:space-y-5 lg:space-y-8 mb-8 sm:mb-12 lg:mb-16">
                    {data.description.map((line, i) => (
                        <p key={i} className="font-serif text-sm sm:text-[15px] leading-[1.7] sm:leading-[1.9] lg:leading-[2.2] text-textLight text-justify tracking-wide">
                            {line}
                        </p>
                    ))}
                </div>

                <a href={`#${id}-detail`} className="group inline-flex items-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] md:text-xs tracking-[0.25em] uppercase text-textMain border-b border-gray-300 pb-2 sm:pb-3 hover:border-textMain transition-all duration-300">
                    <span>Explore {data.title}</span>
                    <ArrowRight size={14} className="sm:w-4 sm:h-4 transition-transform duration-500 group-hover:translate-x-3" />
                </a>
            </motion.div>

            {/* Secondary Image - Decorative */}
            <motion.div 
              className={`hidden lg:block absolute -bottom-24 ${reverse ? 'left-24' : 'right-24'} w-[20%] z-20`}
              style={{ y: useTransform(scrollYProgress, [0, 1], [50, -50]) }}
            >
                <div className="aspect-[3/4] shadow-2xl overflow-hidden border-4 border-white">
                     <motion.img 
                        src={data.images[1]} 
                        alt="Detail" 
                        initial={{ scale: 1.2 }}
                        animate={isInView ? { scale: 1 } : {}}
                        transition={{ duration: 2 }}
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                </div>
            </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Section;
