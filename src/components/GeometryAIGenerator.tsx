import React, { useState } from "react";
import { useAIProblem } from "../hooks/useAIProblem";
import MathJaxDisplay from "./MathJaxDisplay";
import GeometryViewer from "./GeometryViewer";
import { toLatexMath } from "../data/lessonsData";

interface GeometryAIGeneratorProps {
    subject: string;
    topic: string;
}

export const GeometryAIGenerator: React.FC<GeometryAIGeneratorProps> = ({
    subject,
    topic,
}) => {
    const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
        "medium"
    );
    const [geometryType, setGeometryType] = useState<
        "triangle" | "circle" | "function" | "auto"
    >("auto");
    const { loading, error, problem, generateProblem, clearProblem } =
        useAIProblem();

    const handleGenerate = () => {
        // 図形タイプに応じたプロンプトを生成
        let enhancedPrompt = "";
        switch (geometryType) {
            case "triangle":
                enhancedPrompt = `図形問題（三角形）を含む`;
                break;
            case "circle":
                enhancedPrompt = `図形問題（円）を含む`;
                break;
            case "function":
                enhancedPrompt = `関数のグラフ問題を含む`;
                break;
            case "auto":
            default:
                enhancedPrompt = `可能であれば図形やグラフを含む`;
                break;
        }

        generateProblem(subject, topic, difficulty, enhancedPrompt);
    };

    const getDifficultyLabel = (diff: string) => {
        switch (diff) {
            case "easy":
                return "初級";
            case "medium":
                return "中級";
            case "hard":
                return "上級";
            default:
                return diff;
        }
    };

    // 問題文から図形データを自動生成
    const generateGeometryFromProblem = (problemText: string) => {
        const text = problemText.toLowerCase();

        // 三角形関連
        if (text.includes("三角形") || text.includes("三角")) {
            return {
                type: "triangle" as const,
                data: {
                    points: [
                        { x: -3, y: -2 },
                        { x: 3, y: -2 },
                        { x: 0, y: 3 },
                    ],
                },
                title: "問題に関連する三角形",
                description: toLatexMath(`
                    この三角形は問題の理解を助けるための例です。
                    頂点 $A(-3, -2)$, $B(3, -2)$, $C(0, 3)$ で構成されています。
                `),
            };
        }

        // 円関連
        if (
            text.includes("円") ||
            text.includes("半径") ||
            text.includes("直径")
        ) {
            return {
                type: "circle" as const,
                data: {
                    center: { x: 0, y: 0 },
                    radius: 4,
                },
                title: "問題に関連する円",
                description: toLatexMath(`
                    この円は問題の理解を助けるための例です。
                    中心 $(0, 0)$、半径 $4$ の円です。
                `),
            };
        }

        // 関数関連
        if (
            text.includes("関数") ||
            text.includes("グラフ") ||
            text.includes("放物線")
        ) {
            const quadraticFunction = (x: number) => x * x - 4;
            return {
                type: "function" as const,
                data: { function: quadraticFunction },
                title: "問題に関連する関数グラフ",
                description: toLatexMath(`
                    この関数は問題の理解を助けるための例です。
                    $y = x^2 - 4$ のグラフです。
                `),
            };
        }

        return null;
    };

    // answerを$...$で囲む（すでに囲まれていなければ）
    function toLatexAnswer(answer: string): string {
        if (!answer) return answer;
        if (/^\$.*\$$/.test(answer)) return answer;
        return `$${answer}$`;
    }

    const geometryData = problem
        ? generateGeometryFromProblem(problem.question)
        : null;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
                AI図形問題生成
            </h3>

            <div className="mb-4 space-y-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        難易度
                    </label>
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as any)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="easy">初級</option>
                        <option value="medium">中級</option>
                        <option value="hard">上級</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        図形タイプ
                    </label>
                    <select
                        value={geometryType}
                        onChange={(e) => setGeometryType(e.target.value as any)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="auto">自動選択</option>
                        <option value="triangle">三角形</option>
                        <option value="circle">円</option>
                        <option value="function">関数グラフ</option>
                    </select>
                </div>
            </div>

            <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm lg:text-base font-medium whitespace-nowrap"
            >
                {loading ? "生成中..." : "図形問題を生成"}
            </button>

            {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {problem && (
                <div className="mt-6 space-y-4">
                    <h4 className="font-semibold text-gray-800 mb-3">
                        生成された図形問題
                    </h4>

                    {/* 問題文 */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h5 className="font-medium text-gray-700 mb-2">
                            問題:
                        </h5>
                        <MathJaxDisplay content={problem.question} />
                    </div>

                    {/* 図形・グラフの表示 */}
                    {geometryData && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <GeometryViewer
                                type={geometryData.type}
                                title={geometryData.title}
                                description={geometryData.description}
                                data={geometryData.data}
                                interactive={true}
                                width={400}
                                height={300}
                            />
                        </div>
                    )}

                    {/* 答えとヒント */}
                    <div className="space-y-3">
                        <details className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
                                答えを見る
                            </summary>
                            <div className="mt-2">
                                <MathJaxDisplay
                                    content={toLatexAnswer(problem.answer)}
                                />
                            </div>
                        </details>

                        <details className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
                                ヒントを見る
                            </summary>
                            <div className="mt-2">
                                <MathJaxDisplay content={problem.hint} />
                            </div>
                        </details>
                    </div>

                    <button
                        onClick={clearProblem}
                        className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors text-sm font-medium"
                    >
                        クリア
                    </button>
                </div>
            )}
        </div>
    );
};

export default GeometryAIGenerator;
