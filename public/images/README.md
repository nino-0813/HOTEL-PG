# Images Directory Structure

このディレクトリには、サイトで使用する画像を配置してください。

## ディレクトリ構成

- `public/images/hero/` - ヒーローセクション（トップページのメイン画像）用
- `public/images/sections/` - 各セクション（Concept, Rooms, Dining, Activity）用
- `public/images/gallery/` - ギャラリー用画像
- `public/images/footer/` - フッター用画像

## 使用方法

画像を配置した後、以下のようにパスを指定できます：

```typescript
// 例: Hero画像
const HERO_IMAGE = "/images/hero/hero-image.jpg";

// 例: セクション画像
const SECTION_IMAGE = "/images/sections/concept-1.jpg";
```

## 推奨サイズ

- **Hero画像**: 2560x1440px 以上（16:9推奨）
- **セクション画像**: 1600x1200px 以上（4:3推奨）
- **ギャラリー画像**: 1200x1200px 以上（正方形推奨）
- **フッター画像**: 2560x1440px 以上（16:9推奨）

## ファイル形式

- JPEG（.jpg, .jpeg）: 写真向け
- PNG（.png）: 透明背景が必要な場合
- WebP（.webp）: より軽量（対応ブラウザが多い）

