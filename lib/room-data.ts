export type RoomSlug = 'pg1' | 'pg2-single' | 'pg2-family';
export type CheckoutRoomKey = 'pg1' | 'pg2_single' | 'pg2_family';

export type RoomDetail = {
  slug: RoomSlug;
  checkoutRoom: CheckoutRoomKey;
  name: string;
  subtitle: string;
  address: string;
  checkin: string;
  checkout: string;
  parking: string;
  phone: string;
  priceSummary: { weekday: number; weekend: number; weekendRule: string; extraPerson?: string };
  amenities: string[];
  images: string[];
};

export const ROOMS: Record<RoomSlug, RoomDetail> = {
  pg1: {
    slug: 'pg1',
    checkoutRoom: 'pg1',
    name: 'HOTEL PG -Ⅰ-',
    subtitle: '【素泊まり】ロフト付き洋室',
    address: '尾道市因島土生町1896-17',
    checkin: '15:00〜20:00',
    checkout: '〜10:00',
    parking: '無料あり',
    phone: '070-8328-9154',
    priceSummary: {
      weekday: 8000,
      weekend: 8000,
      weekendRule: '金・土・日',
      extraPerson: '2人目から +¥5,000/人',
    },
    amenities: [
      '駐車場',
      '共同キッチン・調理器具',
      '食器',
      '洗濯機',
      '乾燥機',
      '電子レンジ',
      'エアコン',
      'テレビ',
      'Wi-Fi',
      '冷蔵庫',
      'ドライヤー',
      'アイロン',
      'シャンプー',
      '歯磨きセット',
      'シャワールーム（共用）',
      'トイレ（共用）',
    ],
    images: [
      '/images/gallery/DSC04510.webp',
      '/images/gallery/DSC04514.webp',
      '/images/gallery/DSC04542.webp',
      '/images/gallery/DSC04613.webp',
    ],
  },
  'pg2-single': {
    slug: 'pg2-single',
    checkoutRoom: 'pg2_single',
    name: 'HOTEL PG -Ⅱ-',
    subtitle: 'シングルタイプ',
    address: '尾道市因島土生町1896-8',
    checkin: '15:00〜17:00',
    checkout: '〜10:00',
    parking: '無料あり',
    phone: '070-8328-9154',
    priceSummary: {
      weekday: 8000,
      weekend: 12000,
      weekendRule: '金・土（※日曜なし）',
    },
    amenities: [
      '駐車場',
      'キッチン',
      '調理器具',
      '食器',
      '洗濯機',
      '電子レンジ',
      'エアコン',
      'テレビ',
      '有線LAN + Wi-Fi',
      '冷蔵庫',
      'ドライヤー',
      'シャンプー',
      '歯磨きセット',
    ],
    images: [
      '/images/gallery/DSC04480.webp',
      '/images/gallery/DSC04487.webp',
      '/images/gallery/DSC04494.webp',
      '/images/gallery/DSC04605.webp',
    ],
  },
  'pg2-family': {
    slug: 'pg2-family',
    checkoutRoom: 'pg2_family',
    name: 'HOTEL PG -Ⅱ-',
    subtitle: 'ファミリータイプ',
    address: '尾道市因島土生町1896-8',
    checkin: '15:00〜17:00',
    checkout: '〜10:00',
    parking: '無料あり',
    phone: '070-8328-9154',
    priceSummary: {
      weekday: 14000,
      weekend: 18000,
      weekendRule: '金・土（※日曜なし）',
      extraPerson: '3人目から +¥5,000/人',
    },
    amenities: [
      '（同一建物のため、シングルタイプと共通）',
    ],
    images: [
      '/images/gallery/DSC04467.webp',
      '/images/gallery/DSC04555.webp',
      '/images/gallery/DSC04581.webp',
      '/images/gallery/DSC04622.webp',
    ],
  },
};

