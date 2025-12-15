# 動画ファイル

このディレクトリに動画ファイル（.mp4, .webm, .movなど）を配置してください。

## 使用方法

1. 動画ファイルをこのディレクトリに配置します
   - 例: `construction.mp4`

2. `components/HotelIIIStory.tsx`の`storySteps`配列で、動画を追加したいステップに`video`プロパティを追加します

```typescript
{
  id: 'construction-start',
  title: '着工',
  video: '/videos/construction.mp4', // このディレクトリ内のファイルを参照
  // ...
}
```

## 対応形式

- MP4 (.mp4) - 推奨
- WebM (.webm)
- MOV (.mov)
- その他、HTML5 videoタグがサポートする形式

## 注意事項

- ファイルサイズが大きい場合は、読み込み時間に注意してください
- 動画ファイルは最適化（圧縮）することを推奨します
- モバイル対応のため、適切な解像度に調整してください

