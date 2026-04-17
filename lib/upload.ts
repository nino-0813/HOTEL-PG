import { supabase, isSupabaseConfigured } from './supabase';

const BUCKET = 'blog-images';

/**
 * 画像を Supabase Storage にアップロードし、公開URLを返す。
 * Supabase 未設定の場合は null。
 * バケットがPublicでない場合は、署名付きURLを返す（期限付き）。
 */
export async function uploadBlogImage(file: File): Promise<string | null> {
  if (!supabase || !isSupabaseConfigured()) {
    console.warn('Supabase not configured');
    return null;
  }
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `blog/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  console.log('Uploading to:', BUCKET, path);
  const { data: uploadData, error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) {
    console.error('Upload error:', error);
    if (error.message?.includes('Bucket not found')) {
      console.error('❌ バケット "blog-images" が見つかりません。Supabaseダッシュボードでバケットを作成してください。');
    }
    return null;
  }
  console.log('Upload successful:', uploadData);
  
  // まず公開URLを試す
  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const publicUrl = publicUrlData?.publicUrl;
  console.log('Public URL (full):', publicUrl);
  
  if (publicUrl && publicUrl.includes('/blog/') && publicUrl.startsWith('http')) {
    // 公開URLが正しく生成された場合、実際にアクセス可能か確認
    try {
      const response = await fetch(publicUrl, { method: 'HEAD' });
      if (response.ok) {
        console.log('✅ Public URL is accessible');
        return publicUrl;
      } else {
        console.warn('⚠️ Public URL returned status:', response.status);
        console.warn('💡 バケットがPublicに設定されていない可能性があります。');
        console.warn('   Supabaseダッシュボード → Storage → blog-images → Settings → Public bucket をONにしてください。');
      }
    } catch (fetchError) {
      console.warn('⚠️ Failed to verify public URL:', fetchError);
    }
    
    // 公開URLが使えない場合、署名付きURLを生成（期限付きだが、とりあえず表示可能）
    console.log('🔄 Trying signed URL as fallback...');
    const { data: signedUrlData, error: signedError } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, 60 * 60 * 24 * 7); // 7日間有効
    
    if (signedError) {
      console.error('Signed URL generation error:', signedError);
      console.error('❌ 公開URLも署名付きURLも生成できませんでした。');
      console.error('   バケットの設定を確認してください：');
      console.error('   1. Storage → blog-images → Settings → Public bucket をON');
      console.error('   2. Policies で SELECT 操作を許可するポリシーを追加');
      return null;
    }
    
    if (signedUrlData?.signedUrl) {
      console.log('✅ Using signed URL (expires in 7 days)');
      console.warn('⚠️ 注意: 署名付きURLは7日間で期限切れになります。');
      console.warn('   永続的に使うには、バケットをPublicに設定してください。');
      return signedUrlData.signedUrl;
    }
  }
  
  console.error('❌ Invalid public URL generated:', publicUrlData);
  return null;
}

/**
 * Supabase Storage の署名付きURLを公開URLに変換する。
 * 署名付きURLは期限切れで表示されなくなるため、表示時は公開URLを使う（バケットがPublicの場合に有効）。
 */
export function toPublicStorageUrl(signedOrPublicUrl: string | null | undefined): string | null | undefined {
  if (!signedOrPublicUrl || typeof signedOrPublicUrl !== 'string') return signedOrPublicUrl;
  if (signedOrPublicUrl.includes('/object/sign/')) {
    const withoutQuery = signedOrPublicUrl.split('?')[0];
    return withoutQuery.replace('/object/sign/', '/object/public/');
  }
  return signedOrPublicUrl;
}

/**
 * ファイルを Data URL として読み込む（Supabase 未使用時用）。
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
