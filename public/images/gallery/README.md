# Gallery Images Directory

このディレクトリには、Galleryセクションで使用する画像を配置してください。

## 画像の配置方法

1. 画像ファイルをこのディレクトリに配置します
2. `components/Gallery.tsx` の `GALLERY_IMAGES` 配列に画像パスを追加します

## 例

```typescript
const GALLERY_IMAGES: GalleryImage[] = [
  { 
    src: '/images/gallery/your-image.jpg', 
    alt: '画像の説明', 
    category: 'view' // 'view' | 'room' | 'food' | 'activity'
  },
];
```

## カテゴリ

- `view`: 景色・外観
- `room`: 客室
- `food`: 料理・ダイニング
- `activity`: アクティビティ

