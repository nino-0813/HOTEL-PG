export type RoomSlug = 'pg1' | 'pg2-single' | 'pg2-family' | 'pg3';
export type CheckoutRoomKey = 'pg1' | 'pg2_single' | 'pg2_family' | 'pg3';

export type RoomDetail = {
  slug: RoomSlug;
  checkoutRoom: CheckoutRoomKey;
  name: string;
  subtitle: string;
  address: string;
  mapLabel?: string;
  facts?: { label: string; value: string }[];
  plan?: { title: string; description: string[] };
  about?: string[];
  notes?: string[];
  bedTypes?: string[];
  houseRules?: { label: string; value: string }[];
  cancellationPolicy?: string[];
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
    mapLabel: 'HOTEL PG -Ⅰ-',
    facts: [
      { label: '個室', value: '個室' },
      { label: '人数', value: '1〜2名' },
      { label: '寝室', value: '寝室 1' },
      { label: '寝具', value: '寝具 2' },
      { label: '浴室', value: '共用浴室' },
      { label: '広さ', value: '10.28㎡' },
    ],
    plan: {
      title: '【素泊まりプラン】',
      description: [
        'シャワールーム（共用）・トイレ（共用）付き。',
        '共同キッチン・調理器具を完備しておりますので、自炊も可能です。',
      ],
    },
    about: [
      '瀬戸内海に浮かぶ因島にあるOPENしたてのホテルです。',
      '海沿いに位置しており、観光やサイクリングもお楽しみいただけます。因島の魅力を存分に感じていただくことができます。',
      'HOTEL PG III 2026年5月完成予定！お問い合わせ、お待ちしております。',
      '※当ホテルはフロントを設けておらず、セルフチェックイン方式を採用しております。スタッフは常駐しておりませんが、お困りの際は電話・メッセージにてサポートいたします。',
    ],
    notes: [
      '当ホテルは分煙を行っております。喫煙は指定の喫煙場所のみ可能です。',
      '客室内を含む指定場所以外での喫煙が確認された場合は、特別清掃費（消臭作業を含む）として10万円を申し受けます。',
    ],
    bedTypes: ['ソファベッド 1', 'ダブル 1'],
    houseRules: [
      { label: 'ペット', value: 'いいえ' },
      { label: '喫煙', value: 'いいえ' },
      { label: 'イベント&パーティ', value: 'いいえ' },
    ],
    cancellationPolicy: [
      'チェックイン5日前まではキャンセル無料',
      'チェックイン4日前〜当日：合計料金の100%',
      '連絡なし不泊：合計料金の100%',
    ],
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
      '/hotel1/スクリーンショット 2025-12-15 0.30.00.webp',
      '/hotel1/スクリーンショット 2025-12-15 0.30.12.webp',
      '/hotel1/スクリーンショット 2025-12-15 0.30.20.webp',
      '/hotel1/スクリーンショット 2025-12-15 0.30.32.webp',
      '/hotel1/スクリーンショット 2025-12-15 0.30.41.webp',
      '/hotel1/スクリーンショット 2025-12-15 0.30.53.webp',
      '/hotel1/スクリーンショット 2025-12-15 0.31.02.webp',
    ],
  },
  'pg2-single': {
    slug: 'pg2-single',
    checkoutRoom: 'pg2_single',
    name: 'HOTEL PG -Ⅱ-',
    subtitle: 'シングルタイプ',
    address: '尾道市因島土生町1896-8',
    mapLabel: 'HOTEL PG -Ⅱ-',
    facts: [
      { label: '個室', value: '個室' },
      { label: '人数', value: '1名' },
      { label: '寝室', value: '寝室 1' },
      { label: '寝具', value: '寝具 1' },
      { label: '浴室', value: '浴室 1' },
      { label: '広さ', value: '20㎡' },
    ],
    plan: {
      title: '',
      description: [
        'バス・トイレ別、洗面台付き。ワンルームタイプ。',
        'キッチンに調理器具、食器を完備。',
        '隣接する「おばんざいアゲハ食堂」で、温かい手作りのご朝食を有料にてお召し上がりいただけます。（※水曜・日曜日定休）',
      ],
    },
    about: [
      '瀬戸内海に浮かぶ因島にあるOPENしたてのホテルです。',
      '海沿いに位置しており、観光やサイクリングもお楽しみいただけます。因島の魅力を存分に感じていただくことができます。',
      'お一人でのご利用やカップル、ファミリーでもご利用いただけるよう、様々なお部屋をご用意しております。',
      'HOTEL PG III 2026年5月完成予定！お問い合わせ、お待ちしております。',
      '※当ホテルはフロントを設けておらず、セルフチェックイン方式でご案内しております。ご到着後は、キーボックスからお部屋の鍵をお受け取りいただけます。',
    ],
    bedTypes: ['シングル 1'],
    houseRules: [
      { label: 'ペット', value: 'いいえ' },
      { label: '喫煙', value: 'いいえ' },
      { label: 'イベント&パーティ', value: 'いいえ' },
    ],
    cancellationPolicy: [
      'チェックイン5日前まではキャンセル無料',
      'チェックイン4日前〜当日：合計料金の100%',
      '連絡なし不泊：合計料金の100%',
    ],
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
      '/hotel2/single/DSC04628.webp',
      '/hotel2/single/DSC04635.webp',
      '/images/gallery/DSC04605.webp',
      '/images/gallery/スクリーンショット 2025-12-15 0.28.56.webp',
    ],
  },
  'pg2-family': {
    slug: 'pg2-family',
    checkoutRoom: 'pg2_family',
    name: 'HOTEL PG -Ⅱ-',
    subtitle: 'ファミリータイプ',
    address: '尾道市因島土生町1896-8',
    mapLabel: 'HOTEL PG -Ⅱ-',
    facts: [
      { label: '個室', value: '個室' },
      { label: '人数', value: '1〜4名' },
      { label: '寝室', value: '寝室 1' },
      { label: '寝具', value: '寝具 4' },
      { label: '浴室', value: '浴室 1' },
      { label: '広さ', value: '32㎡' },
    ],
    plan: {
      title: '',
      description: [
        'バス・トイレ別、洗面台付き。',
        'ベッドルームとリビングスペースが分かれております。',
        'キッチンに調理器具、食器を完備。',
        '隣接する「おばんざいアゲハ食堂」で、朝食を有料にてお召し上がりいただけます。（※水曜・日曜日定休）',
      ],
    },
    about: [
      '瀬戸内海に浮かぶ因島にあるOPENしたてのホテルです。',
      '海沿いに位置しており、観光やサイクリングもお楽しみいただけます。因島の魅力を存分に感じていただくことができます。',
      'お一人でのご利用やカップル、ファミリーでもご利用いただけるよう、様々なお部屋をご用意しております。',
      'HOTEL PG III 2026年5月完成予定！お問い合わせ、お待ちしております。',
      '※当ホテルはフロントを設けておらず、セルフチェックイン方式でご案内しております。ご到着後は、キーボックスからお部屋の鍵をお受け取りいただけます。',
    ],
    bedTypes: ['シングル 2', 'ソファベッド 1', '布団/床用マットレス 1'],
    houseRules: [
      { label: 'ペット', value: 'いいえ' },
      { label: '喫煙', value: 'いいえ' },
      { label: 'イベント&パーティ', value: 'いいえ' },
    ],
    cancellationPolicy: [
      'チェックイン5日前まではキャンセル無料',
      'チェックイン4日前〜当日：合計料金の100%',
      '連絡なし不泊：合計料金の100%',
    ],
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
      '/hotel2/famiri/DSC04581.webp',
      '/images/gallery/DSC04573.webp',
      '/hotel2/famiri/DSC04566.webp',
      '/hotel2/famiri/DSC04591.webp',
      '/hotel2/famiri/DSC04593.webp',
      '/hotel2/famiri/DSC04576.webp',
      '/images/gallery/DSC04605.webp',
    ],
  },
  pg3: {
    slug: 'pg3',
    checkoutRoom: 'pg3',
    name: 'HOTEL PG -Ⅲ-',
    subtitle: '【OPEN記念価格】2名利用でお得｜和モダン客室｜最大3名｜無料駐車場｜長期滞在歓迎',
    address: '広島県尾道市因島土生町1747-5',
    mapLabel: 'HOTEL PGⅢ',
    facts: [
      { label: '個室', value: '個室' },
      { label: '人数', value: '1〜3名' },
      { label: '寝室', value: '寝室 1' },
      { label: '寝具', value: '寝具 3' },
      { label: '浴室', value: '浴室 1' },
      { label: '広さ', value: '29.81㎡' },
    ],
    plan: {
      title: '詳細',
      description: [
        '和モダンデザインの落ち着いた客室で、最大3名様までご利用いただけます。全室バス・トイレ付きで、観光・出張どちらにも快適にお過ごしいただけます。',
        '無料駐車場を完備しており、普通車はもちろんマイクロバスも駐車可能です。団体様や工事関係・企業様の長期滞在にも最適です。',
        '館内には共用の洗濯機・ガス乾燥機を完備しており、連泊や長期宿泊にも便利です。尾道観光の拠点としてもご利用ください。',
      ],
    },
    notes: [
      '当プランは2名様利用時がお得な料金設定となっております。1名様でのご利用も可能です。',
    ],
    about: [
      '全11室の小規模ホテル。全室バス・トイレ付でゆったりご利用いただけます。',
      '洗濯機、ガス乾燥機、調理器具もあり、長期滞在も可能！',
      '無料駐車場完備で普通車はもちろん、マイクロバスの駐車も可能です。',
      '3名利用可能なお部屋を中心に、和モダン空間にベッドのあるお部屋（最大4名）やメゾネットタイプ（最大4名）も1室ご用意。',
      '出張・観光・サイクリストの拠点としても便利です。',
      'セルフチェックイン対応のため、到着時間を気にせずご利用いただけます。',
    ],
    bedTypes: ['布団/床用マットレス 2', 'ソファベッド 1'],
    amenities: [
      '暖房設備',
      '駐車場込み',
      'WIFIネット接続',
      'インターネット',
      'ネット動画配信サービス',
      '必需品 タオル、シーツ、石鹸、トイレットペーパー',
      '洗剤',
      'ソープ',
      '歯ブラシ',
      'シャンプー',
      '調理器具',
      '食器',
      '机・ワークスペース',
      'ヘアドライヤー',
      '洗濯機',
      '乾燥機',
      '冷蔵庫',
      '電子レンジ',
      'TV',
      '窓あり',
      '畳',
      'キッチン',
      'コンロ',
      'エアコン',
    ],
    houseRules: [
      { label: 'ペットOK', value: 'いいえ' },
      { label: '喫煙OK', value: 'いいえ' },
      { label: 'イベント&パーティOK', value: 'はい' },
      { label: '団体様での貸切可能', value: 'はい' },
    ],
    cancellationPolicy: [
      'チェックイン5日前まではキャンセル無料',
      'チェックイン4日前 - 当日合計料金の100%',
    ],
    checkin: '15:00〜18:00',
    checkout: '〜10:00',
    parking: '無料駐車場完備（マイクロバス可）',
    phone: '070-8328-9154',
    priceSummary: {
      weekday: 24500,
      weekend: 28500,
      weekendRule: '金・土（※日曜は平日料金）',
      extraPerson: '1名追加ごとに +¥5,000/泊',
    },
    images: [
      '/hotel3/pg3-room-01.webp',
      '/hotel3/pg3-room-02.webp',
      '/hotel3/pg3-room-03.webp',
      '/hotel3/pg3-room-04.webp',
      '/hotel3/pg3-room-05.webp',
    ],
  },
};

