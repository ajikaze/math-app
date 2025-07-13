declare global {
    interface MathJaxObject {
        typesetPromise?: () => Promise<void>;
        tex?: unknown;
        CHTML?: unknown;
        svg?: unknown;
        // 必要に応じて他のプロパティも追加
    }
    interface Window {
        MathJax?: MathJaxObject;
    }
}

// MathJaxの設定と読み込みを行う関数
const loadMathJax = (): void => {
    // MathJaxの設定をスクリプト読み込み前に定義
    // これにより、MathJaxがロードされたときに設定が適用されます。
    window.MathJax = {
        tex: {
            inlineMath: [
                ["$", "$"],
                ["\\(", "\\)"],
            ], // インライン数式を$で囲む
            displayMath: [
                ["$$", "$$"],
                ["\\[", "\\]"],
            ], // ディスプレイ数式を$$で囲む
        },
        // CHTML設定を追加し、自動改行を有効にする
        CHTML: {
            linebreaks: { automatic: true, width: "container" }, // automatic line breaking
        },
        svg: {
            fontCache: "global", // フォントキャッシュをグローバルに設定
        },
    };

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
    script.async = true;
    document.head.appendChild(script);
};

export default loadMathJax;
