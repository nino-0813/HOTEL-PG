'use client';

import { useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { HERO_IMAGE } from '../constants';

const INTRO_VIDEO = '/videos/hotel-pg-hero-desktop.mp4?v=20261106-2';

export default function MobileIntroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const startVideo = async () => {
    setHasStarted(true);
    try {
      await videoRef.current?.play();
    } catch {
      setHasStarted(false);
    }
  };

  return (
    <section aria-labelledby="intro-video-heading" className="bg-background px-5 pb-9 pt-7 md:hidden">
      <div className="mx-auto max-w-md">
        <div className="mb-5 flex items-center justify-center gap-4">
          <span className="h-px w-9 bg-[#b69a5a]/65" aria-hidden="true" />
          <h2
            id="intro-video-heading"
            className="font-serif text-lg font-medium tracking-[0.16em] text-textMain"
          >
            ホテル紹介動画
          </h2>
          <span className="h-px w-9 bg-[#b69a5a]/65" aria-hidden="true" />
        </div>

        <div className="relative aspect-video overflow-hidden rounded-[18px] bg-black shadow-[0_14px_35px_rgba(17,29,35,0.16)]">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            controls={hasStarted}
            playsInline
            preload="metadata"
            poster={HERO_IMAGE}
            onEnded={() => setHasStarted(false)}
          >
            <source src={INTRO_VIDEO} type="video/mp4" />
          </video>

          {!hasStarted && (
            <button
              type="button"
              onClick={startVideo}
              className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              aria-label="ホテル紹介動画を再生"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/90 bg-black/35 text-white shadow-lg backdrop-blur-sm">
                <Play className="ml-1" size={28} fill="currentColor" strokeWidth={1.2} aria-hidden="true" />
              </span>
            </button>
          )}

          {!hasStarted && (
            <span className="pointer-events-none absolute bottom-3 right-3 rounded bg-black/70 px-2 py-1 font-sans text-[11px] tracking-wide text-white">
              1:20
            </span>
          )}
        </div>

        <p className="mt-4 text-center font-serif text-[12px] leading-6 tracking-[0.06em] text-textLight">
          HOTEL PGの魅力を、映像でご紹介します。
        </p>
      </div>
    </section>
  );
}
