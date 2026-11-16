import Image from 'next/image';

type BrandLogoProps = {
  className?: string;
  sizes?: string;
  priority?: boolean;
  alt?: string;
};

const LOGO_PATH = '/images/brand/hotel-pg-logo.png';

export default function BrandLogo({
  className = 'h-10 w-10',
  sizes = '40px',
  priority = false,
  alt = 'HOTEL PG',
}: BrandLogoProps) {
  return (
    <span className={`relative block shrink-0 overflow-hidden bg-white ${className}`}>
      <Image
        src={LOGO_PATH}
        alt={alt}
        fill
        sizes={sizes}
        className="object-contain"
        priority={priority}
      />
    </span>
  );
}
