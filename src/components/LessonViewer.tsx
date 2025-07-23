import React, { useState } from "react";
import type { LearningTopic, LearningStep } from "../data/lessonsData";
import MathJaxDisplay from "./MathJaxDisplay";
import { toLatexMath } from "../data/lessonsData";

interface LessonViewerProps {
    currentTopic: LearningTopic;
    currentStep: LearningStep;
    currentStepIndex: number;
    onNextStep: () => void;
    onPreviousStep: () => void;
    canGoNext: boolean;
    canGoPrevious: boolean;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
    currentTopic,
    currentStep,
    currentStepIndex,
    onNextStep,
    onPreviousStep,
    canGoNext,
    canGoPrevious,
}) => {
    // 問題ごとの答え・ヒント表示状態
    const [showAnswers, setShowAnswers] = useState<boolean[]>(() =>
        currentStep.problems
            ? Array(currentStep.problems.length).fill(false)
            : []
    );
    const [showHints, setShowHints] = useState<boolean[]>(() =>
        currentStep.problems
            ? Array(currentStep.problems.length).fill(false)
            : []
    );

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
                                <button
                                    className="px-3 py-1 w-32 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium transition-colors"
                                    onClick={() =>
                                        setShowAnswers((arr) =>
                                            arr.map((v, i) =>
                                                i === index ? !v : v
                                            )
                                        )
                                    }
                                >
                                    {showAnswers[index]
                                        ? "答えを隠す"
                                        : "答えを見る"}
                                </button>
                                {problem.hint && (
                                    <button
                                        className="px-3 py-1 w-32 bg-yellow-500 text-white rounded hover:bg-yellow-600 font-medium transition-colors"
                                        onClick={() =>
                                            setShowHints((arr) =>
                                                arr.map((v, i) =>
                                                    i === index ? !v : v
                                                )
                                            )
                                        }
                                    >
                                        {showHints[index]
                                            ? "ヒントを隠す"
                                            : "ヒントを見る"}
                                    </button>
                                )}
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
