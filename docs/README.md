# 高校数学学習アプリ - ドキュメント

このフォルダには、高校数学学習アプリに関するすべてのドキュメントが含まれています。

## 📚 ドキュメント一覧

### 1. [USER_GUIDE.md](./USER_GUIDE.md)

ユーザー向けの使用方法ガイドです。

-   アプリの基本操作
-   学習の進め方
-   AI 機能の使い方
-   よくある質問

### 2. [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

開発者向けのデプロイメントガイドです。

-   Railway でのデプロイ手順
-   環境変数の設定
-   セキュリティ対策
-   本番環境での運用

### 3. [REFACTORING_REPORT.md](./REFACTORING_REPORT.md)

プロジェクトリファクタリングの詳細レポートです。

-   実施した改善内容
-   新しいディレクトリ構造
-   技術的改善点
-   今後の改善提案

## 🚀 クイックスタート

### 開発環境のセットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# バックエンドサーバーの起動（別ターミナル）
cd server
npm install
npm start
```

### ビルド

```bash
npm run build
```

## 📁 プロジェクト構造

```
math-app-new/
├── docs/                    # ドキュメント
│   ├── README.md           # このファイル
│   ├── USER_GUIDE.md       # ユーザーガイド
│   ├── DEPLOYMENT_GUIDE.md # デプロイメントガイド
│   └── REFACTORING_REPORT.md # リファクタリングレポート
├── src/                    # ソースコード
│   ├── components/         # Reactコンポーネント
│   ├── hooks/             # カスタムフック
│   ├── pages/             # ページコンポーネント
│   ├── services/          # APIサービス
│   ├── types/             # TypeScript型定義
│   └── ...
├── server/                # バックエンドサーバー
└── README.md              # プロジェクト概要
```

## 🔧 技術スタック

-   **フロントエンド**: React + TypeScript + Vite
-   **スタイリング**: Tailwind CSS
-   **数式表示**: MathJax
-   **バックエンド**: Node.js + Express
-   **AI API**: Google Gemini API
-   **デプロイ**: Railway

## 📞 サポート

問題や質問がある場合は、以下のドキュメントを参照してください：

1. **使用方法**: [USER_GUIDE.md](./USER_GUIDE.md)
2. **デプロイ**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
3. **開発**: [REFACTORING_REPORT.md](./REFACTORING_REPORT.md)

## 📝 更新履歴

-   **2024 年**: プロジェクトリファクタリング完了
-   **2024 年**: AI 機能の実装
-   **2024 年**: 初期バージョンリリース
