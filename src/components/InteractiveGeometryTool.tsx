import React, { useState } from "react";
import GeometryCanvas from "./GeometryCanvas";
import MathJaxDisplay from "./MathJaxDisplay";
import { toLatexMath } from "../data/lessonsData";
import {
    calculateTriangleProperties,
    calculateCircleProperties,
} from "../utils/geometryCalculations";

interface InteractiveGeometryToolProps {
    className?: string;
}

export const InteractiveGeometryTool: React.FC<
    InteractiveGeometryToolProps
> = ({ className = "" }) => {
    const [selectedTool, setSelectedTool] = useState<
        "triangle" | "circle" | "function"
    >("triangle");
    const [trianglePoints, setTrianglePoints] = useState([
        { x: -3, y: -2 },
        { x: 3, y: -2 },
        { x: 0, y: 3 },
    ]);
    const [circleData, setCircleData] = useState({
        center: { x: 0, y: 0 },
        radius: 4,
    });
    const [showCalculations, setShowCalculations] = useState(false);

    // 三角形の計算結果
    const triangleCalculations = calculateTriangleProperties({
        type: "triangle",
        id: "interactive-triangle",
        points: trianglePoints as [any, any, any],
    });

    // 円の計算結果
    const circleCalculations = calculateCircleProperties({
        type: "circle",
        id: "interactive-circle",
        center: circleData.center,
        radius: circleData.radius,
    });

    const handleTrianglePointChange = (
        index: number,
        newPoint: { x: number; y: number }
    ) => {
        const newPoints = [...trianglePoints];
        newPoints[index] = newPoint;
        setTrianglePoints(newPoints);
    };

    const handleCircleChange = (property: "center" | "radius", value: any) => {
        if (property === "center") {
            setCircleData({ ...circleData, center: value });
        } else {
            setCircleData({ ...circleData, radius: value });
        }
    };

    const getCurrentGeometryData = () => {
        switch (selectedTool) {
            case "triangle":
                return {
                    type: "triangle" as const,
                    data: { points: trianglePoints },
                };
            case "circle":
                return {
                    type: "circle" as const,
                    data: circleData,
                };
            case "function":
                const quadraticFunction = (x: number) => x * x - 4;
                return {
                    type: "function" as const,
                    data: { function: quadraticFunction },
                };
            default:
                return null;
        }
    };

    const geometryData = getCurrentGeometryData();

    return (
        <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
            <h3 className="text-xl font-bold mb-4 text-gray-800">
                インタラクティブ図形ツール
            </h3>

            {/* ツール選択 */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    図形タイプ
                </label>
                <div className="flex space-x-2">
                    {["triangle", "circle", "function"].map((tool) => (
                        <button
                            key={tool}
                            onClick={() => setSelectedTool(tool as any)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                selectedTool === tool
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            {tool === "triangle" && "三角形"}
                            {tool === "circle" && "円"}
                            {tool === "function" && "関数"}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 図形表示エリア */}
                <div>
                    <h4 className="font-semibold text-gray-800 mb-3">
                        図形表示
                    </h4>
                    {geometryData && (
                        <GeometryCanvas
                            type={geometryData.type}
                            data={geometryData.data}
                            interactive={true}
                            width={400}
                            height={300}
                        />
                    )}
                </div>

                {/* コントロールパネル */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800 mb-3">
                        コントロール
                    </h4>

                    {selectedTool === "triangle" && (
                        <div className="space-y-3">
                            <h5 className="font-medium text-gray-700">
                                三角形の頂点
                            </h5>
                            {trianglePoints.map((point, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-2 gap-2"
                                >
                                    <label className="text-sm text-gray-600">
                                        点{String.fromCharCode(65 + index)} X:
                                    </label>
                                    <input
                                        type="number"
                                        value={point.x}
                                        onChange={(e) =>
                                            handleTrianglePointChange(index, {
                                                ...point,
                                                x:
                                                    parseFloat(
                                                        e.target.value
                                                    ) || 0,
                                            })
                                        }
                                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                                        step="0.5"
                                    />
                                    <label className="text-sm text-gray-600">
                                        点{String.fromCharCode(65 + index)} Y:
                                    </label>
                                    <input
                                        type="number"
                                        value={point.y}
                                        onChange={(e) =>
                                            handleTrianglePointChange(index, {
                                                ...point,
                                                y:
                                                    parseFloat(
                                                        e.target.value
                                                    ) || 0,
                                            })
                                        }
                                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                                        step="0.5"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {selectedTool === "circle" && (
                        <div className="space-y-3">
                            <h5 className="font-medium text-gray-700">
                                円の設定
                            </h5>
                            <div className="grid grid-cols-2 gap-2">
                                <label className="text-sm text-gray-600">
                                    中心 X:
                                </label>
                                <input
                                    type="number"
                                    value={circleData.center.x}
                                    onChange={(e) =>
                                        handleCircleChange("center", {
                                            ...circleData.center,
                                            x: parseFloat(e.target.value) || 0,
                                        })
                                    }
                                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                                    step="0.5"
                                />
                                <label className="text-sm text-gray-600">
                                    中心 Y:
                                </label>
                                <input
                                    type="number"
                                    value={circleData.center.y}
                                    onChange={(e) =>
                                        handleCircleChange("center", {
                                            ...circleData.center,
                                            y: parseFloat(e.target.value) || 0,
                                        })
                                    }
                                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                                    step="0.5"
                                />
                                <label className="text-sm text-gray-600">
                                    半径:
                                </label>
                                <input
                                    type="number"
                                    value={circleData.radius}
                                    onChange={(e) =>
                                        handleCircleChange(
                                            "radius",
                                            parseFloat(e.target.value) || 1
                                        )
                                    }
                                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                                    min="0.1"
                                    step="0.1"
                                />
                            </div>
                        </div>
                    )}

                    {/* 計算結果表示 */}
                    <div className="mt-4">
                        <button
                            onClick={() =>
                                setShowCalculations(!showCalculations)
                            }
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                            {showCalculations
                                ? "計算結果を隠す"
                                : "計算結果を表示"}
                        </button>

                        {showCalculations && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                <h5 className="font-medium text-gray-700 mb-2">
                                    計算結果
                                </h5>
                                {selectedTool === "triangle" && (
                                    <div className="text-sm space-y-1">
                                        <div>
                                            面積:{" "}
                                            {triangleCalculations.area?.toFixed(
                                                2
                                            )}
                                        </div>
                                        <div>
                                            周長:{" "}
                                            {triangleCalculations.perimeter?.toFixed(
                                                2
                                            )}
                                        </div>
                                        <div>
                                            辺の長さ:{" "}
                                            {triangleCalculations.sides
                                                ?.map((s) => s.toFixed(2))
                                                .join(", ")}
                                        </div>
                                        <div>
                                            角度:{" "}
                                            {triangleCalculations.angles
                                                ?.map(
                                                    (a) =>
                                                        (
                                                            (a * 180) /
                                                            Math.PI
                                                        ).toFixed(1) + "°"
                                                )
                                                .join(", ")}
                                        </div>
                                    </div>
                                )}
                                {selectedTool === "circle" && (
                                    <div className="text-sm space-y-1">
                                        <div>
                                            面積:{" "}
                                            {circleCalculations.area?.toFixed(
                                                2
                                            )}
                                        </div>
                                        <div>
                                            円周:{" "}
                                            {circleCalculations.perimeter?.toFixed(
                                                2
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 学習ヒント */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">
                    💡 学習のヒント
                </h4>
                <div className="text-sm text-blue-700">
                    {selectedTool === "triangle" && (
                        <MathJaxDisplay
                            content={toLatexMath(`
                                三角形の性質を観察してみましょう：
                                • 頂点を動かすと面積や角度が変化します
                                • 内角の和は常に $180°$ です
                                • 辺の長さと角度の関係を確認してください
                            `)}
                        />
                    )}
                    {selectedTool === "circle" && (
                        <MathJaxDisplay
                            content={toLatexMath(`
                                円の性質を観察してみましょう：
                                • 半径を変えると面積と円周が比例して変化します
                                • 面積は $\\pi r^2$、円周は $2\\pi r$ です
                                • 中心を動かしても円の形状は変わりません
                            `)}
                        />
                    )}
                    {selectedTool === "function" && (
                        <MathJaxDisplay
                            content={toLatexMath(`
                                関数のグラフを観察してみましょう：
                                • 二次関数 $y = x^2 - 4$ の放物線です
                                • 頂点は $(0, -4)$ です
                                • $x$ 軸との交点は $x = \\pm 2$ です
                            `)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default InteractiveGeometryTool;
