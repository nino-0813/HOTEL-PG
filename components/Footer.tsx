import React from 'react';
import Link from 'next/link';
import { CTA_IMAGE, INSTAGRAM_DM_URL } from '../constants';

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

      <div className="container mx-auto px-6 md:px-12 flex-1 flex flex-col justify-center py-10 sm:py-14">
        {/* Footer Info - コンパクトに */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8 md:gap-12">
          <div className="flex flex-col items-center md:items-start gap-1 text-center md:text-left">
            <h3 className="font-display text-xl sm:text-2xl tracking-widest">HOTEL PG</h3>
            <p className="text-xs text-white/60 font-serif">広島県尾道市因島土生町1896-8</p>
          </div>

          <div className="flex flex-wrap justify-center md:justify-end gap-6 sm:gap-8 text-[10px] sm:text-xs tracking-widest uppercase text-white/60">
            <Link href="/recruit" className="hover:text-white transition-colors">
              RECRUIT
            </Link>
            <Link href="/legal" className="hover:text-white transition-colors">
              LEGAL
            </Link>
            <Link href="/company" className="hover:text-white transition-colors">
              COMPANY
            </Link>
            <a
              href={INSTAGRAM_DM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Instagram
            </a>
            <Link href="/privacy" className="hover:text-white transition-colors">
              PRIVACY POLICY
            </Link>
            <span className="text-white/40">© HOTEL PG</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
