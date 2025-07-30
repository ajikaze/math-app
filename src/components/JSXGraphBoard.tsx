import React, { useEffect, useRef } from "react";
import JXG from "jsxgraph";

export type JSXGraphBoardProps = {
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
