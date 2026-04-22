'use client';

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_ITEMS } from '../constants';

const Header: React.FC = () => {
  const pathname = usePathname();
  const isTop = pathname === '/';

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  /** リロード直後にブラウザがスクロール位置を復元しているとき、描画前に同期するため */
  const lastScrollYRef = useRef(0);

  const showTransparent = isTop && !isScrolled;

  useLayoutEffect(() => {
    if (!isTop) {
      setIsScrolled(false);
      setIsVisible(true);
      return;
    }
    const applyScrollState = () => {
      const y = window.scrollY;
      lastScrollYRef.current = y;
      setIsScrolled(y > 32);
      setIsVisible(true);
    };
    applyScrollState();
    const t = window.setTimeout(applyScrollState, 0);
    return () => window.clearTimeout(t);
  }, [isTop]);

  useEffect(() => {
    if (!isTop) return;
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 32);
      if (y < 60) setIsVisible(true);
      else if (y > lastScrollYRef.current) setIsVisible(false);
      else setIsVisible(true);
      lastScrollYRef.current = y;
    };
    const syncAfterRestore = () => {
      const y = window.scrollY;
      lastScrollYRef.current = y;
      setIsScrolled(y > 32);
      setIsVisible(true);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('pageshow', syncAfterRestore);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pageshow', syncAfterRestore);
    };
  }, [isTop]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    if (href.startsWith('#')) {
      const id = href.slice(1);
      const el = id === 'home' ? null : document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-[100] transition-[background] duration-200 ${
          showTransparent ? '' : 'bg-white/98 backdrop-blur-md border-b border-black/5'
        }`}
        initial={false}
        animate={{
          y: isTop && !isMenuOpen && !isVisible ? -64 : 0,
          opacity: isTop && !isMenuOpen && !isVisible ? 0 : 1,
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <div className="h-12 sm:h-14 max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link
            href="/"
            onClick={(e) => {
              if (isTop) {
                e.preventDefault();
                handleNavClick('#home');
              }
            }}
            className={`font-display text-[13px] sm:text-sm tracking-[0.25em] transition-colors ${
              showTransparent ? 'text-white/95' : 'text-[#1a1a1a]'
            }`}
          >
            HOTEL PG
          </Link>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-1 -mr-1 transition-colors duration-200 ${
              showTransparent ? 'text-white/90' : 'text-[#1a1a1a]'
            }`}
            aria-label="メニュー"
          >
            {isMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[99] bg-[#fafafa]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="h-12 sm:h-14 flex items-center justify-between px-4 sm:px-6 max-w-6xl mx-auto border-b border-black/5">
              <span className="font-display text-[13px] tracking-[0.25em] text-[#1a1a1a]">HOTEL PG</span>
              <button type="button" onClick={() => setIsMenuOpen(false)} aria-label="閉じる">
                <X size={20} strokeWidth={1.5} className="text-[#1a1a1a]" />
              </button>
            </div>
            <nav className="pt-8 pb-12 px-4 sm:px-6 max-w-6xl mx-auto">
              {isTop ? (
                <ul className="space-y-0">
                  {NAV_ITEMS.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick(item.href);
                        }}
                        className="block py-2.5 font-display text-lg sm:text-xl font-light text-[#1a1a1a] tracking-[0.08em] hover:opacity-60 transition-opacity"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/account"
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-2.5 font-display text-lg sm:text-xl font-light text-[#1a1a1a] tracking-[0.08em] hover:opacity-60 transition-opacity"
                    >
                      My page
                    </Link>
                  </li>
                  <li>
                    <Link href="/recruit" onClick={() => setIsMenuOpen(false)} className="block py-2.5 font-display text-lg sm:text-xl font-light text-[#1a1a1a] tracking-[0.08em] hover:opacity-60 transition-opacity">
                      RECRUIT
                    </Link>
                  </li>
                </ul>
              ) : (
                <ul className="space-y-0">
                  <li>
                    <Link href="/" onClick={() => setIsMenuOpen(false)} className="block py-2.5 font-display text-lg font-light text-[#1a1a1a] tracking-[0.08em] hover:opacity-60 transition-opacity">
                      トップ
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" onClick={() => setIsMenuOpen(false)} className="block py-2.5 font-display text-lg font-light text-[#1a1a1a] tracking-[0.08em] hover:opacity-60 transition-opacity">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/account" onClick={() => setIsMenuOpen(false)} className="block py-2.5 font-display text-lg font-light text-[#1a1a1a] tracking-[0.08em] hover:opacity-60 transition-opacity">
                      My page
                    </Link>
                  </li>
                  <li>
                    <Link href="/recruit" onClick={() => setIsMenuOpen(false)} className="block py-2.5 font-display text-lg font-light text-[#1a1a1a] tracking-[0.08em] hover:opacity-60 transition-opacity">
                      RECRUIT
                    </Link>
                  </li>
                </ul>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
