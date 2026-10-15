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

const oyamaShrineTrafficBody = {
  type: 'doc',
  content: [
    { type: 'paragraph', content: [{ type: 'text', text: 'いつもHOTEL PGをご利用いただき、誠にありがとうございます。' }] },
    { type: 'paragraph', content: [{ type: 'text', text: '2026年10月18日（日）に開催される「土生町秋まつり」に伴い、当館周辺の大山神社前において交通規制（通行止め）が実施されます。お車でお越しのお客様は、時間に余裕をもってお越しいただき、通行には十分ご注意ください。' }] },
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '交通規制の概要' }] },
    { type: 'bulletList', content: [
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '日時：2026年10月18日（日）17:00～21:00' }] }] },
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '規制区間：大山神社前' }] }] },
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '影響：対象区間は車両通行不可となります' }] }] },
    ] },
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '迂回のお願い' }] },
    { type: 'paragraph', content: [{ type: 'text', text: '「芸予文化情報センター入口」または「市民会館入口」からの迂回ルートをご利用ください。' }] },
    { type: 'horizontalRule' },
    { type: 'paragraph', content: [{ type: 'text', text: 'お客様にはご不便をおかけいたしますが、安全確保と円滑な通行のため、ご理解とご協力をお願い申し上げます。' }] },
    { type: 'paragraph', content: [{ type: 'text', text: '合同会社ルノア / HOTEL PG' }] },
  ],
};

const cyclingShimanamiTrafficBody = {
  type: 'doc',
  content: [
    { type: 'paragraph', content: [{ type: 'text', text: '平素よりHOTEL PGをご愛顧いただき、誠にありがとうございます。' }] },
    { type: 'paragraph', content: [{ type: 'text', text: '2026年10月25日（日）に国際サイクリング大会「サイクリングしまなみ2026」が開催されます。当日は、しまなみ海道（高速道路）の本線において大規模な通行止めが実施されます。お車やバスで移動予定のお客様は、規制時間や周辺道路の混雑に十分ご注意ください。' }] },
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '高速道路の通行止め' }] },
    { type: 'bulletList', content: [
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '尾道大橋出入口 ⇔ 因島北IC（上下線）：6:00～10:00' }] }] },
      { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '今治IC ⇔ 因島北IC（上下線）：6:00～12:40' }] }] },
    ] },
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '因島内をお車で移動されるお客様へ' }] },
    { type: 'paragraph', content: [{ type: 'text', text: '大会前後および交通規制の解除に伴い、因島内の一般道ではサイクリストの通行が急増します。特に10:00～14:00は自転車の交通量が非常に多くなる見込みです。スピードを落とし、自転車との車間距離を十分に取って、安全運転をお願いいたします。' }] },
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '公共交通をご利用のお客様へ' }] },
    { type: 'paragraph', content: [{ type: 'text', text: '路線バス・高速バスは、一部運休やルート変更が予定されています。最新の運行情報をご確認のうえ、時間に余裕をもってお出かけください。' }] },
    { type: 'paragraph', content: [
      { type: 'text', text: '大会の詳細は、' },
      { type: 'text', marks: [{ type: 'link', attrs: { href: 'https://cycling-shimanami.jp/' } }], text: 'サイクリングしまなみ2026公式サイト' },
      { type: 'text', text: 'をご確認ください。' },
    ] },
    { type: 'horizontalRule' },
    { type: 'paragraph', content: [{ type: 'text', text: 'お客様にはご不便をおかけいたしますが、安全確保のため、ご理解とご協力をお願い申し上げます。' }] },
    { type: 'paragraph', content: [{ type: 'text', text: '合同会社ルノア / HOTEL PG' }] },
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
    id: '7bfc35af-0838-4b54-a01e-43d3d006fddd',
    slug: 'oyama-shrine-traffic-restrictions-2026',
    date: '2026-10-15',
    category: '周辺情報',
    tags: ['交通規制', '土生町秋まつり', '因島'],
    title: '10月18日（日）大山神社周辺の交通規制（通行止め）に伴う迂回のお願い',
    image: '',
    body: NEWS_BODY_PREFIX + JSON.stringify(oyamaShrineTrafficBody),
    published: true,
    updatedAt: '2026-10-15T03:30:00.000Z',
  },
  {
    id: '722f7a04-c614-4d86-8452-2f225bf08282',
    slug: 'cycling-shimanami-2026-traffic-restrictions',
    date: '2026-10-15',
    category: '周辺情報',
    tags: ['交通規制', 'サイクリングしまなみ2026', '因島'],
    title: '【重要】10月25日（日）しまなみ海道の交通規制および安全運転へのお願い',
    image: '/blog/blog-cycling-hero.webp',
    body: NEWS_BODY_PREFIX + JSON.stringify(cyclingShimanamiTrafficBody),
    published: true,
    updatedAt: '2026-10-15T03:20:00.000Z',
  },
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
