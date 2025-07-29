import React, { useState } from "react";
import type { LearningTopic, LearningStep } from "../data/lessonsData";
import MathJaxDisplay from "./MathJaxDisplay";
import GeometryViewer from "./GeometryViewer";
import { toLatexMath } from "../data/lessonsData";

interface EnhancedLessonViewerProps {
    currentTopic: LearningTopic;
    currentStep: LearningStep;
    currentStepIndex: number;
    onNextStep: () => void;
    onPreviousStep: () => void;
    canGoNext: boolean;
    canGoPrevious: boolean;
}

export const EnhancedLessonViewer: React.FC<EnhancedLessonViewerProps> = ({
    currentTopic,
    currentStep,
    currentStepIndex,
    onNextStep,
    onPreviousStep,
    canGoNext,
    canGoPrevious,
}) => {
    const [showAnswers, setShowAnswers] = useState<boolean[]>([]);
    const [showHints, setShowHints] = useState<boolean[]>([]);

    // ステップが変わったらリセット
    React.useEffect(() => {
        setShowAnswers(
            currentStep.problems
                ? Array(currentStep.problems.length).fill(false)
                : []
        );
        setShowHints(
            currentStep.problems
                ? Array(currentStep.problems.length).fill(false)
                : []
        );
    }, [currentStep]);

    // 図形データの生成（ステップの内容に基づいて）
    const generateGeometryData = () => {
        const stepTitle = currentStep.title.toLowerCase();
        const stepContent = currentStep.explanation.toLowerCase();

        // 三角形関連
        if (stepTitle.includes("三角形") || stepContent.includes("三角形")) {
            return {
                type: "triangle" as const,
                data: {
                    points: [
                        { x: -3, y: -2 },
                        { x: 3, y: -2 },
                        { x: 0, y: 3 },
                    ],
                },
                title: "三角形の例",
                description: toLatexMath(`
                    この三角形は、3つの頂点 $A(-3, -2)$, $B(3, -2)$, $C(0, 3)$ で構成されています。
                    
                    三角形の性質：
                    • 面積は底辺 × 高さ ÷ 2 で計算できます
                    • 内角の和は $180°$ です
                    • 外角は隣り合わない内角の和に等しいです
                `),
            };
        }

        // 円関連
        if (stepTitle.includes("円") || stepContent.includes("円")) {
            return {
                type: "circle" as const,
                data: {
                    center: { x: 0, y: 0 },
                    radius: 4,
                },
                title: "円の例",
                description: toLatexMath(`
                    この円は中心 $(0, 0)$、半径 $4$ の円です。
                    
                    円の性質：
                    • 面積: $A = \\pi r^2 = \\pi \\times 4^2 = 16\\pi$
                    • 円周: $C = 2\\pi r = 2\\pi \\times 4 = 8\\pi$
                    • 円周上の任意の点から中心までの距離は一定です
                `),
            };
        }

        // 二次関数関連
        if (
            stepTitle.includes("二次関数") ||
            stepContent.includes("二次関数")
        ) {
            const quadraticFunction = (x: number) => x * x - 4;
            return {
                type: "function" as const,
                data: { function: quadraticFunction },
                title: "二次関数 $y = x^2 - 4$",
                description: toLatexMath(`
                    この関数は $y = x^2 - 4$ のグラフです。
                    
                    二次関数の性質：
                    • 頂点は $(0, -4)$ です
                    • $x$ 軸との交点は $x = \\pm 2$ です
                    • 上に凸の放物線です
                    • 軸対称性があります
                `),
            };
        }

        // 三角関数関連
        if (
            stepTitle.includes("三角関数") ||
            stepContent.includes("三角関数")
        ) {
            const sineFunction = (x: number) => 2 * Math.sin(x);
            return {
                type: "function" as const,
                data: { function: sineFunction },
                title: "正弦関数 $y = 2\\sin(x)$",
                description: toLatexMath(`
                    この関数は $y = 2\\sin(x)$ のグラフです。
                    
                    正弦関数の性質：
                    • 振幅は $2$ です
                    • 周期は $2\\pi$ です
                    • 奇関数です（原点対称）
                    • 値域は $[-2, 2]$ です
                `),
            };
        }

        return null;
    };

    const geometryData = generateGeometryData();

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {currentTopic.topic}
                </h2>
                <p className="text-gray-600">
                    ステップ {currentStepIndex + 1} /{" "}
                    {currentTopic.steps.length}
                </p>
            </div>

            <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {currentStep.title}
                </h3>

                <div className="prose max-w-none break-words">
                    {/* ポイント：以降を検出して分割表示 */}
                    {(() => {
                        const explanation = toLatexMath(
                            currentStep.explanation
                        );
                        const pointIdx = explanation.indexOf("ポイント：");
                        if (pointIdx === -1) {
                            return <MathJaxDisplay content={explanation} />;
                        } else {
                            const before = explanation.slice(0, pointIdx);
                            const after = explanation.slice(pointIdx);
                            return (
                                <>
                                    <MathJaxDisplay content={before} />
                                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="font-semibold text-blue-800 mb-2 flex items-center">
                                            <span className="mr-1">💡</span>
                                            ポイント
                                        </div>
                                        <MathJaxDisplay
                                            content={after
                                                .replace(/^ポイント：/, "")
                                                .replace(/^ポイント/, "")
                                                .replace(/^<br\s*\/?\s*>/, "")}
                                        />
                                    </div>
                                </>
                            );
                        }
                    })()}
                </div>

                {/* 図形・グラフの表示 */}
                {geometryData && (
                    <div className="mt-6">
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
            </div>

            {currentStep.pitfall && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">
                        ⚠️ 注意点
                    </h4>
                    <MathJaxDisplay
                        content={toLatexMath(currentStep.pitfall.detail)}
                    />
                </div>
            )}

            {currentStep.problems && currentStep.problems.length > 0 && (
                <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3">例題</h4>
                    {currentStep.problems.map((problem, index) => (
                        <div
                            key={index}
                            className="mb-4 p-4 bg-gray-50 rounded-lg overflow-hidden"
                        >
                            <div className="mb-2 flex flex-row items-start gap-2 bg-gray-50 border-l-4 border-blue-400 pl-3 rounded">
                                <span className="font-semibold text-blue-700 min-w-[3.5rem] whitespace-nowrap flex-shrink-0">
                                    問題：
                                </span>
                                <div className="flex-1 break-words font-semibold">
                                    <MathJaxDisplay
                                        content={toLatexMath(problem.question)}
                                    />
                                </div>
                            </div>
                            <div className="mt-8 flex flex-row items-center gap-2 justify-end">
                                {problem.hint && (
                                    <button
                                        onClick={() => {
                                            const newShowHints = [...showHints];
                                            newShowHints[index] =
                                                !newShowHints[index];
                                            setShowHints(newShowHints);
                                        }}
                                        className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-sm"
                                    >
                                        {showHints[index]
                                            ? "ヒントを隠す"
                                            : "ヒントを見る"}
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        const newShowAnswers = [...showAnswers];
                                        newShowAnswers[index] =
                                            !newShowAnswers[index];
                                        setShowAnswers(newShowAnswers);
                                    }}
                                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                                >
                                    {showAnswers[index]
                                        ? "答えを隠す"
                                        : "答えを見る"}
                                </button>
                            </div>
                            {showAnswers[index] && (
                                <div className="mt-4 mb-2 ml-1 p-3 bg-blue-50 border border-blue-200 rounded transition-all">
                                    <MathJaxDisplay
                                        content={toLatexMath(problem.answer)}
                                    />
                                </div>
                            )}
                            {showHints[index] && problem.hint && (
                                <div className="mt-4 mb-2 ml-1 p-3 bg-yellow-50 border border-yellow-200 rounded transition-all">
                                    <MathJaxDisplay
                                        content={toLatexMath(problem.hint)}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <button
                    onClick={onPreviousStep}
                    disabled={!canGoPrevious}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    前へ
                </button>

                <button
                    onClick={onNextStep}
                    disabled={!canGoNext}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    次へ
                </button>
            </div>
        </div>
    );
};

export default EnhancedLessonViewer;
