# Vercel デプロイ ステップバイステップ手順

この手順は「バックアップ済み」「Vite+React+Node.js（API）」の現状を前提に、安全かつ確実に Vercel でデプロイするためのガイドです。

---

## ステップ 1：Vercel アカウント作成＆CLI インストール

-   [Vercel 公式サイト](https://vercel.com/)でアカウント作成（GitHub 連携推奨）
-   ローカルに Vercel CLI をインストール
-   必要に応じて `package.json` に反映

---

## ステップ 2：GitHub リポジトリの準備（推奨）

-   まだの場合は、プロジェクトを GitHub に push しておくと Vercel 連携がスムーズです

---

## ステップ 3：api/ディレクトリの作成とサーバー API の移植

1. プロジェクト直下に `api/` ディレクトリを作成
2. 既存の `server/` ディレクトリ内の API エンドポイントごとに、`api/`配下に TypeScript ファイルを作成
    - 例：
        - `server/server.js` の `/api/ask-question` → `api/ask-question.ts`
        - `server/server.js` の `/api/generate-problem` → `api/generate-problem.ts`
3. 各ファイルは Vercel Serverless Function 形式に書き換え

-   必要に応じて `package.json` に反映

---

## ステップ 4：package.json の確認

-   `build` スクリプトが `"vite build"` になっているか確認
-   必要な依存パッケージ（例：`@vercel/node`や AI API 用パッケージ）が `dependencies` に含まれているか確認

---

## ステップ 5：Vercel プロジェクトの作成

-   Vercel ダッシュボードで「New Project」→ GitHub リポジトリを選択
-   ルートディレクトリ（`math-app`）を選択
-   ビルドコマンド：`vite build`
-   出力ディレクトリ：`dist`（Vite のデフォルト）

---

## ステップ 6：環境変数の設定

-   Vercel ダッシュボードの「Settings」→「Environment Variables」で API キー等を設定
-   コード内では `process.env.XXX` で参照

---

## ステップ 7：デプロイ

-   GitHub 連携の場合は、`main`や`master`ブランチに push で自動デプロイ
-   CLI から手動デプロイも可能
-   必要に応じて `package.json` に反映

---

## ステップ 8：動作確認

-   フロントエンド：`https://your-app.vercel.app`
-   API：`https://your-app.vercel.app/api/ask-question` など

---

## ステップ 9：トラブルシューティング

-   エラーが出た場合は Vercel の「Deployments」画面でログを確認
-   よくある問題：パスの間違い、依存パッケージ不足、環境変数未設定

---

## ステップ 10：不要になった `server/` ディレクトリの整理（動作確認後）

-   問題なく動作することを確認したら、`server/`ディレクトリは削除して OK
