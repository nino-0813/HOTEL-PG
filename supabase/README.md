# Supabase で編集をフロントに反映する

1. [Supabase](https://supabase.com) でプロジェクトを作成する
2. **SQL Editor** で `schema.sql` の内容を実行する（`cms_content` テーブルと RLS が作成されます）
3. プロジェクトルートに `.env` を作成し、以下をコピーして値を入れる：
   ```bash
   cp .env.example .env
   ```
   - `VITE_SUPABASE_URL` … Settings > API > Project URL
   - `VITE_SUPABASE_ANON_KEY` … Settings > API > anon public
4. 開発サーバーを再起動する（`npm run dev`）
5. 管理画面（`/admin`）でブログやコンテンツを保存すると、Supabase に保存され、フロントの表示に反映されます

初回はテーブルが空のため、サイトは `constants.ts` の内容を表示します。管理画面で一度でも保存すると Supabase にデータが入り、以降はそのデータがフロントに使われます。

---

## ブログのアイキャッチ画像をアップロードする場合

1. Supabase ダッシュボードで **Storage** を開く
2. **New bucket** で `blog-images` を作成し、**Public bucket** にチェックを入れる（重要！）
3. 作成後に **Policies** タブで以下の2つのポリシーを追加：

   **ポリシー1: アップロード許可**
   - 「New policy」→「For full customization」を選ぶ
   - **Policy name**: `Allow anon upload`
   - **Allowed operation**: `INSERT`
   - **Target roles**: `anon`
   - **WITH CHECK expression**: `true`

   **ポリシー2: 読み取り許可（重要！）**
   - 「New policy」→「For full customization」を選ぶ
   - **Policy name**: `Allow anon read`
   - **Allowed operation**: `SELECT`
   - **Target roles**: `anon`
   - **USING expression**: `true`

4. 管理画面のブログ編集で「ファイルを選択」から画像を選ぶと、このバケットにアップロードされ、公開URLが自動で入ります

**トラブルシューティング:**
- 画像が表示されない場合、バケットが **Public bucket** になっているか確認してください
- また、**SELECT ポリシー**が正しく設定されているか確認してください
- コンソールにエラーメッセージが表示される場合は、その内容を確認してください

Supabase をまだ使っていない場合は、画像は「Data URL」としてブラウザ内に保存されます（同じ端末で開く限り表示されます）。
