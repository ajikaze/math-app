import React, { useEffect, useRef } from "react";

interface MathJaxDisplayProps {
    content: string; // The HTML string containing LaTeX
    className?: string; // Optional class name for styling
}

/**
 * MathJaxでLaTeXを含むHTMLコンテンツをレンダリングするためのコンポーネント。
 * contentプロップが変更されるたびに、対応するDOM要素を更新し、MathJaxにその要素を再タイプセットするよう指示します。
 */
const MathJaxDisplay: React.FC<MathJaxDisplayProps> = ({
    content,
    className,
}) => {
    const ref = useRef<HTMLDivElement>(null); // コンテンツを保持するDOM要素への参照

    useEffect(() => {
        // ref.currentが存在し、かつwindow.MathJaxが利用可能であることを確認
        if (ref.current && window.MathJax) {
            // DOM要素のinnerHTMLを新しいコンテンツで更新
            ref.current.innerHTML = content;

            // MathJaxがロードされ、タイプセット機能が利用可能であることを再確認
            // MathJax.typesetPromiseは、指定された要素内の数式を処理します。
            if (window.MathJax.typesetPromise) {
                // ※自動改行(linebreaks)設定はMathJax初期化時に行うのが推奨
                window.MathJax.typesetPromise().catch((err: Error) =>
                    console.error("MathJax typeset error:", err)
                );
            } else {
                // MathJaxがまだ完全にロードされていない場合の警告（通常は発生しないはず）
                console.warn(
                    "MathJax is not ready for typesetting in MathJaxDisplay."
                );
            }
        }
    }, [content]); // contentプロップが変更されたときにのみこのエフェクトを再実行

    // レンダリングされるDOM要素。refを介して直接操作されます。
    return (
        <div
            ref={ref}
            className={`break-words whitespace-pre-wrap ${className || ""}`}
        ></div>
    );
};

export default MathJaxDisplay;
