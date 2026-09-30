'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

type Props = {
  measurementId: string;
};

/** 管理画面とログイン画面を除外してGA4を読み込む。 */
export default function GoogleAnalytics({ measurementId }: Props) {
  const pathname = usePathname();
  const isInternalPage = pathname.startsWith('/admin') || pathname.startsWith('/auth');

  if (isInternalPage) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
