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
        // エラーログを出力
        Logger.log('JSON parse error: ' + parseError.toString());
        return;
      }
    } 
    // FormData形式の場合
    else if (e.parameter && Object.keys(e.parameter).length > 0) {
      data = e.parameter;
    } else {
      Logger.log('No data received');
      return;
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
    
    // 成功を返す（シンプルなテキストレスポンス）
    return ContentService.createTextOutput('success');
      
  } catch (error) {
    // エラーログを出力
    Logger.log('Error in doPost: ' + error.toString());
    return ContentService.createTextOutput('error');
  }
}

// GETリクエスト（WebアプリのURLに直接アクセスした場合）
function doGet(e) {
  return ContentService.createTextOutput('This endpoint accepts POST requests only.');
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

4. **Vercel環境変数を設定**
   - Vercelダッシュボードで環境変数を設定：
     - `GOOGLE_SCRIPT_URL` = コピーしたGoogle Apps ScriptのURL
   - **重要**: `VITE_`プレフィックスは使わない（サーバー側の環境変数）

5. **ローカル開発用の環境変数（オプション）**
   - プロジェクトルートに`.env.local`ファイルを作成（`.env`ではなく`.env.local`）
   - 以下の内容を追加：

```
GOOGLE_SCRIPT_URL=ここにコピーしたURLを貼り付け
```

6. **パッケージのインストール**
   ```bash
   npm install
   ```

7. **再起動**
   - 開発サーバーを再起動して環境変数を読み込む

## ビルド

```bash
npm run build
```

## デプロイ

Vercelにデプロイする場合、環境変数をVercelのダッシュボードで設定してください。

