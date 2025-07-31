import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
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

    // 統計グラフ用のboundingbox自動計算関数
    const getBoundingBoxForGraph = (
        graph: GraphData
    ): [number, number, number, number] => {
        switch (graph.type) {
            case "histogram": {
                const data = graph.params.data ?? [];
                if (data.length === 0) return [-4, 4, 4, -4];

                const min = Math.min(...data);
                const max = Math.max(...data);
                const range = max - min;
                const bins = graph.params.bins ?? 5;
                const binWidth = range / bins;

                // 各ビンの頻度を計算
                const frequencies = new Array(bins).fill(0);
                data.forEach((value) => {
                    const binIndex = Math.min(
                        Math.floor((value - min) / binWidth),
                        bins - 1
                    );
                    frequencies[binIndex]++;
                });

                const maxFreq = Math.max(...frequencies);
                const yMax = (maxFreq / Math.max(...frequencies)) * 3; // 最大高さを3に正規化

                // 余白を持たせる
                return [min - 1, yMax + 2, max + 1, -2];
            }

            case "scatter": {
                const pairs = graph.params.dataPairs ?? [];
                if (pairs.length === 0) return [-4, 4, 4, -4];

                const xs = pairs.map(([x]) => x);
                const ys = pairs.map(([, y]) => y);
                const minX = Math.min(...xs);
                const maxX = Math.max(...xs);
                const minY = Math.min(...ys);
                const maxY = Math.max(...ys);

                // 余白を持たせる
                return [minX - 1, maxY + 1, maxX + 1, minY - 1];
            }

            case "boxplot": {
                const data = graph.params.data ?? [];
                if (data.length === 0) return [-4, 4, 4, -4];

                const min = Math.min(...data);
                const max = Math.max(...data);

                // 箱ひげ図はy軸方向に余白を持たせる
                return [min - 2, 3, max + 2, -3];
            }

            default:
                // 幾何・関数グラフは従来通り原点中央
                return [-4, 4, 4, -4];
        }
    };

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

        const style = graph.style || {};

        // グラフタイプに応じて描画
        switch (graph.type) {
            case "triangle":
            case "centroid":
            case "incenter":
            case "circumcenter":
            case "orthocenter": {
                const { points } = graph.params;
                if (!points) {
                    console.error("Points not provided for geometric graph");
                    return;
                }

                // 頂点を作成（ラベルをDEFに変更）
                const A = board.create("point", points[0], {
                    name: "D",
                    size: 3,
                });
                const B = board.create("point", points[1], {
                    name: "E",
                    size: 3,
                });
                const C = board.create("point", points[2], {
                    name: "F",
                    size: 3,
                });

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
                                strokeColor: "#9932CC",
                                fillColor: "#9932CC",
                                size: 4,
                                name: "I",
                            }
                        );

                        // 内接円の半径を計算
                        const s =
                            (incenterData.a + incenterData.b + incenterData.c) /
                            2;
                        const incircleRadius = Math.sqrt(
                            ((s - incenterData.a) *
                                (s - incenterData.b) *
                                (s - incenterData.c)) /
                                s
                        );

                        // 内接円を描画
                        board.create("circle", [incenter, incircleRadius], {
                            strokeColor: "#9932CC",
                            strokeWidth: 2,
                            dash: 1,
                        });

                        // 角の二等分線を描画（補助線）
                        const ax = A.X(),
                            ay = A.Y();
                        const bx = B.X(),
                            by = B.Y();
                        const cx = C.X(),
                            cy = C.Y();

                        // 角Aの二等分線
                        const angleA =
                            Math.atan2(cy - ay, cx - ax) -
                            Math.atan2(by - ay, bx - ax);
                        const bisectorA =
                            Math.atan2(by - ay, bx - ax) + angleA / 2;
                        const bisectorEndA = [
                            ax + Math.cos(bisectorA) * 3,
                            ay + Math.sin(bisectorA) * 3,
                        ];
                        board.create("line", [A, bisectorEndA], {
                            strokeColor: "#9932CC",
                            strokeWidth: 1,
                            dash: 2,
                        });

                        // 角Bの二等分線
                        const angleB =
                            Math.atan2(ay - by, ax - bx) -
                            Math.atan2(cy - by, cx - bx);
                        const bisectorB =
                            Math.atan2(cy - by, cx - bx) + angleB / 2;
                        const bisectorEndB = [
                            bx + Math.cos(bisectorB) * 3,
                            by + Math.sin(bisectorB) * 3,
                        ];
                        board.create("line", [B, bisectorEndB], {
                            strokeColor: "#9932CC",
                            strokeWidth: 1,
                            dash: 2,
                        });

                        // 角Cの二等分線
                        const angleC =
                            Math.atan2(by - cy, bx - cx) -
                            Math.atan2(ay - cy, ax - cx);
                        const bisectorC =
                            Math.atan2(ay - cy, ax - cx) + angleC / 2;
                        const bisectorEndC = [
                            cx + Math.cos(bisectorC) * 3,
                            cy + Math.sin(bisectorC) * 3,
                        ];
                        board.create("line", [C, bisectorEndC], {
                            strokeColor: "#9932CC",
                            strokeWidth: 1,
                            dash: 2,
                        });

                        // 説明テキスト
                        board.create(
                            "text",
                            [incenterData.x, incenterData.y - 0.5, "内心"],
                            {
                                fontSize: 14,
                                color: "#9932CC",
                            }
                        );
                        break;
                    }

                    case "circumcenter": {
                        console.log("Drawing circumcenter...");

                        // 外心を手動計算
                        const circumcenterData = calculateCircumcenter(A, B, C);
                        console.log(
                            "Circumcenter coordinates:",
                            circumcenterData
                        );

                        // 外心の点を描画
                        const circumcenter = board.create(
                            "point",
                            [circumcenterData.x, circumcenterData.y],
                            {
                                strokeColor: "#FF851B",
                                fillColor: "#FF851B",
                                size: 4,
                                name: "O",
                            }
                        );

                        // 外接円の半径を計算
                        const circumcircleRadius = Math.sqrt(
                            (circumcenterData.x - A.X()) ** 2 +
                                (circumcenterData.y - A.Y()) ** 2
                        );

                        // 外接円を描画
                        board.create(
                            "circle",
                            [circumcenter, circumcircleRadius],
                            {
                                strokeColor: "#FF851B",
                                strokeWidth: 2,
                                dash: 1,
                            }
                        );

                        // 垂直二等分線を描画（補助線）
                        const ax = A.X(),
                            ay = A.Y();
                        const bx = B.X(),
                            by = B.Y();
                        const cx = C.X(),
                            cy = C.Y();

                        // ABの垂直二等分線
                        const midAB = [(ax + bx) / 2, (ay + by) / 2];
                        const slopeAB = (by - ay) / (bx - ax);
                        const perpSlopeAB = -1 / slopeAB;
                        const perpEndAB = [
                            midAB[0] + Math.cos(Math.atan(perpSlopeAB)) * 3,
                            midAB[1] + Math.sin(Math.atan(perpSlopeAB)) * 3,
                        ];
                        board.create("line", [midAB, perpEndAB], {
                            strokeColor: "#FF851B",
                            strokeWidth: 1,
                            dash: 2,
                        });

                        // BCの垂直二等分線
                        const midBC = [(bx + cx) / 2, (by + cy) / 2];
                        const slopeBC = (cy - by) / (cx - bx);
                        const perpSlopeBC = -1 / slopeBC;
                        const perpEndBC = [
                            midBC[0] + Math.cos(Math.atan(perpSlopeBC)) * 3,
                            midBC[1] + Math.sin(Math.atan(perpSlopeBC)) * 3,
                        ];
                        board.create("line", [midBC, perpEndBC], {
                            strokeColor: "#FF851B",
                            strokeWidth: 1,
                            dash: 2,
                        });

                        // ACの垂直二等分線
                        const midAC = [(ax + cx) / 2, (ay + cy) / 2];
                        const slopeAC = (cy - ay) / (cx - ax);
                        const perpSlopeAC = -1 / slopeAC;
                        const perpEndAC = [
                            midAC[0] + Math.cos(Math.atan(perpSlopeAC)) * 3,
                            midAC[1] + Math.sin(Math.atan(perpSlopeAC)) * 3,
                        ];
                        board.create("line", [midAC, perpEndAC], {
                            strokeColor: "#FF851B",
                            strokeWidth: 1,
                            dash: 2,
                        });

                        // 説明テキスト
                        board.create(
                            "text",
                            [
                                circumcenterData.x,
                                circumcenterData.y - 0.5,
                                "外心",
                            ],
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
                        const orthocenterData = calculateOrthocenter(A, B, C);
                        console.log(
                            "Orthocenter coordinates:",
                            orthocenterData
                        );

                        // 垂心の点を描画
                        const orthocenter = board.create(
                            "point",
                            [orthocenterData.x, orthocenterData.y],
                            {
                                strokeColor: "#001f3f",
                                fillColor: "#001f3f",
                                size: 4,
                                name: "H",
                            }
                        );

                        // 垂線を描画（補助線）
                        const ax = A.X(),
                            ay = A.Y();
                        const bx = B.X(),
                            by = B.Y();
                        const cx = C.X(),
                            cy = C.Y();

                        // AからBCへの垂線
                        const slopeBC = (cy - by) / (cx - bx);
                        const perpSlopeA = -1 / slopeBC;
                        const perpEndA = [
                            ax + Math.cos(Math.atan(perpSlopeA)) * 3,
                            ay + Math.sin(Math.atan(perpSlopeA)) * 3,
                        ];
                        board.create("line", [A, perpEndA], {
                            strokeColor: "#001f3f",
                            strokeWidth: 1,
                            dash: 2,
                        });

                        // BからACへの垂線
                        const slopeAC = (cy - ay) / (cx - ax);
                        const perpSlopeB = -1 / slopeAC;
                        const perpEndB = [
                            bx + Math.cos(Math.atan(perpSlopeB)) * 3,
                            by + Math.sin(Math.atan(perpSlopeB)) * 3,
                        ];
                        board.create("line", [B, perpEndB], {
                            strokeColor: "#001f3f",
                            strokeWidth: 1,
                            dash: 2,
                        });

                        // CからABへの垂線
                        const slopeAB = (by - ay) / (bx - ax);
                        const perpSlopeC = -1 / slopeAB;
                        const perpEndC = [
                            cx + Math.cos(Math.atan(perpSlopeC)) * 3,
                            cy + Math.sin(Math.atan(perpSlopeC)) * 3,
                        ];
                        board.create("line", [C, perpEndC], {
                            strokeColor: "#001f3f",
                            strokeWidth: 1,
                            dash: 2,
                        });

                        // 説明テキスト
                        board.create(
                            "text",
                            [
                                orthocenterData.x,
                                orthocenterData.y - 0.5,
                                "垂心",
                            ],
                            {
                                fontSize: 14,
                                color: "#001f3f",
                            }
                        );
                        break;
                    }
                }
                break;
            }

            case "linear": {
                console.log("Drawing linear function...");

                const {
                    slope = 1,
                    intercept = 0,
                    domain = [-5, 5],
                } = graph.params;

                // 一次関数を描画
                const linearFunc = (x: number) => slope * x + intercept;
                board.create(
                    "functiongraph",
                    [linearFunc, domain[0], domain[1]],
                    {
                        strokeColor: style.strokeColor || "#FF4136",
                        strokeWidth: style.strokeWidth || 2,
                        ...style,
                    }
                );

                // 切片の点を表示
                board.create("point", [0, intercept], {
                    strokeColor: style.strokeColor || "#FF4136",
                    fillColor: style.strokeColor || "#FF4136",
                    size: 4,
                    name: `(${0}, ${intercept})`,
                });

                // 説明テキスト
                board.create(
                    "text",
                    [
                        domain[1] - 1,
                        linearFunc(domain[1] - 1) + 0.5,
                        `y = ${slope}x + ${intercept}`,
                    ],
                    {
                        fontSize: 14,
                        color: style.strokeColor || "#FF4136",
                    }
                );
                break;
            }

            case "quadratic": {
                console.log("Drawing quadratic function...");

                const { a = 1, b = 0, c = 0, domain = [-5, 5] } = graph.params;

                // 二次関数を描画
                const quadraticFunc = (x: number) => a * x * x + b * x + c;
                board.create(
                    "functiongraph",
                    [quadraticFunc, domain[0], domain[1]],
                    {
                        strokeColor: style.strokeColor || "#0074D9",
                        strokeWidth: style.strokeWidth || 2,
                        ...style,
                    }
                );

                // 頂点を計算して表示
                const vertexX = -b / (2 * a);
                const vertexY = quadraticFunc(vertexX);
                board.create("point", [vertexX, vertexY], {
                    strokeColor: style.strokeColor || "#0074D9",
                    fillColor: style.strokeColor || "#0074D9",
                    size: 4,
                    name: "頂点",
                });

                // 説明テキスト
                board.create(
                    "text",
                    [
                        domain[1] - 1,
                        quadraticFunc(domain[1] - 1) + 1,
                        `y = ${a}x² + ${b}x + ${c}`,
                    ],
                    {
                        fontSize: 14,
                        color: style.strokeColor || "#0074D9",
                    }
                );
                break;
            }

            case "trigonometric": {
                console.log("Drawing trigonometric function...");

                const {
                    trigType = "sin",
                    amplitude = 1,
                    frequency = 1,
                    phase = 0,
                    verticalShift = 0,
                    domain = [-2 * Math.PI, 2 * Math.PI],
                } = graph.params;

                // 三角関数を描画
                const trigFunc = (x: number) => {
                    const baseFunc =
                        trigType === "sin"
                            ? Math.sin
                            : trigType === "cos"
                            ? Math.cos
                            : Math.tan;
                    return (
                        amplitude * baseFunc(frequency * x + phase) +
                        verticalShift
                    );
                };

                board.create(
                    "functiongraph",
                    [trigFunc, domain[0], domain[1]],
                    {
                        strokeColor: style.strokeColor || "#2ECC40",
                        strokeWidth: style.strokeWidth || 2,
                        ...style,
                    }
                );

                // 説明テキスト
                const funcName =
                    trigType === "sin"
                        ? "sin"
                        : trigType === "cos"
                        ? "cos"
                        : "tan";
                board.create(
                    "text",
                    [
                        domain[1] - 1,
                        trigFunc(domain[1] - 1) + 1,
                        `y = ${amplitude}${funcName}(${frequency}x + ${phase}) + ${verticalShift}`,
                    ],
                    {
                        fontSize: 14,
                        color: style.strokeColor || "#2ECC40",
                    }
                );
                break;
            }

            case "exponential": {
                console.log("Drawing exponential function...");

                const { base = 2, scale = 1, domain = [-3, 3] } = graph.params;

                // 指数関数を描画: y = scale * base^x
                const expFunc = (x: number) => scale * Math.pow(base, x);
                board.create("functiongraph", [expFunc, domain[0], domain[1]], {
                    strokeColor: style.strokeColor || "#FF6B6B",
                    strokeWidth: style.strokeWidth || 2,
                    ...style,
                });

                // y切片の点を表示
                board.create("point", [0, scale], {
                    strokeColor: style.strokeColor || "#FF6B6B",
                    fillColor: style.strokeColor || "#FF6B6B",
                    size: 4,
                    name: `(0, ${scale})`,
                });

                // 説明テキスト
                board.create(
                    "text",
                    [
                        domain[1] - 1,
                        expFunc(domain[1] - 1) + 1,
                        `y = ${scale} × ${base}^x`,
                    ],
                    {
                        fontSize: 14,
                        color: style.strokeColor || "#FF6B6B",
                    }
                );
                break;
            }

            case "logarithmic": {
                console.log("Drawing logarithmic function...");

                const {
                    logBase = 2,
                    logScale = 1,
                    logShift = 0,
                    domain = [0.1, 5],
                } = graph.params;

                // 対数関数を描画: y = logScale * log_base(x) + logShift
                const logFunc = (x: number) => {
                    if (x <= 0) return NaN; // 対数関数の定義域外
                    return (
                        logScale * (Math.log(x) / Math.log(logBase)) + logShift
                    );
                };

                board.create("functiongraph", [logFunc, domain[0], domain[1]], {
                    strokeColor: style.strokeColor || "#4ECDC4",
                    strokeWidth: style.strokeWidth || 2,
                    ...style,
                });

                // x切片の点を表示（y=0のときのx値）
                const xIntercept = Math.pow(logBase, -logShift / logScale);
                if (xIntercept > domain[0] && xIntercept < domain[1]) {
                    board.create("point", [xIntercept, 0], {
                        strokeColor: style.strokeColor || "#4ECDC4",
                        fillColor: style.strokeColor || "#4ECDC4",
                        size: 4,
                        name: `(${xIntercept.toFixed(2)}, 0)`,
                    });
                }

                // 説明テキスト
                board.create(
                    "text",
                    [
                        domain[1] - 0.5,
                        logFunc(domain[1] - 0.5) + 0.5,
                        `y = ${logScale}log_${logBase}(x) + ${logShift}`,
                    ],
                    {
                        fontSize: 14,
                        color: style.strokeColor || "#4ECDC4",
                    }
                );
                break;
            }

            case "circle": {
                console.log("Drawing circle...");

                const { center = [0, 0], radius = 2 } = graph.params;

                // 円の中心点を作成
                const centerPoint = board.create("point", center, {
                    strokeColor: style.strokeColor || "#FF4136",
                    fillColor: style.strokeColor || "#FF4136",
                    size: 3,
                    name: "中心",
                });

                // 円を描画
                board.create("circle", [centerPoint, radius], {
                    strokeColor: style.strokeColor || "#FF4136",
                    strokeWidth: style.strokeWidth || 2,
                    fillColor: "none",
                    ...style,
                });

                // 説明テキスト
                board.create(
                    "text",
                    [
                        center[0] + radius + 0.5,
                        center[1] + radius + 0.5,
                        `(x-${center[0]})² + (y-${center[1]})² = ${radius}²`,
                    ],
                    {
                        fontSize: 14,
                        color: style.strokeColor || "#FF4136",
                    }
                );
                break;
            }

            case "ellipse": {
                console.log("Drawing ellipse...");

                const {
                    center = [0, 0],
                    semiMajorAxis = 3,
                    semiMinorAxis = 2,
                } = graph.params;

                // 楕円の中心点を作成
                const centerPoint = board.create("point", center, {
                    strokeColor: style.strokeColor || "#0074D9",
                    fillColor: style.strokeColor || "#0074D9",
                    size: 3,
                    name: "中心",
                });

                // 楕円を描画（JSXGraphでは2つの焦点と点で定義）
                const focus1 = board.create(
                    "point",
                    [
                        center[0] -
                            Math.sqrt(semiMajorAxis ** 2 - semiMinorAxis ** 2),
                        center[1],
                    ],
                    {
                        strokeColor: style.strokeColor || "#0074D9",
                        fillColor: style.strokeColor || "#0074D9",
                        size: 2,
                        name: "F₁",
                    }
                );

                const focus2 = board.create(
                    "point",
                    [
                        center[0] +
                            Math.sqrt(semiMajorAxis ** 2 - semiMinorAxis ** 2),
                        center[1],
                    ],
                    {
                        strokeColor: style.strokeColor || "#0074D9",
                        fillColor: style.strokeColor || "#0074D9",
                        size: 2,
                        name: "F₂",
                    }
                );

                const pointOnEllipse = board.create(
                    "point",
                    [center[0] + semiMajorAxis, center[1]],
                    {
                        strokeColor: style.strokeColor || "#0074D9",
                        fillColor: style.strokeColor || "#0074D9",
                        size: 2,
                        name: "P",
                    }
                );

                board.create("ellipse", [focus1, focus2, pointOnEllipse], {
                    strokeColor: style.strokeColor || "#0074D9",
                    strokeWidth: style.strokeWidth || 2,
                    fillColor: "none",
                    ...style,
                });

                // 説明テキスト
                board.create(
                    "text",
                    [
                        center[0] + semiMajorAxis + 0.5,
                        center[1] + semiMinorAxis + 0.5,
                        `(x-${center[0]})²/${semiMajorAxis}² + (y-${center[1]})²/${semiMinorAxis}² = 1`,
                    ],
                    {
                        fontSize: 14,
                        color: style.strokeColor || "#0074D9",
                    }
                );
                break;
            }

            case "hyperbola": {
                console.log("Drawing hyperbola...");

                const {
                    center = [0, 0],
                    semiMajorAxis = 2,
                    semiMinorAxis = 1,
                    horizontal = true, // 横軸が主軸かどうか
                } = graph.params;

                // 双曲線の中心点を作成
                const centerPoint = board.create("point", center, {
                    strokeColor: style.strokeColor || "#2ECC40",
                    fillColor: style.strokeColor || "#2ECC40",
                    size: 3,
                    name: "中心",
                });

                // 双曲線を描画（関数として定義）
                const hyperbolaFunc = (x: number) => {
                    if (horizontal) {
                        // 横軸が主軸の場合: (x-h)²/a² - (y-k)²/b² = 1
                        const term =
                            (x - center[0]) ** 2 / semiMajorAxis ** 2 - 1;
                        if (term < 0) return NaN;
                        const y1 = center[1] + semiMinorAxis * Math.sqrt(term);
                        const y2 = center[1] - semiMinorAxis * Math.sqrt(term);
                        return [y1, y2];
                    } else {
                        // 縦軸が主軸の場合: (y-k)²/a² - (x-h)²/b² = 1
                        const term = (x - center[0]) ** 2 / semiMinorAxis ** 2;
                        const y1 =
                            center[1] + semiMajorAxis * Math.sqrt(1 + term);
                        const y2 =
                            center[1] - semiMajorAxis * Math.sqrt(1 + term);
                        return [y1, y2];
                    }
                };

                // 双曲線の両枝を描画
                const domain = horizontal
                    ? [
                          center[0] - semiMajorAxis - 2,
                          center[0] + semiMajorAxis + 2,
                      ]
                    : [
                          center[0] - semiMinorAxis - 2,
                          center[0] + semiMinorAxis + 2,
                      ];

                // 上枝
                const upperBranch = (x: number) => {
                    const result = hyperbolaFunc(x);
                    return Array.isArray(result) ? result[0] : result;
                };

                // 下枝
                const lowerBranch = (x: number) => {
                    const result = hyperbolaFunc(x);
                    return Array.isArray(result) ? result[1] : result;
                };

                board.create(
                    "functiongraph",
                    [upperBranch, domain[0], domain[1]],
                    {
                        strokeColor: style.strokeColor || "#2ECC40",
                        strokeWidth: style.strokeWidth || 2,
                        ...style,
                    }
                );

                board.create(
                    "functiongraph",
                    [lowerBranch, domain[0], domain[1]],
                    {
                        strokeColor: style.strokeColor || "#2ECC40",
                        strokeWidth: style.strokeWidth || 2,
                        ...style,
                    }
                );

                // 説明テキスト
                const equation = horizontal
                    ? `(x-${center[0]})²/${semiMajorAxis}² - (y-${center[1]})²/${semiMinorAxis}² = 1`
                    : `(y-${center[1]})²/${semiMajorAxis}² - (x-${center[0]})²/${semiMinorAxis}² = 1`;

                board.create(
                    "text",
                    [domain[1] - 1, center[1] + semiMinorAxis + 1, equation],
                    {
                        fontSize: 14,
                        color: style.strokeColor || "#2ECC40",
                    }
                );
                break;
            }

            case "parabola": {
                console.log("Drawing parabola...");

                const {
                    vertex = [0, 0],
                    focus = [0, 1],
                    horizontal = false, // 縦軸が主軸かどうか
                } = graph.params;

                // 放物線の頂点を作成
                const vertexPoint = board.create("point", vertex, {
                    strokeColor: style.strokeColor || "#FF6B6B",
                    fillColor: style.strokeColor || "#FF6B6B",
                    size: 3,
                    name: "頂点",
                });

                // 焦点を作成
                const focusPoint = board.create("point", focus, {
                    strokeColor: style.strokeColor || "#FF6B6B",
                    fillColor: style.strokeColor || "#FF6B6B",
                    size: 2,
                    name: "焦点",
                });

                // 放物線を描画（関数として定義）
                const parabolaFunc = (x: number) => {
                    if (horizontal) {
                        // 横軸が主軸の場合: x = a(y-k)² + h
                        const a = 1 / (4 * (focus[0] - vertex[0]));
                        return vertex[0] + a * (x - vertex[1]) ** 2;
                    } else {
                        // 縦軸が主軸の場合: y = a(x-h)² + k
                        const a = 1 / (4 * (focus[1] - vertex[1]));
                        return vertex[1] + a * (x - vertex[0]) ** 2;
                    }
                };

                const domain = horizontal
                    ? [vertex[1] - 3, vertex[1] + 3]
                    : [vertex[0] - 3, vertex[0] + 3];

                board.create(
                    "functiongraph",
                    [parabolaFunc, domain[0], domain[1]],
                    {
                        strokeColor: style.strokeColor || "#FF6B6B",
                        strokeWidth: style.strokeWidth || 2,
                        ...style,
                    }
                );

                // 説明テキスト
                const a = horizontal
                    ? 1 / (4 * (focus[0] - vertex[0]))
                    : 1 / (4 * (focus[1] - vertex[1]));

                const equation = horizontal
                    ? `x = ${a.toFixed(2)}(y-${vertex[1]})² + ${vertex[0]}`
                    : `y = ${a.toFixed(2)}(x-${vertex[0]})² + ${vertex[1]}`;

                board.create(
                    "text",
                    [
                        domain[1] - 1,
                        horizontal ? vertex[0] + 1 : vertex[1] + 1,
                        equation,
                    ],
                    {
                        fontSize: 14,
                        color: style.strokeColor || "#FF6B6B",
                    }
                );
                break;
            }

            case "histogram": {
                console.log("Drawing histogram...");

                const { data = [1, 2, 2, 3, 3, 3, 4, 4, 5], bins = 5 } =
                    graph.params;

                // データの最小値と最大値を取得
                const min = Math.min(...data);
                const max = Math.max(...data);
                const range = max - min;
                const binWidth = range / bins;

                // 各ビンの頻度を計算
                const frequencies = new Array(bins).fill(0);
                data.forEach((value) => {
                    const binIndex = Math.min(
                        Math.floor((value - min) / binWidth),
                        bins - 1
                    );
                    frequencies[binIndex]++;
                });

                // ヒストグラムを描画
                frequencies.forEach((freq, index) => {
                    const binStart = min + index * binWidth;
                    const binEnd = binStart + binWidth;
                    const height = (freq / Math.max(...frequencies)) * 3; // 最大高さを3に正規化

                    // 長方形を描画（個別の線分で構成して頂点の点を避ける）
                    // 底辺
                    board.create(
                        "segment",
                        [
                            [binStart, 0],
                            [binEnd, 0],
                        ],
                        {
                            strokeColor: style.strokeColor || "#FF6B6B",
                            strokeWidth: 1,
                        }
                    );
                    // 右辺
                    board.create(
                        "segment",
                        [
                            [binEnd, 0],
                            [binEnd, height],
                        ],
                        {
                            strokeColor: style.strokeColor || "#FF6B6B",
                            strokeWidth: 1,
                        }
                    );
                    // 上辺
                    board.create(
                        "segment",
                        [
                            [binEnd, height],
                            [binStart, height],
                        ],
                        {
                            strokeColor: style.strokeColor || "#FF6B6B",
                            strokeWidth: 1,
                        }
                    );
                    // 左辺
                    board.create(
                        "segment",
                        [
                            [binStart, height],
                            [binStart, 0],
                        ],
                        {
                            strokeColor: style.strokeColor || "#FF6B6B",
                            strokeWidth: 1,
                        }
                    );

                    // 塗りつぶし用の多角形（頂点は非表示）
                    const rect = board.create(
                        "polygon",
                        [
                            [binStart, 0],
                            [binEnd, 0],
                            [binEnd, height],
                            [binStart, height],
                        ],
                        {
                            fillColor: style.fillColor || "#FF6B6B",
                            vertices: { visible: false },
                            borders: { visible: false }, // 境界線を非表示にして重複を避ける
                        }
                    );

                    // 頻度ラベル
                    if (freq > 0) {
                        board.create(
                            "text",
                            [
                                (binStart + binEnd) / 2,
                                height + 0.1,
                                freq.toString(),
                            ],
                            {
                                fontSize: 12,
                                color: style.strokeColor || "#FF6B6B",
                            }
                        );
                    }
                });

                // 説明テキスト
                board.create(
                    "text",
                    [-3.5, 3.5, `データ数: ${data.length}, ビン数: ${bins}`],
                    {
                        fontSize: 14,
                        color: style.strokeColor || "#FF6B6B",
                    }
                );
                break;
            }

            case "scatter": {
                console.log("Drawing scatter plot...");

                const {
                    dataPairs = [
                        [1, 2],
                        [2, 3],
                        [3, 1],
                        [4, 4],
                        [5, 2],
                    ],
                } = graph.params;

                // 散布図の点を描画
                dataPairs.forEach(([x, y], index) => {
                    board.create("point", [x, y], {
                        strokeColor: style.strokeColor || "#0074D9",
                        fillColor: style.fillColor || "#0074D9",
                        size: 3,
                        name: `(${x}, ${y})`,
                    });
                });

                // 相関係数を計算（簡易版）
                const n = dataPairs.length;
                const sumX = dataPairs.reduce((sum, [x]) => sum + x, 0);
                const sumY = dataPairs.reduce((sum, [, y]) => sum + y, 0);
                const sumXY = dataPairs.reduce((sum, [x, y]) => sum + x * y, 0);
                const sumX2 = dataPairs.reduce((sum, [x]) => sum + x * x, 0);
                const sumY2 = dataPairs.reduce((sum, [, y]) => sum + y * y, 0);

                const correlation =
                    (n * sumXY - sumX * sumY) /
                    Math.sqrt(
                        (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
                    );

                // 説明テキスト
                board.create(
                    "text",
                    [-3.5, 3.5, `相関係数: ${correlation.toFixed(3)}`],
                    {
                        fontSize: 14,
                        color: style.strokeColor || "#0074D9",
                    }
                );
                break;
            }

            case "boxplot": {
                console.log("Drawing box plot...");

                const { data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] } = graph.params;

                // データをソート
                const sortedData = [...data].sort((a, b) => a - b);
                const n = sortedData.length;

                // 統計量を計算
                const min = sortedData[0];
                const max = sortedData[n - 1];
                const q1 = sortedData[Math.floor(n * 0.25)];
                const median =
                    n % 2 === 0
                        ? (sortedData[n / 2 - 1] + sortedData[n / 2]) / 2
                        : sortedData[Math.floor(n / 2)];
                const q3 = sortedData[Math.floor(n * 0.75)];

                // 箱ひげ図を描画
                const boxHeight = 0.5;
                const y = 0;

                // 箱（Q1からQ3）
                board.create(
                    "polygon",
                    [
                        [q1, y - boxHeight / 2],
                        [q3, y - boxHeight / 2],
                        [q3, y + boxHeight / 2],
                        [q1, y + boxHeight / 2],
                    ],
                    {
                        strokeColor: style.strokeColor || "#2ECC40",
                        fillColor: style.fillColor || "#2ECC40",
                        strokeWidth: 1,
                        ...style,
                    }
                );

                // 中央線（メディアン）
                board.create(
                    "line",
                    [
                        [median, y - boxHeight / 2],
                        [median, y + boxHeight / 2],
                    ],
                    {
                        strokeColor: "#000",
                        strokeWidth: 2,
                    }
                );

                // ひげ（最小値からQ1、Q3から最大値）
                board.create(
                    "line",
                    [
                        [min, y],
                        [q1, y],
                    ],
                    {
                        strokeColor: style.strokeColor || "#2ECC40",
                        strokeWidth: 2,
                    }
                );
                board.create(
                    "line",
                    [
                        [q3, y],
                        [max, y],
                    ],
                    {
                        strokeColor: style.strokeColor || "#2ECC40",
                        strokeWidth: 2,
                    }
                );

                // ひげの端の線
                board.create(
                    "line",
                    [
                        [min, y - 0.1],
                        [min, y + 0.1],
                    ],
                    {
                        strokeColor: style.strokeColor || "#2ECC40",
                        strokeWidth: 2,
                    }
                );
                board.create(
                    "line",
                    [
                        [max, y - 0.1],
                        [max, y + 0.1],
                    ],
                    {
                        strokeColor: style.strokeColor || "#2ECC40",
                        strokeWidth: 2,
                    }
                );

                // 統計量のラベル
                board.create("text", [min, y - 1, `Min: ${min}`], {
                    fontSize: 12,
                    color: style.strokeColor || "#2ECC40",
                });
                board.create("text", [q1, y - 1, `Q1: ${q1}`], {
                    fontSize: 12,
                    color: style.strokeColor || "#2ECC40",
                });
                board.create("text", [median, y - 1, `Med: ${median}`], {
                    fontSize: 12,
                    color: style.strokeColor || "#2ECC40",
                });
                board.create("text", [q3, y - 1, `Q3: ${q3}`], {
                    fontSize: 12,
                    color: style.strokeColor || "#2ECC40",
                });
                board.create("text", [max, y - 1, `Max: ${max}`], {
                    fontSize: 12,
                    color: style.strokeColor || "#2ECC40",
                });

                // 説明テキスト
                board.create("text", [-3.5, 2, `データ数: ${n}`], {
                    fontSize: 14,
                    color: style.strokeColor || "#2ECC40",
                });
                break;
            }

            default:
                console.warn("Unknown graph type:", graph.type);
                break;
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <span>参考グラフ ({graphs.length}個)</span>
            </DialogTitle>
            {/* 固定位置の閉じるボタン */}
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: "fixed",
                    right: 24,
                    top: 24,
                    color: "white",
                    zIndex: 9999,
                    // backgroundColor: "rgba(255, 255, 255, 0.9)",
                    // "&:hover": {
                    //     backgroundColor: "rgba(255, 255, 255, 1)",
                    // },
                }}
            >
                <CloseIcon />
            </IconButton>
            <div style={{ padding: "0 24px 24px 24px" }}>
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
                                    boundingbox={getBoundingBoxForGraph(graph)}
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
