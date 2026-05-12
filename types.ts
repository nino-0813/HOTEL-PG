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
