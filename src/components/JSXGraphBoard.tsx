import React, { useEffect, useRef } from "react";
import JXG from "jsxgraph";

interface JSXGraphBoardProps {
    draw: (board: JXG.Board) => void;
    width: number;
    height: number;
}

const JSXGraphBoard: React.FC<JSXGraphBoardProps> = ({
    draw,
    width,
    height,
}) => {
    const boardRef = useRef<HTMLDivElement>(null);
    const jxgBoard = useRef<JXG.Board | null>(null);

    useEffect(() => {
        if (boardRef.current) {
            const initBoard = () => {
                try {
                    if (jxgBoard.current) {
                        try {
                            JXG.JSXGraph.freeBoard(jxgBoard.current);
                        } catch (cleanupError) {
                            console.warn("Cleanup error:", cleanupError);
                        }
                        jxgBoard.current = null;
                    }
                    const board = JXG.JSXGraph.initBoard(boardRef.current!, {
                        boundingbox: [-2, 5, 8, -2], // 表示範囲を拡大
                        axis: true,
                        showNavigation: false,
                        showCopyright: false,
                        keepAspectRatio: true,
                        grid: true,
                    });
                    jxgBoard.current = board;
                    draw(board);
                } catch (error) {
                    console.error("JSXGraph initialization error:", error);
                }
            };
            setTimeout(initBoard, 100);
        }
        return () => {
            if (jxgBoard.current) {
                try {
                    JXG.JSXGraph.freeBoard(jxgBoard.current);
                } catch (error) {
                    console.warn("JSXGraph cleanup error:", error);
                } finally {
                    jxgBoard.current = null;
                }
            }
        };
    }, [draw, width, height]);

    return (
        <div
            ref={boardRef}
            style={{
                width: `${width}px`,
                height: `${height}px`,
                border: "1px solid #ccc",
            }}
        />
    );
};

export default JSXGraphBoard;
