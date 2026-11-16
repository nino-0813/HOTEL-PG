'use client';

import { useState } from 'react';
import BrandLogo from './BrandLogo';

export default function NewsImage({ src, alt = '' }: { src?: string; alt?: string; sizes?: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
      {src && failedSrc !== src ? <img src={src} alt={alt} loading="lazy" onError={() => setFailedSrc(src)} className="h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.03]" /> : (
        <div className="flex h-full flex-col items-center justify-center border border-divider/50 text-textMain">
          <BrandLogo className="h-24 w-24 sm:h-28 sm:w-28" sizes="112px" />
          <span className="mt-3 font-body text-[10px] tracking-[0.3em] text-textLight">INNOSHIMA, HIROSHIMA</span>
        </div>
      )}
    </div>
  );
}
