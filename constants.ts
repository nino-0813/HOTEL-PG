import { NavItem, NewsItem, SectionContent } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'Concept', href: '#concept' },
  { label: 'Rooms', href: '#rooms' },
  { label: 'Dining', href: '#dining' },
  { label: 'Activity', href: '#activity' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Reservation', href: '#reservation' },
  { label: 'Hotels', href: '#hotels' },
  { label: 'News', href: '#news' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

export const NEWS_ITEMS: NewsItem[] = [
  { date: '2025.10.15', title: '因島の秋を楽しむ、おばんざいアゲハ食堂とのコラボレーション', href: '#' },
  { date: '2025.09.20', title: 'しまなみ海道サイクリングのお客様向け、自転車預かりサービス開始', href: '#' },
  { date: '2025.12.10', title: 'HOTEL PG -III- 新築完成予定。最新の設備と洗練されたデザインで、新しい滞在体験を。', href: '#hotels' },
];

export const CONTENT = {
  concept: {
    title: 'Concept',
    subtitle: '凪の水面に、心を浮かべる',
    description: [
      '瀬戸内海、因島。',
      'かつて村上海賊が駆け巡ったこの海は今、',
      '世界で最も穏やかな表情を見せる場所のひとつです。',
      '「HOTEL PG」は、そんな瀬戸内の',
      '移ろいゆく水面（みなも）をテーマにした隠れ家リゾート。',
      '聞こえるのは、波の音と、鳥のさえずり、',
      'そして、あなた自身の心の声だけ。',
      '何もしない贅沢を、ここ因島で。'
    ],
    images: [
      // 穏やかな瀬戸内海、抽象的な水面
      '/images/gallery/DSC04519.png',
      // 光の差し込む静かな空間
      '/images/gallery/DSC04542.png'
    ]
  },
  rooms: {
    title: 'Rooms',
    subtitle: '因島に佇む、静かな時間の器',
    description: [
      '瀬戸内海に浮かぶ因島。',
      'この島で生まれ、この島で育まれる時間があります。',
      'HOTEL PGの客室は、因島の空気を感じ、',
      '島のリズムに合わせて過ごすための空間。',
      'インテリアには、尾道の帆布や因島の除虫菊など、',
      '地域の素材をモダンにアレンジ。',
      '窓を開ければ、しまなみの風が通り抜け、',
      '因島の日常が、あなたの時間に溶け込みます。'
    ],
    images: [
      // ミニマルでモダンな客室、窓から海
      '/images/gallery/3b28601b853b111ff30dfbe827b53f76e3b7ad52.47.9.26.3.jpg',
      // バスルームやテラス
      '/images/gallery/DSC04635.png'
    ]
  },
  dining: {
    title: 'Dining',
    subtitle: '瀬戸内の恵みを、皿の上に描く',
    description: [
      '自然と季節が奏でる、小鉢のひと皿ひと皿。',
      'からだが喜ぶ、美しい調和を。',
      '健やかさの源は、穏やかな島の自然に宿る。',
      'おばんざいアゲハ食堂で、因島の旬をごゆっくり。'
    ],
    images: [
      // 洗練された料理
      '/images/gallery/82dfe2c3189024a50b197d92a5436f68492ab111.47.9.26.3.jpg',
      // レストランの雰囲気、オープンキッチン
      '/images/gallery/DSC04480.png'
    ]
  },
  activity: {
    title: 'Activity',
    subtitle: '島のリズムに、呼吸を合わせる',
    description: [
      '世界中のサイクリストが憧れる「しまなみ海道」を走る、',
      'プライベートガイド付きのサイクリングツアー。',
      '瀬戸内の島々を巡るサンセットクルーズ。',
      'あるいは、早朝のビーチヨガで身体を目覚めさせる。',
      'アクティブに楽しむもよし、静かに過ごすもよし。',
      '因島の自然が、あなたの感性を解き放ちます。'
    ],
    images: [
      // サイクリングやしまなみ海道
      '/images/gallery/shimanami-kaidou-route_thumb.webp',
      // 瀬戸内海の風景
      '/images/gallery/スクリーンショット 2025-12-16 16.33.58.png'
    ]
  }
};

// Hero Image: ローカル画像を使用
export const HERO_IMAGE = "/images/hero/innnoshima1-1280.jpg";

// Parallax Textures
// Image 1: 水面、波紋
export const PARALLAX_IMAGE_1 = "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=2560&auto=format&fit=crop";
// Image 2: 柑橘の葉、あるいは石垣のテクスチャ
export const PARALLAX_IMAGE_2 = "https://images.unsplash.com/photo-1627664817452-f61109a06657?q=80&w=2560&auto=format&fit=crop";

// Footer CTA: 夕暮れの瀬戸内海 - よりドラマチックで落ち着いたトーン
export const CTA_IMAGE = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2560&auto=format&fit=crop";
