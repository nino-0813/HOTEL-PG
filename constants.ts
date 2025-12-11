import { NavItem, NewsItem, SectionContent } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'Concept', href: '#concept' },
  { label: 'Rooms', href: '#rooms' },
  { label: 'Dining', href: '#dining' },
  { label: 'Activity', href: '#activity' },
  { label: 'Access', href: '#access' },
  { label: 'Reserve', href: '#reserve' },
];

export const NEWS_ITEMS: NewsItem[] = [
  { date: '2025.10.15', title: '【期間限定】瀬戸内の冬を味わう、蟹と柑橘の特別コース', href: '#' },
  { date: '2025.09.20', title: 'しまなみ海道サイクリングサポートプランの開始', href: '#' },
  { date: '2025.08.01', title: 'HOTEL PG - INNOSHIMA - グランドオープンのお知らせ', href: '#' },
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
      '/images/hero/9c5f3db7fb9775e6024e61d0162738da919bfda1.47.9.26.3.jpg',
      // 光の差し込む静かな空間
      'https://images.unsplash.com/photo-1595820849301-49658b1e4b95?q=80&w=1200&auto=format&fit=crop'
    ]
  },
  rooms: {
    title: 'Rooms',
    subtitle: '海と空に溶け込む、全室オーシャンビュー',
    description: [
      'わずか5室の客室は、すべて海に面したスイートルーム。',
      '窓を開ければ、しまなみの風が通り抜け、',
      'テラスに出れば、手が届きそうな星空が広がります。',
      'インテリアには、尾道の帆布や因島の除虫菊など、',
      '地域の素材をモダンにアレンジ。',
      '時間を忘れて、ただ海を眺めるための特等席です。'
    ],
    images: [
      // ミニマルでモダンな客室、窓から海
      '/images/gallery/3b28601b853b111ff30dfbe827b53f76e3b7ad52.47.9.26.3.jpg',
      // バスルームやテラス
      'https://images.unsplash.com/photo-1606744888344-4932389566b1?q=80&w=1200&auto=format&fit=crop'
    ]
  },
  dining: {
    title: 'Dining',
    subtitle: '瀬戸内の恵みを、皿の上に描く',
    description: [
      '因島の「八朔（はっさく）」や「レモン」、',
      'そして瀬戸内の急流で育った豊かな魚介類。',
      '半径50km圏内の食材にこだわり、',
      '素材の味を極限まで引き出したイノベーティブ・フレンチ。',
      '料理に合わせてセレクトした瀬戸内のワインや日本酒と共に、',
      '五感で味わう至福のひとときを。'
    ],
    images: [
      // 洗練された料理
      '/images/gallery/82dfe2c3189024a50b197d92a5436f68492ab111.47.9.26.3.jpg',
      // レストランの雰囲気、オープンキッチン
      'https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?q=80&w=1200&auto=format&fit=crop'
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
      'https://images.unsplash.com/photo-1548261314-9989f66085a8?q=80&w=1200&auto=format&fit=crop'
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
