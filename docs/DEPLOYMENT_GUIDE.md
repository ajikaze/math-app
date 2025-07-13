# 本番環境デプロイガイド

## 目次

1. [デプロイ方法](#1-デプロイ方法)
2. [セキュリティ面での重要注意点](#2-セキュリティ面での重要注意点)
3. [デプロイ手順](#3-デプロイ手順)
4. [監視とログ](#4-監視とログ)
5. [バックアップと復旧](#5-バックアップと復旧)

---

## 1. デプロイ方法

### フロントエンド（React + Vite）のデプロイ

#### A. Vercel（推奨）

```bash
# プロジェクトルートで実行
npm run build

# Vercel CLIをインストール
npm install -g vercel

# デプロイ
vercel
```

#### B. Netlify

```bash
# ビルド
npm run build

# Netlify CLIをインストール
npm install -g netlify-cli

# デプロイ
netlify deploy --prod --dir=dist
```

#### C. GitHub Pages

```bash
# ビルド
npm run build

# GitHub Pages用の設定を追加
# vite.config.tsに以下を追加
export default defineConfig({
  base: '/math-app-new/', // リポジトリ名
  // ... 他の設定
})
```

### バックエンド（Express）のデプロイ

#### A. Railway（推奨）

```bash
# serverディレクトリで実行
cd server

# Railway CLIをインストール
npm install -g @railway/cli

# ログイン
railway login

# デプロイ
railway up
```

#### B. Render

```bash
# serverディレクトリで実行
cd server

# render.yamlファイルを作成
```

#### C. Heroku

```bash
# serverディレクトリで実行
cd server

# Heroku CLIをインストール
npm install -g heroku

# アプリを作成
heroku create your-app-name

# デプロイ
git push heroku main
```

---

## 2. セキュリティ面での重要注意点

### A. 環境変数の管理

-   **絶対に Git にコミットしない**
-   本番環境の管理画面で設定
-   定期的に API キーをローテーション

### B. CORS 設定

-   本番環境では特定のドメインのみ許可
-   ワイルドカード（`*`）は使用しない

### C. レート制限

-   API の過度な使用を防ぐ
-   DDoS 攻撃の軽減

### D. 入力検証

-   プロンプトの長さ制限
-   不正な文字のフィルタリング

### E. エラーハンドリング

-   詳細なエラー情報をクライアントに返さない
-   ログには機密情報を含めない

### F. HTTPS 通信

-   本番環境では必ず HTTPS を使用
-   SSL 証明書の適切な管理

---

## 3. デプロイ手順

### バックエンド（Railway 例）

#### ステップ 1: セキュリティ強化パッケージのインストール

```bash
cd server

# 本番環境用パッケージをインストール
npm install express-rate-limit helmet
```

#### ステップ 2: 環境変数の設定

```bash
# Railway CLIをインストール
npm install -g @railway/cli

# ログイン
railway login

# プロジェクトを初期化
railway init

# 環境変数を設定
railway variables set GEMINI_API_KEY=your_api_key
railway variables set NODE_ENV=production
railway variables set ALLOWED_ORIGINS=https://your-frontend-domain.com
railway variables set RATE_LIMIT_WINDOW_MS=900000
railway variables set RATE_LIMIT_MAX_REQUESTS=100
```

#### ステップ 3: デプロイ

```bash
# デプロイ
railway up
```

### フロントエンド（Vercel 例）

#### ステップ 1: ビルド設定の確認

```bash
# プロジェクトルートで実行
npm run build
```

#### ステップ 2: デプロイ

```bash
# Vercel CLIをインストール
npm install -g vercel

# デプロイ
vercel --prod
```

---

## 4. 監視とログ

### A. ログ管理

-   アクセスログの記録
-   エラーログの監視
-   パフォーマンスメトリクス

### B. アラート設定

-   エラー率の監視
-   レスポンス時間の監視
-   API 使用量の監視

---

## 5. バックアップと復旧

### A. データバックアップ

-   環境変数のバックアップ
-   設定ファイルのバックアップ

### B. 復旧手順

-   ロールバック手順の準備
-   障害時の連絡体制

---

## 重要なセキュリティチェックリスト

### デプロイ前

-   [ ] API キーが環境変数で設定されている
-   [ ] .env ファイルが.gitignore に含まれている
-   [ ] CORS 設定が本番環境のドメインに限定されている
-   [ ] レート制限が設定されている
-   [ ] 入力検証が実装されている
-   [ ] エラーハンドリングが適切に実装されている

### デプロイ後

-   [ ] HTTPS が有効になっている
-   [ ] セキュリティヘッダーが設定されている
-   [ ] ログが適切に記録されている
-   [ ] 監視が設定されている
-   [ ] バックアップが設定されている

---

## トラブルシューティング

### よくある問題と解決方法

#### 1. CORS エラー

-   本番環境のドメインが CORS 設定に含まれているか確認
-   フロントエンドとバックエンドのドメインが正しく設定されているか確認

#### 2. API キーエラー

-   環境変数が正しく設定されているか確認
-   API キーが有効か確認

#### 3. レート制限エラー

-   レート制限の設定を確認
-   必要に応じて制限を緩和

#### 4. パフォーマンス問題

-   ログを確認してボトルネックを特定
-   必要に応じてキャッシュを実装

---

## 参考リンク

-   [Vercel Documentation](https://vercel.com/docs)
-   [Railway Documentation](https://docs.railway.app/)
-   [Express Security Best Practices](https://expressjs.com/en/advanced/best-practices-security.html)
-   [Google Gemini API Documentation](https://ai.google.dev/docs)

---

## 注意事項

-   本番環境へのデプロイは慎重に行ってください
-   セキュリティを最優先に考えてください
-   定期的にセキュリティアップデートを行ってください
-   バックアップを定期的に確認してください
