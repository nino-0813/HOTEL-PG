import type { NewsArticle } from '@/lib/news';
import { NEWS_BODY_PREFIX } from '@/lib/news-body';

const breakfastBody = {
  type: 'doc',
  content: [
    { type: 'paragraph', content: [{ type: 'text', text: '平素よりHOTEL PGをご愛顧いただき、誠にありがとうございます。' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'このたび、2026年10月1日（木）のご朝食より、朝食料金と内容を改定いたします。これまで以上にご満足いただけるお食事とサービスの提供に努めてまいりますので、何卒ご理解賜りますようお願い申し上げます。' }] },
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '改定日' }] },
    { type: 'paragraph', content: [{ type: 'text', text: '2026年10月1日（木）のご朝食より' }] },
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '改定後の料金（税込）' }] },
    { type: 'bulletList', content: [
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '500円：厚切りトースト、ソーセージ' }] }] },
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '1,000円：和食または洋食' }] }] },
    ] },
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '朝食内容' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'どちらの朝食にも、お飲み物（コーヒー・紅茶・りんごジュースから1つ）が付きます。' }] },
    { type: 'bulletList', content: [
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '和食：白ご飯、具だくさんみそ汁、たまご焼き、昆布の佃煮（内容は変更になる場合がございます）' }] }] },
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '洋食：厚切りトースト、ゆでたまご、ソーセージ、ポトフ' }] }] },
    ] },
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'おかわり' }] },
    { type: 'paragraph', content: [{ type: 'text', text: '白ご飯・厚切りトースト・お飲み物は、それぞれ100円（税込）で追加いただけます。500円の朝食は、お飲み物のみ100円（税込）で追加いただけます。' }] },
    { type: 'horizontalRule' },
    { type: 'paragraph', content: [{ type: 'text', text: 'ご不明な点がございましたら、お気軽にスタッフまでお問い合わせください。今後とも変わらぬご愛顧を賜りますよう、お願い申し上げます。' }] },
  ],
};

const breakfastHolidayBody = {
  type: 'doc',
  content: [
    { type: 'paragraph', content: [{ type: 'text', text: '平素よりHOTEL PGをご愛顧いただき、誠にありがとうございます。' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'このたび、朝食提供会場としてご案内しておりましたアゲハ食堂に定休日を設けることとなりました。ご不便をおかけいたしますが、何卒ご理解賜りますようお願い申し上げます。' }] },
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '改定日' }] },
    { type: 'paragraph', content: [{ type: 'text', text: '2026年10月1日（木）のご朝食より、当面の間' }] },
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '定休日' }] },
    { type: 'paragraph', content: [{ type: 'text', text: '月曜日（祝日の場合は火曜日）' }] },
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '定休日の朝食提供方法' }] },
    { type: 'paragraph', content: [{ type: 'text', text: '定休日の前日にアゲハ食堂スタッフが朝食用のお弁当を準備し、お部屋の冷蔵庫にお入れいたします。' }] },
    { type: 'horizontalRule' },
    { type: 'paragraph', content: [{ type: 'text', text: '本件につきましてご不明な点がございましたら、お気軽にフロントスタッフまでお問い合わせください。今後とも変わらぬご愛顧を賜りますよう、お願い申し上げます。' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'HOTEL PG' }] },
  ],
};

export const BREAKFAST_GALLERY_IMAGES = [
  '/news/breakfast-2026/IMG_4283.webp',
  '/news/breakfast-2026/IMG_4201.webp',
  '/news/breakfast-2026/IMG_4222.webp',
  '/news/breakfast-2026/IMG_4230.webp',
  '/news/breakfast-2026/IMG_4263.webp',
  '/news/breakfast-2026/IMG_4271.webp',
  '/news/breakfast-2026/IMG_4275.webp',
  '/news/breakfast-2026/IMG_4285.webp',
  '/news/breakfast-2026/IMG_4287.webp',
  '/news/breakfast-2026/IMG_4288.webp',
] as const;

// 初回公開時に表示する正式なお知らせです。管理画面の保存先が空の場合にも表示します。
export const sampleNews: NewsArticle[] = [
  {
    id: 'b65f9b08-9153-4f66-a5cb-7654ac6ce54d',
    slug: 'ageha-breakfast-holiday-2026',
    date: '2026-09-30',
    category: '施設・サービス',
    tags: ['朝食', 'アゲハ食堂'],
    title: 'アゲハ食堂 定休日設定のお知らせ',
    image: '/news/breakfast-2026/IMG_4263.webp',
    body: NEWS_BODY_PREFIX + JSON.stringify(breakfastHolidayBody),
    published: true,
    updatedAt: '2026-09-30T03:00:00.000Z',
  },
  {
    id: 'f345b1c4-a79f-4d83-8f68-63bdf9632054',
    slug: 'breakfast-price-revision-2026',
    date: '2026-09-29',
    category: '施設・サービス',
    tags: ['朝食', '料金改定'],
    title: '朝食料金改定のご案内',
    image: BREAKFAST_GALLERY_IMAGES[0],
    body: NEWS_BODY_PREFIX + JSON.stringify(breakfastBody),
    published: true,
    updatedAt: '2026-09-29T12:00:00.000Z',
  },
];
