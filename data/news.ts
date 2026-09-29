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
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '500円：トースト、ソーセージ' }] }] },
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '1,000円：和食または洋食' }] }] },
    ] },
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '朝食内容' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'どちらの朝食にも、お飲み物（コーヒー・紅茶・りんごジュースから1つ）が付きます。' }] },
    { type: 'bulletList', content: [
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '和食：白ご飯、具だくさんみそ汁、たまご焼き、昆布の佃煮（内容は変更になる場合がございます）' }] }] },
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '洋食：トースト、ゆでたまご、ソーセージ、ポトフ' }] }] },
    ] },
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'おかわり' }] },
    { type: 'paragraph', content: [{ type: 'text', text: '白ご飯・トースト・お飲み物は、それぞれ100円（税込）で追加いただけます。500円の朝食は、お飲み物のみ100円（税込）で追加いただけます。' }] },
    { type: 'horizontalRule' },
    { type: 'paragraph', content: [{ type: 'text', text: 'ご不明な点がございましたら、お気軽にスタッフまでお問い合わせください。今後とも変わらぬご愛顧を賜りますよう、お願い申し上げます。' }] },
  ],
};

// 初回公開時に表示する正式なお知らせです。管理画面の保存先が空の場合にも表示します。
export const sampleNews: NewsArticle[] = [
  {
    id: 'f345b1c4-a79f-4d83-8f68-63bdf9632054',
    slug: 'breakfast-price-revision-2026',
    date: '2026-09-29',
    category: '施設・サービス',
    tags: ['朝食', '料金改定'],
    title: '朝食料金改定のご案内',
    image: '/images/gallery/82dfe2c3189024a50b197d92a5436f68492ab111.47.9.26.3.webp',
    body: NEWS_BODY_PREFIX + JSON.stringify(breakfastBody),
    published: true,
    updatedAt: '2026-09-29T12:00:00.000Z',
  },
];
