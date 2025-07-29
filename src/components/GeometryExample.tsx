import React from "react";
import GeometryViewer from "./GeometryViewer";
import { toLatexMath } from "../data/lessonsData";

export const GeometryExample: React.FC = () => {
    // 三角形の例
    const triangleExample = {
        points: [
            { x: -3, y: -2 },
            { x: 3, y: -2 },
            { x: 0, y: 3 },
        ],
    };

    // 円の例
    const circleExample = {
        center: { x: 0, y: 0 },
        radius: 4,
    };

    // 二次関数の例
    const quadraticFunction = (x: number) => x * x - 4;

    // 三角関数の例
    const sineFunction = (x: number) => 2 * Math.sin(x);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                図形・グラフ機能の例
            </h2>

            {/* 三角形の例 */}
            <GeometryViewer
                type="triangle"
                title="三角形の例"
                description={toLatexMath(`
                    この三角形は、3つの頂点 $A(-3, -2)$, $B(3, -2)$, $C(0, 3)$ で構成されています。
                    
                    三角形の性質：
                    • 面積は底辺 × 高さ ÷ 2 で計算できます
                    • 内角の和は $180°$ です
                    • 外角は隣り合わない内角の和に等しいです
                `)}
                data={triangleExample}
                interactive={true}
                width={400}
                height={300}
            />

            {/* 円の例 */}
            <GeometryViewer
                type="circle"
                title="円の例"
                description={toLatexMath(`
                    この円は中心 $(0, 0)$、半径 $4$ の円です。
                    
                    円の性質：
                    • 面積: $A = \\pi r^2 = \\pi \\times 4^2 = 16\\pi$
                    • 円周: $C = 2\\pi r = 2\\pi \\times 4 = 8\\pi$
                    • 円周上の任意の点から中心までの距離は一定です
                `)}
                data={circleExample}
                width={400}
                height={300}
            />

            {/* 二次関数の例 */}
            <GeometryViewer
                type="function"
                title="二次関数 $y = x^2 - 4$"
                description={toLatexMath(`
                    この関数は $y = x^2 - 4$ のグラフです。
                    
                    二次関数の性質：
                    • 頂点は $(0, -4)$ です
                    • $x$ 軸との交点は $x = \\pm 2$ です
                    • 上に凸の放物線です
                    • 軸対称性があります
                `)}
                data={{ function: quadraticFunction }}
                width={400}
                height={300}
            />

            {/* 三角関数の例 */}
            <GeometryViewer
                type="function"
                title="正弦関数 $y = 2\\sin(x)$"
                description={toLatexMath(`
                    この関数は $y = 2\\sin(x)$ のグラフです。
                    
                    正弦関数の性質：
                    • 振幅は $2$ です
                    • 周期は $2\\pi$ です
                    • 奇関数です（原点対称）
                    • 値域は $[-2, 2]$ です
                `)}
                data={{ function: sineFunction }}
                width={400}
                height={300}
            />
        </div>
    );
};

export default GeometryExample;
