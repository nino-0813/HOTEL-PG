export interface NavItem {
  label: string;
  href: string;
}

export interface NewsItem {
  date: string;
  title: string;
  href: string;
}

export interface SectionContent {
  title: string;
  subtitle: string;
  description: string[];
  images: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  image?: string;
  slug: string;
  tags?: string[];
}

export interface StayPlan {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  description: string;
  highlights: string[];
  detailedDescription: string;
  schedule: { day: number; time: string; activity: string }[];
  includes: string[];
  image?: string;
  /** マリン機器等、外部公式サイトへの案内（モーダル内にリンクとして表示） */
  relatedLinks?: { label: string; href: string }[];
}

/** 体験プラン詳細ページ（LP風）の1セクション。
 *  imageの位置に応じて左右交互レイアウトで表示します。 */
export interface ExperiencePlanSection {
  title: string;
  body: string;
  image?: string;
  imageAlt?: string;
}

export interface ExperiencePlanScheduleItem {
  time: string;
  title: string;
  description: string;
  image?: string;
}

export interface ExperiencePlan {
  /** URLのスラッグ（/experience-plans/[slug]）にも使用 */
  slug: string;
  title: string;
  subtitle: string;
  /** 一覧カードに出す短い説明 */
  description: string;
  /** 例: "10:00 - 21:00 / 1日体験" */
  duration: string;
  /** 例: "1家族 4〜5名 / 大人2名+子ども2〜3名 目安" など */
  capacity?: string;
  /** "¥38,000 / 1組 〜" のような表示用文字列。料金は概算可。 */
  priceLabel?: string;
  /** カード・LP上部のヒーロー画像 */
  heroImage: string;
  heroImageAlt?: string;
  /** 一覧カードのキャッチコピー（heroの上にかぶせるサブテキスト） */
  catchCopy?: string;
  /** LPの導入文（hero下のリード文） */
  lead: string;
  /** ハイライトとして3〜4個並べる短文 */
  highlights: string[];
  /** タイムスケジュール */
  schedule: ExperiencePlanScheduleItem[];
  /** ストーリー的に紹介するLPセクション。画像と本文を組み合わせ。 */
  sections: ExperiencePlanSection[];
  /** プランに含まれるもの */
  includes: string[];
  /** プラン外/オプションのもの */
  options?: string[];
  /** ご注意・備考 */
  notes?: string[];
  /** 外部参考リンク */
  relatedLinks?: { label: string; href: string }[];
  /** プレゼンテーション風のスライド画像（既に画像内にキャプションを含むため、補足は任意） */
  presentation?: {
    image: string;
    alt?: string;
    /** スライド画像の下に並べる短い補足文（省略可） */
    caption?: string;
  }[];
}

// ---- ブロック形式ブログ（blog_articles）----

export type BlockType =
  | 'paragraph'
  | 'heading1'
  | 'heading2'
  | 'image'
  | 'bulletList'
  | 'numberedList'
  | 'quote'
  | 'code'
  | 'divider'
  | 'embed';

export type TextAlign = 'left' | 'center' | 'right';

export interface EmbedData {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  favicon?: string;
}

export interface Block {
  id: string;
  type: BlockType;
  content?: string;
  imageUrl?: string;
  listItems?: string[];
  textAlign?: TextAlign;
  embedData?: EmbedData;
}

export interface BlogArticle {
  id: string;
  slug: string | null;
  title: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  note_url: string | null;
  published_at: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}
