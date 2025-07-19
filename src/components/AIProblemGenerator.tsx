import React, { useState } from "react";
import { useAIProblem } from "../hooks/useAIProblem";
import MathJaxDisplay from "./MathJaxDisplay";

interface AIProblemGeneratorProps {
    subject: string;
    topic: string;
}

export const AIProblemGenerator: React.FC<AIProblemGeneratorProps> = ({
    subject,
    topic,
}) => {
    const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
        "medium"
    );
    const { loading, error, problem, generateProblem, clearProblem } =
        useAIProblem();

    const handleGenerate = () => {
        generateProblem(subject, topic, difficulty);
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

    // answerを$...$で囲む（すでに囲まれていなければ）
    function toLatexAnswer(answer: string): string {
        if (!answer) return answer;
        if (/^\$.*\$$/.test(answer)) return answer;
        return `$${answer}$`;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">AI問題生成</h3>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    難易度を選択
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {(["easy", "medium", "hard"] as const).map((diff) => (
                        <button
                            key={diff}
                            onClick={() => setDifficulty(diff)}
                            aria-label={getDifficultyLabel(diff)}
                            className={
                                `flex items-center justify-center px-1 py-2 rounded-md transition-colors w-full h-10 min-w-0 overflow-hidden` +
                                (difficulty === diff
                                    ? " bg-blue-500 text-white"
                                    : " bg-gray-200 text-gray-700 hover:bg-gray-300")
                            }
                        >
                            <span className="block w-full text-center leading-none select-none text-[clamp(0.9rem,4vw,1.2rem)] whitespace-nowrap overflow-hidden">
                                {getDifficultyLabel(diff)}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm lg:text-base font-medium whitespace-nowrap"
            >
                {loading ? "生成中..." : "問題を生成"}
            </button>

            {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {problem && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">
                        生成された問題
                    </h4>

                    <div className="mb-4 overflow-x-auto overflow-y-hidden max-w-full pb-2">
                        <h5 className="font-medium text-gray-700 mb-2">
                            問題:
                        </h5>
                        <MathJaxDisplay content={problem.question} />
                    </div>

                    <details className="mb-4">
                        <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
                            答えを見る
                        </summary>
                        <div className="mt-2">
                            <h6 className="font-medium text-gray-700 mb-2">
                                答え:
                            </h6>
                            <MathJaxDisplay
                                content={toLatexAnswer(problem.answer)}
                            />
                        </div>
                    </details>

                    <details>
                        <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
                            ヒントを見る
                        </summary>
                        <div className="mt-2">
                            <h6 className="font-medium text-gray-700 mb-2">
                                ヒント:
                            </h6>
                            <MathJaxDisplay content={problem.hint} />
                        </div>
                    </details>

                    <button
                        onClick={clearProblem}
                        className="mt-4 bg-gray-500 text-white py-3 px-4 rounded-md hover:bg-gray-600 transition-colors text-sm lg:text-base font-medium whitespace-nowrap"
                    >
                        クリア
                    </button>
                </div>
            )}
        </div>
    );
};
