'use client';

import React from 'react';
import { trackReservationClick } from '@/utils/analytics';

type Props = {
  href: string;
  roomSlug: string;
  className?: string;
};

export default function RakutenReserveButton({ href, roomSlug, className }: Props) {
  return (
    <a
      href={href}
      onClick={() => trackReservationClick(`rakuten_reserve:${roomSlug}`)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      楽天で予約をする
    </a>
  );
}

