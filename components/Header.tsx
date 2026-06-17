'use client';

import React, { useState, useEffect, useLayoutEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/** デスクトップの横並びナビに出す主要項目（厳選）。残りはメニューに収納。
 *  page: true は別ページへのリンク（/blog など）、それ以外はトップ内のセクション(#xxx)。 */
const PRIMARY_NAV: { label: string; href: string; page?: boolean }[] = [
  { label: 'Concept', href: '#concept' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Blog', href: '/blog', page: true },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

const Header: React.FC = () => {
  const pathname = usePathname();
  const isTop = pathname === '/';

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const showTransparent = isTop && !isScrolled;

  useLayoutEffect(() => {
    if (!isTop) {
      setIsScrolled(false);
      return;
    }
    const applyScrollState = () => {
      setIsScrolled(window.scrollY > 32);
    };
    applyScrollState();
    const t = window.setTimeout(applyScrollState, 0);
    return () => window.clearTimeout(t);
  }, [isTop]);

  useEffect(() => {
    if (!isTop) return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 32);
    };
    const syncAfterRestore = () => {
      setIsScrolled(window.scrollY > 32);
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
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <div className="h-12 sm:h-14 lg:h-16 max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-6">
          <Link
            href="/"
            onClick={(e) => {
              if (isTop) {
                e.preventDefault();
                handleNavClick('#home');
              }
            }}
            className={`font-display text-[13px] sm:text-sm tracking-[0.25em] transition-colors shrink-0 ${
              showTransparent ? 'text-white/95' : 'text-[#1a1a1a]'
            }`}
          >
            HOTEL PG
          </Link>

          {/* デスクトップ: 横並びナビ */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
            {PRIMARY_NAV.map((item) => {
              const linkClass = `font-display text-[12px] xl:text-[13px] tracking-[0.16em] transition-colors whitespace-nowrap ${
                showTransparent ? 'text-white/90 hover:text-white' : 'text-[#1a1a1a]/80 hover:text-[#1a1a1a]'
              }`;
              // 別ページ（Blog など）は常に通常リンク
              if (item.page) {
                return (
                  <Link key={item.label} href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                );
              }
              // セクションリンク（#xxx）：トップ内ではスムーススクロール、他ページからはトップへ遷移
              return isTop ? (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={linkClass}
                >
                  {item.label}
                </a>
              ) : (
                <Link key={item.label} href={`/${item.href}`} className={linkClass}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* デスクトップ: 予約CTA */}
            {isTop ? (
              <a
                href="#reservation"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('#reservation');
                }}
                className={`hidden lg:inline-flex items-center px-5 py-2 rounded-full font-display text-[12px] tracking-[0.16em] transition-colors ${
                  showTransparent
                    ? 'border border-white/70 text-white hover:bg-white hover:text-[#1a1a1a]'
                    : 'bg-[#1a1a1a] text-white hover:opacity-85'
                }`}
              >
                ご予約
              </a>
            ) : (
              <Link
                href="/#reservation"
                className="hidden lg:inline-flex items-center px-5 py-2 rounded-full bg-[#1a1a1a] text-white font-display text-[12px] tracking-[0.16em] hover:opacity-85 transition-colors"
              >
                ご予約
              </Link>
            )}

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
              {/* 主要項目（デスクトップヘッダーと統一） */}
              <ul className="space-y-0">
                {PRIMARY_NAV.map((item) => {
                  const cls =
                    'block py-2.5 font-display text-lg sm:text-xl font-light text-[#1a1a1a] tracking-[0.08em] hover:opacity-60 transition-opacity';
                  if (item.page) {
                    return (
                      <li key={item.label}>
                        <Link href={item.href} onClick={() => setIsMenuOpen(false)} className={cls}>
                          {item.label}
                        </Link>
                      </li>
                    );
                  }
                  return (
                    <li key={item.label}>
                      {isTop ? (
                        <a
                          href={item.href}
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavClick(item.href);
                          }}
                          className={cls}
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link href={`/${item.href}`} onClick={() => setIsMenuOpen(false)} className={cls}>
                          {item.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* 予約CTA */}
              {isTop ? (
                <a
                  href="#reservation"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('#reservation');
                  }}
                  className="mt-7 inline-flex items-center justify-center w-full px-6 py-3.5 rounded-full bg-[#1a1a1a] text-white font-display text-sm tracking-[0.16em]"
                >
                  ご予約
                </a>
              ) : (
                <Link
                  href="/#reservation"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-7 inline-flex items-center justify-center w-full px-6 py-3.5 rounded-full bg-[#1a1a1a] text-white font-display text-sm tracking-[0.16em]"
                >
                  ご予約
                </Link>
              )}

              {/* 補助リンク */}
              <ul className="mt-8 pt-6 border-t border-black/10 space-y-0">
                <li>
                  <Link href="/account" onClick={() => setIsMenuOpen(false)} className="block py-2 font-display text-sm text-[#1a1a1a]/70 tracking-[0.12em] hover:text-[#1a1a1a] transition-colors">
                    My page
                  </Link>
                </li>
                <li>
                  <Link href="/recruit" onClick={() => setIsMenuOpen(false)} className="block py-2 font-display text-sm text-[#1a1a1a]/70 tracking-[0.12em] hover:text-[#1a1a1a] transition-colors">
                    RECRUIT
                  </Link>
                </li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
