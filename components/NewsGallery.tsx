'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

export default function NewsGallery({ images, title }: { images: readonly string[]; title: string }) {
  const track = useRef<HTMLDivElement>(null);
  const move = (direction: -1 | 1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.88, behavior: 'smooth' });
  };

  return (
    <section aria-label={`${title}の写真`} className="relative">
      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-3 [scrollbar-width:thin]"
      >
        {images.map((src, index) => (
          <figure key={src} className="relative aspect-[4/3] w-[92%] shrink-0 snap-start overflow-hidden bg-white sm:w-[86%]">
            <img
              src={src}
              alt={index < 7 ? `朝食メニュー ${index + 1}` : `ダイニング店内 ${index - 6}`}
              loading={index === 0 ? 'eager' : 'lazy'}
              className="h-full w-full object-cover"
            />
            <figcaption className="absolute bottom-3 right-3 bg-black/55 px-3 py-1 font-body text-xs tracking-wider text-white">
              {index + 1} / {images.length}
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <p className="font-serif text-xs tracking-wider text-textLight">横にスライドして写真をご覧いただけます</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => move(-1)} aria-label="前の写真" className="grid h-11 w-11 place-items-center rounded-full border border-divider bg-white transition hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => move(1)} aria-label="次の写真" className="grid h-11 w-11 place-items-center rounded-full border border-divider bg-white transition hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
