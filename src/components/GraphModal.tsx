import React from "react";
import Dialog from "@mui/material/Dialog";
import Slider from "react-slick";
import JSXGraphBoard from "./JSXGraphBoard";
import type { GraphData } from "../types";
import JXG from "jsxgraph";

export type GraphModalProps = {
    open: boolean;
    onClose: () => void;
    graphs: GraphData[];
};

const GraphModal: React.FC<GraphModalProps> = ({ open, onClose, graphs }) => {
    console.log("GraphModal render:", { open, graphs });

    // 内心を計算する関数
    const calculateIncenter = (A: any, B: any, C: any) => {
        const ax = A.X(),
            ay = A.Y();
        const bx = B.X(),
            by = B.Y();
        const cx = C.X(),
            cy = C.Y();

        // 各辺の長さを計算
        const a = Math.sqrt((bx - cx) ** 2 + (by - cy) ** 2);
        const b = Math.sqrt((ax - cx) ** 2 + (ay - cy) ** 2);
        const c = Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);

        // 内心の座標を計算
        const perimeter = a + b + c;
        const x = (a * ax + b * bx + c * cx) / perimeter;
        const y = (a * ay + b * by + c * cy) / perimeter;

        console.log("Incenter calculation:", {
            ax,
            ay,
            bx,
            by,
            cx,
            cy,
            a,
            b,
            c,
            x,
            y,
        });
        return { x, y, a, b, c };
    };

    // 外心を計算する関数
    const calculateCircumcenter = (A: any, B: any, C: any) => {
        const ax = A.X(),
            ay = A.Y();
        const bx = B.X(),
            by = B.Y();
        const cx = C.X(),
            cy = C.Y();

        // 外心の座標を計算
        const d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));

        if (Math.abs(d) < 1e-10) {
            return { x: (ax + bx + cx) / 3, y: (ay + by + cy) / 3 };
        }

        const ux =
            ((ax * ax + ay * ay) * (by - cy) +
                (bx * bx + by * by) * (cy - ay) +
                (cx * cx + cy * cy) * (ay - by)) /
            d;
        const uy =
            ((ax * ax + ay * ay) * (cx - bx) +
                (bx * bx + by * by) * (ax - cx) +
                (cx * cx + cy * cy) * (bx - ax)) /
            d;

        console.log("Circumcenter calculation:", {
            ax,
            ay,
            bx,
            by,
            cx,
            cy,
            ux,
            uy,
        });
        return { x: ux, y: uy };
    };

    // 垂心を計算する関数（修正版）
    const calculateOrthocenter = (A: any, B: any, C: any) => {
        const ax = A.X(),
            ay = A.Y();
        const bx = B.X(),
            by = B.Y();
        const cx = C.X(),
            cy = C.Y();

        // 垂心の座標を計算（より安定した方法）
        const denominator = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);

        if (Math.abs(denominator) < 1e-10) {
            return { x: (ax + bx + cx) / 3, y: (ay + by + cy) / 3 };
        }

        // 垂心の座標を計算
        const hx =
            ax +
            ((by - ay) * (cy - ay) * (cx - ax) -
                (bx - ax) * (cy - ay) * (cy - ay)) /
                denominator;
        const hy =
            ay +
            ((bx - ax) * (cx - ax) * (cy - ay) -
                (by - ay) * (cx - ax) * (cx - ax)) /
                denominator;

        console.log("Orthocenter calculation:", {
            ax,
            ay,
            bx,
            by,
            cx,
            cy,
            hx,
            hy,
        });
        return { x: hx, y: hy };
    };

    // 重心を計算する関数
    const calculateCentroid = (A: any, B: any, C: any) => {
        const ax = A.X(),
            ay = A.Y();
        const bx = B.X(),
            by = B.Y();
        const cx = C.X(),
            cy = C.Y();

        const x = (ax + bx + cx) / 3;
        const y = (ay + by + cy) / 3;

        console.log("Centroid calculation:", { ax, ay, bx, by, cx, cy, x, y });
        return { x, y };
    };

    const drawGraph = (board: JXG.Board, graph: GraphData) => {
        console.log("Drawing graph:", graph.type, graph.params);

        const { points } = graph.params;
        const style = graph.style || {};

        // 頂点を作成（ラベルをDEFに変更）
        const A = board.create("point", points[0], { name: "D", size: 3 });
        const B = board.create("point", points[1], { name: "E", size: 3 });
        const C = board.create("point", points[2], { name: "F", size: 3 });

        console.log("Created points:", { A, B, C });

        // 基本の三角形を描画
        board.create("polygon", [A, B, C], {
            strokeColor: style.strokeColor || "#0074D9",
            fillColor: "none",
            strokeWidth: 2,
            ...style,
        });

        // グラフタイプに応じて追加要素を描画
        switch (graph.type) {
            case "triangle":
                // 基本の三角形のみ（既に描画済み）
                break;

            case "centroid": {
                // 中線を描画
                const midBC = board.create("midpoint", [B, C], {
                    name: "",
                    size: 2,
                });
                const midAC = board.create("midpoint", [A, C], {
                    name: "",
                    size: 2,
                });
                const midAB = board.create("midpoint", [A, B], {
                    name: "",
                    size: 2,
                });

                board.create("line", [A, midBC], {
                    strokeColor: "#FF4136",
                    strokeWidth: 1,
                    dash: 2,
                });
                board.create("line", [B, midAC], {
                    strokeColor: "#FF4136",
                    strokeWidth: 1,
                    dash: 2,
                });
                board.create("line", [C, midAB], {
                    strokeColor: "#FF4136",
                    strokeWidth: 1,
                    dash: 2,
                });

                // 重心を手動計算して描画
                const centroidCoords = calculateCentroid(A, B, C);
                const centroid = board.create(
                    "point",
                    [centroidCoords.x, centroidCoords.y],
                    {
                        strokeColor: "#FF4136",
                        fillColor: "#FF4136",
                        size: 4,
                        name: "G",
                    }
                );

                console.log("Created centroid:", centroid);

                // 説明テキスト
                board.create(
                    "text",
                    [centroidCoords.x, centroidCoords.y - 0.5, "重心"],
                    {
                        fontSize: 14,
                        color: "#FF4136",
                    }
                );
                break;
            }

            case "incenter": {
                console.log("Drawing incenter...");

                // 内心を手動計算
                const incenterData = calculateIncenter(A, B, C);
                console.log("Incenter coordinates:", incenterData);

                // 内心の点を描画
                const incenter = board.create(
                    "point",
                    [incenterData.x, incenterData.y],
                    {
                        strokeColor: "#B10DC9",
                        fillColor: "#B10DC9",
                        size: 4,
                        name: "I",
                    }
                );

                console.log("Created incenter point:", incenter);

                // 角の二等分線を手動で描画
                // 角Aの二等分線
                const angleA =
                    Math.atan2(C.Y() - A.Y(), C.X() - A.X()) -
                    Math.atan2(B.Y() - A.Y(), B.X() - A.X());
                const bisectorA =
                    Math.atan2(B.Y() - A.Y(), B.X() - A.X()) + angleA / 2;
                const bisectorAEndX = A.X() + Math.cos(bisectorA) * 3;
                const bisectorAEndY = A.Y() + Math.sin(bisectorA) * 3;
                board.create("line", [A, [bisectorAEndX, bisectorAEndY]], {
                    strokeColor: "#B10DC9",
                    strokeWidth: 1,
                    dash: 2,
                });

                // 角Bの二等分線
                const angleB =
                    Math.atan2(A.Y() - B.Y(), A.X() - B.X()) -
                    Math.atan2(C.Y() - B.Y(), C.X() - B.X());
                const bisectorB =
                    Math.atan2(C.Y() - B.Y(), C.X() - B.X()) + angleB / 2;
                const bisectorBEndX = B.X() + Math.cos(bisectorB) * 3;
                const bisectorBEndY = B.Y() + Math.sin(bisectorB) * 3;
                board.create("line", [B, [bisectorBEndX, bisectorBEndY]], {
                    strokeColor: "#B10DC9",
                    strokeWidth: 1,
                    dash: 2,
                });

                // 角Cの二等分線
                const angleC =
                    Math.atan2(B.Y() - C.Y(), B.X() - C.X()) -
                    Math.atan2(A.Y() - C.Y(), A.X() - C.X());
                const bisectorC =
                    Math.atan2(A.Y() - C.Y(), A.X() - C.X()) + angleC / 2;
                const bisectorCEndX = C.X() + Math.cos(bisectorC) * 3;
                const bisectorCEndY = C.Y() + Math.sin(bisectorC) * 3;
                board.create("line", [C, [bisectorCEndX, bisectorCEndY]], {
                    strokeColor: "#B10DC9",
                    strokeWidth: 1,
                    dash: 2,
                });

                // 内接円の半径を計算
                const s =
                    (incenterData.a + incenterData.b + incenterData.c) / 2;
                const radius =
                    Math.sqrt(
                        s *
                            (s - incenterData.a) *
                            (s - incenterData.b) *
                            (s - incenterData.c)
                    ) / s;

                console.log("Incircle radius:", radius);

                // 内接円を描画
                const incircle = board.create("circle", [incenter, radius], {
                    strokeColor: "#B10DC9",
                    strokeWidth: 1,
                    fillColor: "none",
                });

                console.log("Created incircle:", incircle);

                // 説明テキスト
                board.create(
                    "text",
                    [incenterData.x, incenterData.y - 0.5, "内心"],
                    {
                        fontSize: 14,
                        color: "#B10DC9",
                    }
                );

                break;
            }

            case "circumcenter": {
                console.log("Drawing circumcenter...");

                // 外心を手動計算
                const circumcenterCoords = calculateCircumcenter(A, B, C);
                console.log("Circumcenter coordinates:", circumcenterCoords);

                // 外心の点を描画
                const circumcenter = board.create(
                    "point",
                    [circumcenterCoords.x, circumcenterCoords.y],
                    {
                        strokeColor: "#FF851B",
                        fillColor: "#FF851B",
                        size: 4,
                        name: "O",
                    }
                );

                console.log("Created circumcenter point:", circumcenter);

                // 垂直二等分線を手動で描画
                // BCの垂直二等分線
                const midBC = board.create("midpoint", [B, C]);
                const slopeBC = (C.Y() - B.Y()) / (C.X() - B.X());
                const perpSlopeBC = -1 / slopeBC;
                const perpBCEndX =
                    midBC.X() + Math.cos(Math.atan(perpSlopeBC)) * 3;
                const perpBCEndY =
                    midBC.Y() + Math.sin(Math.atan(perpSlopeBC)) * 3;
                board.create("line", [midBC, [perpBCEndX, perpBCEndY]], {
                    strokeColor: "#FF851B",
                    strokeWidth: 1,
                    dash: 2,
                });

                // ACの垂直二等分線
                const midAC = board.create("midpoint", [A, C]);
                const slopeAC = (C.Y() - A.Y()) / (C.X() - A.X());
                const perpSlopeAC = -1 / slopeAC;
                const perpACEndX =
                    midAC.X() + Math.cos(Math.atan(perpSlopeAC)) * 3;
                const perpACEndY =
                    midAC.Y() + Math.sin(Math.atan(perpSlopeAC)) * 3;
                board.create("line", [midAC, [perpACEndX, perpACEndY]], {
                    strokeColor: "#FF851B",
                    strokeWidth: 1,
                    dash: 2,
                });

                // ABの垂直二等分線
                const midAB = board.create("midpoint", [A, B]);
                const slopeAB = (B.Y() - A.Y()) / (B.X() - A.X());
                const perpSlopeAB = -1 / slopeAB;
                const perpABEndX =
                    midAB.X() + Math.cos(Math.atan(perpSlopeAB)) * 3;
                const perpABEndY =
                    midAB.Y() + Math.sin(Math.atan(perpSlopeAB)) * 3;
                board.create("line", [midAB, [perpABEndX, perpABEndY]], {
                    strokeColor: "#FF851B",
                    strokeWidth: 1,
                    dash: 2,
                });

                // 外接円の半径を計算
                const a = Math.sqrt(
                    (B.X() - C.X()) ** 2 + (B.Y() - C.Y()) ** 2
                );
                const b = Math.sqrt(
                    (A.X() - C.X()) ** 2 + (A.Y() - C.Y()) ** 2
                );
                const c = Math.sqrt(
                    (A.X() - B.X()) ** 2 + (A.Y() - B.Y()) ** 2
                );
                const s = (a + b + c) / 2;
                const radius =
                    (a * b * c) /
                    (4 * Math.sqrt(s * (s - a) * (s - b) * (s - c)));

                console.log("Circumcircle radius:", radius);

                // 外接円を描画
                const circumcircle = board.create(
                    "circle",
                    [circumcenter, radius],
                    {
                        strokeColor: "#FF851B",
                        strokeWidth: 1,
                        fillColor: "none",
                    }
                );

                console.log("Created circumcircle:", circumcircle);

                // 説明テキスト
                board.create(
                    "text",
                    [circumcenterCoords.x, circumcenterCoords.y - 0.5, "外心"],
                    {
                        fontSize: 14,
                        color: "#FF851B",
                    }
                );

                break;
            }

            case "orthocenter": {
                console.log("Drawing orthocenter...");

                // 垂心を手動計算
                const orthocenterCoords = calculateOrthocenter(A, B, C);
                console.log("Orthocenter coordinates:", orthocenterCoords);

                // 垂心の点を描画
                const orthocenter = board.create(
                    "point",
                    [orthocenterCoords.x, orthocenterCoords.y],
                    {
                        strokeColor: "#001f3f",
                        fillColor: "#001f3f",
                        size: 4,
                        name: "H",
                    }
                );

                console.log("Created orthocenter point:", orthocenter);

                // 垂線を手動で描画
                // AからBCへの垂線
                const slopeBC = (C.Y() - B.Y()) / (C.X() - B.X());
                const perpSlopeBC = -1 / slopeBC;
                const perpBCEndX = A.X() + Math.cos(Math.atan(perpSlopeBC)) * 3;
                const perpBCEndY = A.Y() + Math.sin(Math.atan(perpSlopeBC)) * 3;
                board.create("line", [A, [perpBCEndX, perpBCEndY]], {
                    strokeColor: "#001f3f",
                    strokeWidth: 1,
                    dash: 2,
                });

                // BからACへの垂線
                const slopeAC = (C.Y() - A.Y()) / (C.X() - A.X());
                const perpSlopeAC = -1 / slopeAC;
                const perpACEndX = B.X() + Math.cos(Math.atan(perpSlopeAC)) * 3;
                const perpACEndY = B.Y() + Math.sin(Math.atan(perpSlopeAC)) * 3;
                board.create("line", [B, [perpACEndX, perpACEndY]], {
                    strokeColor: "#001f3f",
                    strokeWidth: 1,
                    dash: 2,
                });

                // CからABへの垂線
                const slopeAB = (B.Y() - A.Y()) / (B.X() - A.X());
                const perpSlopeAB = -1 / slopeAB;
                const perpABEndX = C.X() + Math.cos(Math.atan(perpSlopeAB)) * 3;
                const perpABEndY = C.Y() + Math.sin(Math.atan(perpSlopeAB)) * 3;
                board.create("line", [C, [perpABEndX, perpABEndY]], {
                    strokeColor: "#001f3f",
                    strokeWidth: 1,
                    dash: 2,
                });

                // 説明テキスト
                board.create(
                    "text",
                    [orthocenterCoords.x, orthocenterCoords.y - 0.5, "垂心"],
                    {
                        fontSize: 14,
                        color: "#001f3f",
                    }
                );

                break;
            }

            default:
                console.warn("Unknown graph type:", graph.type);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <div style={{ padding: 24 }}>
                <h3>参考グラフ ({graphs.length}個)</h3>
                <Slider
                    dots
                    infinite
                    speed={500}
                    slidesToShow={1}
                    slidesToScroll={1}
                >
                    {graphs.map((graph, idx) => {
                        console.log("Rendering graph:", graph);
                        return (
                            <div key={idx}>
                                <div style={{ marginBottom: 8 }}>
                                    {graph.description}
                                </div>
                                <JSXGraphBoard
                                    draw={(board) => drawGraph(board, graph)}
                                    width={400}
                                    height={300}
                                />
                            </div>
                        );
                    })}
                </Slider>
            </div>
        </Dialog>
    );
};

export default GraphModal;
