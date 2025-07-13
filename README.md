# 高校数学学習アプリ

高校生向けの数学学習アプリケーションです。AI を活用した問題生成と質問機能を備え、効率的な学習をサポートします。

## 🚀 特徴

-   **AI 問題生成**: 学習内容に応じた個別の問題を自動生成
-   **AI 質問機能**: 数学に関する質問に AI が回答
-   **段階的学習**: 基礎から応用まで体系的に学習
-   **数式表示**: MathJax による美しい数式表示
-   **レスポンシブデザイン**: モバイル・デスクトップ対応

## 📚 学習科目

-   **数学 I**: 式の計算、方程式と不等式、関数、図形と計量
-   **数学 II**: 式と証明、複素数と方程式、図形と方程式、三角関数
-   **数学 III**: 複素数平面、式と曲線、極限、微分法、積分法

## 🛠️ 技術スタック

-   **フロントエンド**: React + TypeScript + Vite
-   **スタイリング**: Tailwind CSS
-   **数式表示**: MathJax
-   **バックエンド**: Node.js + Express
-   **AI API**: Google Gemini API
-   **デプロイ**: Railway

## 🚀 クイックスタート

### 前提条件

-   Node.js 18 以上
-   npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd math-app-new

# 依存関係をインストール
npm install

# バックエンドの依存関係をインストール
cd server
npm install
cd ..
```

### 環境変数の設定

1. `.env`ファイルを作成

```env
VITE_API_BASE_URL=http://localhost:3001
```

2. `server/.env`ファイルを作成

```env
GOOGLE_API_KEY=your_google_gemini_api_key_here
PORT=3001
```

### 開発サーバーの起動

```bash
# フロントエンド（ターミナル1）
npm run dev

# バックエンド（ターミナル2）
cd server
npm start
```

ブラウザで `http://localhost:5173` にアクセスしてください。

## 📖 ドキュメント

詳細なドキュメントは [`docs/`](./docs/) フォルダにあります：

-   **[ユーザーガイド](./docs/USER_GUIDE.md)**: アプリの使用方法
-   **[デプロイメントガイド](./docs/DEPLOYMENT_GUIDE.md)**: 本番環境へのデプロイ方法
-   **[リファクタリングレポート](./docs/REFACTORING_REPORT.md)**: プロジェクトの改善履歴

## 🏗️ プロジェクト構造

```
math-app-new/
├── docs/                    # ドキュメント
├── src/                    # ソースコード
│   ├── components/         # Reactコンポーネント
│   ├── hooks/             # カスタムフック
│   ├── pages/             # ページコンポーネント
│   ├── services/          # APIサービス
│   ├── types/             # TypeScript型定義
│   └── ...
├── server/                # バックエンドサーバー
└── README.md              # このファイル
```

## 🤝 貢献

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## 📞 サポート

問題や質問がある場合は、[Issues](../../issues) を作成してください。

---

**高校数学学習アプリ** - AI を活用した効率的な数学学習をサポート
