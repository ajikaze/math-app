# JSXGraph ステップバイステップ導入ガイド

このドキュメントでは、数学学習アプリにおいて「解説」や「例題」でグラフや図形を使うために、JSXGraph を React アプリに導入し活用する手順を詳しく解説します。

---

## 1. JSXGraph とは？

JSXGraph は、インタラクティブな幾何図形や関数グラフを Web 上で描画・操作できる JavaScript ライブラリです。教育用途に最適化されており、React などのモダンなフレームワークとも組み合わせて使えます。

---

## 2. インストール手順

プロジェクトのルートディレクトリで以下のコマンドを実行します。

```bash
npm install jsxgraph
```

---

## 3. React 用 JSXGraph ラッパーコンポーネントの作成

`src/components/JSXGraphBoard.tsx` などのファイル名で、以下のようなコンポーネントを作成します。

```tsx
import React, { useEffect, useRef } from "react";
import JXG from "jsxgraph";

type JSXGraphBoardProps = {
    draw: (board: JXG.Board) => void;
    width?: number;
    height?: number;
};

const JSXGraphBoard: React.FC<JSXGraphBoardProps> = ({
    draw,
    width = 500,
    height = 400,
}) => {
    const boardRef = useRef<HTMLDivElement>(null);
    const jxgBoard = useRef<JXG.Board | null>(null);

    useEffect(() => {
        if (boardRef.current) {
            // 既存ボードのクリーンアップ
            if (jxgBoard.current) {
                JXG.JSXGraph.freeBoard(jxgBoard.current);
            }
            // 新しいボードを作成
            jxgBoard.current = JXG.JSXGraph.initBoard(boardRef.current, {
                boundingbox: [-5, 5, 5, -5],
                axis: true,
                showNavigation: false,
                showCopyright: false,
                width,
                height,
            });
            draw(jxgBoard.current);
        }
        // アンマウント時のクリーンアップ
        return () => {
            if (jxgBoard.current) {
                JXG.JSXGraph.freeBoard(jxgBoard.current);
            }
        };
    }, [draw, width, height]);

    return <div ref={boardRef} style={{ width, height }} />;
};

export default JSXGraphBoard;
```

---

## 4. 基本的なグラフの表示例

例：直線 \( y = 2x + 1 \) を表示する

```tsx
import JSXGraphBoard from "./components/JSXGraphBoard";

const ExampleGraph = () => (
    <JSXGraphBoard
        draw={(board) => {
            board.create("functiongraph", [(x) => 2 * x + 1]);
        }}
        width={400}
        height={300}
    />
);
```

---

## 5. 解説・例題コンポーネントへの組み込み例

```tsx
const ExampleExplanation = () => (
    <div>
        <h2>例題：直線のグラフ</h2>
        <p>直線 \( y = 2x + 1 \) のグラフを下に示します。</p>
        <ExampleGraph />
        <p>このグラフから、傾きが2、切片が1であることがわかります。</p>
    </div>
);
```

---

## 6. インタラクティブなグラフの応用例

### 6.1 スライダーでパラメータを操作

```tsx
<JSXGraphBoard
    draw={(board) => {
        const slider = board.create(
            "slider",
            [
                [-4, 4],
                [0, 4],
                [1, 2, 3],
            ],
            { name: "a" }
        );
        board.create("functiongraph", [
            (x) => slider.Value() * x + 1,
            () => -5,
            () => 5,
        ]);
    }}
    width={400}
    height={300}
/>
```

### 6.2 点や図形をドラッグして操作

```tsx
<JSXGraphBoard
    draw={(board) => {
        const p1 = board.create("point", [1, 2], { name: "A", size: 4 });
        const p2 = board.create("point", [4, 3], { name: "B", size: 4 });
        board.create("line", [p1, p2]);
    }}
    width={400}
    height={300}
/>
```

---

## 7. よくあるトラブルと対策

-   **ボードが重複して表示される**
    -   クリーンアップ処理（`JXG.JSXGraph.freeBoard`）を必ず実装する
-   **スタイルが崩れる**
    -   `width`や`height`の指定、親要素の CSS に注意
-   **TypeScript 型エラー**
    -   `@types/jsxgraph`が必要な場合は`npm install --save-dev @types/jsxgraph`（ただし公式型定義は未整備のことも）

---

## 8. 参考リンク

-   [JSXGraph 公式ドキュメント](https://jsxgraph.org/docs/index.html)
-   [React での利用例（公式フォーラム）](https://jsxgraph.org/wp/forums/topic/react-integration/)
-   [GitHub: jsxgraph/jsxgraph](https://github.com/jsxgraph/jsxgraph)

---

## まとめ

-   JSXGraph は数学教育アプリに最適なグラフ・図形描画ライブラリ
-   React アプリにも簡単に組み込める
-   基本的なグラフからインタラクティブな応用まで幅広く対応

このガイドを参考に、解説や例題でグラフを活用してください。
