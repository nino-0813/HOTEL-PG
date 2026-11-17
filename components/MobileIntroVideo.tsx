'use client';

import { useEffect, useRef } from 'react';
import { Youtube } from 'lucide-react';
import { HERO_IMAGE } from '../constants';

const INTRO_VIDEO = '/videos/hotel-pg-hero-desktop.mp4?v=20261106-2';

export default function MobileIntroVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => {
            // 端末側で自動再生が制限された場合はポスター表示のまま維持する
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.45 },
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, []);

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

        <div
          ref={containerRef}
          className="relative aspect-video overflow-hidden rounded-[18px] bg-black shadow-[0_14px_35px_rgba(17,29,35,0.16)]"
        >
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            muted
            loop
            playsInline
            preload="metadata"
            poster={HERO_IMAGE}
            aria-label="HOTEL PG紹介動画"
          >
            <source src={INTRO_VIDEO} type="video/mp4" />
          </video>
        </div>

        <a
          href="https://www.youtube.com/watch?v=dwRJIQyMgxQ"
          target="_blank"
          rel="noopener noreferrer"
          className="mx-auto mt-5 flex w-fit items-center justify-center text-[#777]/60 transition-colors hover:text-[#555]/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#777]/60"
          aria-label="YouTubeでホテル紹介動画を見る"
        >
          <Youtube size={21} strokeWidth={1.4} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
