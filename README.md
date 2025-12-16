# HOTEL PG - INNOSHIMA

因島の隠れ家リゾート「HOTEL PG」の公式ウェブサイトです。

## セットアップ

```bash
npm install
npm run dev
```

## 環境変数の設定

### Googleスプレッドシート連携

お問い合わせフォームをGoogleスプレッドシートに送信するには、以下の手順で設定してください：

1. **Googleスプレッドシートを作成**
   - 新しいGoogleスプレッドシートを作成
   - 1行目にヘッダーを設定（例：名前、メールアドレス、電話番号、メッセージ、送信日時）

2. **Google Apps Scriptを作成**
   - スプレッドシートの「拡張機能」→「Apps Script」を開く
   - 以下のコードを貼り付けて保存：

```javascript
// CORSヘッダーを設定するヘルパー関数
function setCORSHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '3600'
  };
}

// GETリクエスト（WebアプリのURLに直接アクセスした場合）
function doGet(e) {
  const output = ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    message: 'This is a POST endpoint. Please use POST method to submit form data.'
  }));
  
  // CORSヘッダーを設定
  Object.entries(setCORSHeaders()).forEach(([key, value]) => {
    output.setHeaders({ [key]: value });
  });
  
  return output.setMimeType(ContentService.MimeType.JSON);
}

// POSTリクエスト（フォーム送信時）
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // JSON形式のPOSTリクエストを処理
    let data = {};
    
    // JSON形式のPOSTリクエストの場合
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseError) {
        const output = ContentService.createTextOutput(JSON.stringify({
          status: 'error',
          message: 'Failed to parse JSON: ' + parseError.toString()
        }));
        
        // CORSヘッダーを設定
        Object.entries(setCORSHeaders()).forEach(([key, value]) => {
          output.setHeaders({ [key]: value });
        });
        
        return output.setMimeType(ContentService.MimeType.JSON);
      }
    } 
    // FormData形式の場合
    else if (e.parameter && Object.keys(e.parameter).length > 0) {
      data = e.parameter;
    } else {
      const output = ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'No data received'
      }));
      
      // CORSヘッダーを設定
      Object.entries(setCORSHeaders()).forEach(([key, value]) => {
        output.setHeaders({ [key]: value });
      });
      
      return output.setMimeType(ContentService.MimeType.JSON);
    }
    
    // データをスプレッドシートに書き込む
    const row = [
      data.name || '',
      data.email || '',
      data.phone || '',
      data.message || '',
      new Date()
    ];
    
    sheet.appendRow(row);
    
    const output = ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Data saved successfully'
    }));
    
    // CORSヘッダーを設定
    Object.entries(setCORSHeaders()).forEach(([key, value]) => {
      output.setHeaders({ [key]: value });
    });
    
    return output.setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // エラーが発生した場合
    const output = ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    }));
    
    // CORSヘッダーを設定
    Object.entries(setCORSHeaders()).forEach(([key, value]) => {
      output.setHeaders({ [key]: value });
    });
    
    return output.setMimeType(ContentService.MimeType.JSON);
  }
}

// CORSプリフライトリクエスト（OPTIONS）に対応
function doOptions(e) {
  const output = ContentService.createTextOutput('');
  
  // CORSヘッダーを設定
  Object.entries(setCORSHeaders()).forEach(([key, value]) => {
    output.setHeaders({ [key]: value });
  });
  
  return output.setMimeType(ContentService.MimeType.JSON);
}
```

3. **Webアプリとして公開**
   - 「デプロイ」→「新しいデプロイ」を選択
   - 種類として「ウェブアプリ」を選択
   - 説明を入力
   - 「次のユーザーとして実行」を「自分」に設定
   - 「アクセスできるユーザー」を「全員」に設定
   - 「デプロイ」をクリック
   - 表示されたURLをコピー

4. **環境変数を設定**
   - プロジェクトルートに`.env`ファイルを作成
   - 以下の内容を追加：

```
VITE_GOOGLE_SCRIPT_URL=ここにコピーしたURLを貼り付け
```

5. **再起動**
   - 開発サーバーを再起動して環境変数を読み込む

## ビルド

```bash
npm run build
```

## デプロイ

Vercelにデプロイする場合、環境変数をVercelのダッシュボードで設定してください。

