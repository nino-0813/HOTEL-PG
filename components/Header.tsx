import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_ITEMS } from '../constants';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      // モバイルメニューが開いているときは、bodyのスクロールを無効化
      // ただし、メニュー内でスクロールできるようにする
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    
    return () => {
      // クリーンアップ
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isMenuOpen]);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 w-full z-[101] transition-all duration-500 ${
          isScrolled 
            ? 'py-3 sm:py-4 backdrop-blur-md bg-gray-100/90' 
            : 'bg-transparent py-4 sm:py-8'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 sm:px-6 md:px-12 flex justify-end items-center">

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  const targetId = item.href.substring(1);
                  const targetElement = document.getElementById(targetId);
                  if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } else if (item.href === '#home') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className={`font-body text-[10px] xl:text-[11px] tracking-[0.2em] uppercase hover:opacity-60 transition-all duration-300 relative group ${
                  isScrolled ? 'text-textMain' : 'text-white drop-shadow-sm'
                }`}
              >
                {item.label}
                <span className={`absolute -bottom-2 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full ${
                  isScrolled ? 'bg-textMain' : 'bg-white'
                }`}></span>
              </a>
            ))}
          </nav>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`z-50 p-2 focus:outline-none transition-colors duration-300 ${
                isScrolled ? 'text-textMain' : 'text-white'
              }`}
              aria-label="Toggle menu"
            >
              <div className="relative w-8 h-8 flex items-center justify-center">
                 {isMenuOpen ? <X size={24} strokeWidth={1} className="text-textMain" /> : <Menu size={24} strokeWidth={1} className={isScrolled ? '' : 'drop-shadow-md'} />}
              </div>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Full Screen Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-[#f5f5f5] z-40 flex flex-col overflow-y-auto"
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-col min-h-full pt-32 px-8 pb-10 container mx-auto">
              <nav className="flex flex-col gap-4 md:gap-6 items-start">
                {NAV_ITEMS.map((item, idx) => (
                  <motion.div 
                    key={item.label} 
                    className="overflow-hidden"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + idx * 0.1, duration: 0.8, ease: "easeOut" }}
                  >
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMenuOpen(false);
                        const targetId = item.href.substring(1);
                        const targetElement = document.getElementById(targetId);
                        if (targetElement) {
                          setTimeout(() => {
                            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 300);
                        } else if (item.href === '#home') {
                          setTimeout(() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }, 300);
                        }
                      }}
                      className="block font-display text-5xl md:text-7xl font-light text-textMain hover:text-gray-500 transition-colors"
                    >
                      <span className="text-sm font-body mr-6 text-gray-400 tracking-widest align-middle">0{idx + 1}</span>
                      {item.label}
                    </a>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
                <div className="space-y-6">
                   <div className="h-[1px] w-full bg-gray-300 mb-8"></div>
                   <div className="text-sm text-gray-500 font-serif leading-loose">
                      <p>HOTEL PG - INNOSHIMA</p>
                      <p>広島県尾道市因島田熊町</p>
                      <a href="tel:0000000000" className="text-xl font-display text-textMain block mt-2 hover:opacity-60 transition-opacity">0845-00-0000</a>
                   </div>
                </div>

                <a
                  href="#reserve"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between w-full p-6 md:p-8 bg-textMain text-white hover:bg-gray-800 transition-colors"
                >
                  <span className="font-display text-xl md:text-2xl tracking-widest">Reserve Your Stay</span>
                  <ArrowRight size={24} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
