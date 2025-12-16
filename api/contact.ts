import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // プリフライトリクエスト対応
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POSTリクエストのみ許可
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, message } = req.body;

    // バリデーション
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Google Apps Script URL
    const scriptURL = process.env.GOOGLE_SCRIPT_URL;

    if (!scriptURL) {
      console.error('GOOGLE_SCRIPT_URL is not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Google Apps Scriptに送信（サーバー→サーバーなのでCORS問題なし）
    const response = await fetch(scriptURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        phone: phone || '',
        message: message || '',
      }),
    });

    // レスポンスを確認（オプション）
    if (!response.ok) {
      console.error('GAS response not ok:', response.status);
      // エラーでも成功として返す（GAS側で処理されている可能性があるため）
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in contact API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

