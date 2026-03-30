/**
 * JSON-LD structured data for SEO (Schema.org)
 * https://schema.org/
 */

import { SITE_URL, absoluteUrl } from '@/lib/site';

const defaultLogoUrl = absoluteUrl('/opengraph-image');

/** ホーム・全ページ共通: Organization + LodgingBusiness + WebSite */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}#organization`,
    name: 'HOTEL PG 因島',
    url: SITE_URL,
    logo: defaultLogoUrl,
    image: defaultLogoUrl,
    description: '因島観光・しまなみ海道の宿泊施設。瀬戸内海を望む大人向けの静かなホテル。',
    sameAs: ['https://www.instagram.com/hotel_pg_/'],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+81-70-8328-9154',
      contactType: 'customer service',
      areaServed: 'JP',
      availableLanguage: 'Japanese',
      hoursAvailable: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '09:00',
        closes: '20:00',
      },
    },
  };
}

/** ホテル・宿泊施設としての LocalBusiness (LodgingBusiness) */
export function getLodgingBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    '@id': `${SITE_URL}#lodging`,
    name: 'HOTEL PG 因島',
    url: SITE_URL,
    image: defaultLogoUrl,
    description: '因島観光・しまなみ海道の宿泊施設。瀬戸内海を望む大人向けの静かなホテル。カップル・一人旅に最適。',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '土生町1896-8',
      addressLocality: '尾道市',
      addressRegion: '広島県',
      postalCode: '722-2322',
      addressCountry: 'JP',
    },
    telephone: '+81-70-8328-9154',
    checkinTime: '15:00',
    checkoutTime: '10:00',
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Wi-Fi', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Parking', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Self check-in', value: true },
    ],
    containsPlace: [
      {
        '@type': 'Hotel',
        name: 'HOTEL PG -I-',
        description: '因島の宿泊施設',
      },
      {
        '@type': 'Hotel',
        name: 'HOTEL PG -II-',
        description: '因島の宿泊施設',
      },
    ],
    sameAs: ['https://www.instagram.com/hotel_pg_/'],
  };
}

/** WebSite スキーマ（サイト全体） */
export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}#website`,
    name: 'HOTEL PG 因島 公式サイト',
    url: SITE_URL,
    description: '因島のホテルPG｜しまなみ海道の宿・観光拠点に最適',
    publisher: { '@id': `${SITE_URL}#organization` },
    inLanguage: 'ja',
  };
}

/** FAQ スキーマ */
export function getFAQSchema(
  items: { question: string; answer: string }[]
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question' as const,
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: item.answer.replace(/\n/g, ' '),
      },
    })),
  };
}

/** ブログ記事の BlogPosting スキーマ */
export function getBlogPostingSchema({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  url,
}: {
  headline: string;
  description?: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  url: string;
}): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description: description ?? headline,
    url,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      '@type': 'Organization',
      name: 'HOTEL PG 因島',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'HOTEL PG 因島',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: defaultLogoUrl,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
  if (image) {
    schema.image = image.startsWith('http') ? image : `${SITE_URL}${image.replace(/^\//, '')}`;
  }
  return schema;
}

/** パンくずリスト スキーマ */
export function getBreadcrumbSchema(
  items: { name: string; url: string }[]
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem' as const,
      position: i + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url.replace(/^\//, '')}`,
    })),
  };
}
