/**
 * 画像アップロード（サイトは Supabase Storage を使わない。Data URL でローカル／CMS に保持）。
 */
export async function uploadBlogImage(file: File): Promise<string | null> {
  try {
    return await fileToDataUrl(file);
  } catch {
    return null;
  }
}

/**
 * 旧 Supabase Storage の署名付きURLを公開パス風に変換する互換（既存記事の URL 表示用）。
 */
export function toPublicStorageUrl(signedOrPublicUrl: string | null | undefined): string | null | undefined {
  if (!signedOrPublicUrl || typeof signedOrPublicUrl !== 'string') return signedOrPublicUrl;
  if (signedOrPublicUrl.includes('/object/sign/')) {
    const withoutQuery = signedOrPublicUrl.split('?')[0];
    return withoutQuery.replace('/object/sign/', '/object/public/');
  }
  return signedOrPublicUrl;
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
