import React, { useState } from "react";
import { useAIQuestion } from "../hooks/useAIQuestion";
import MathJaxDisplay from "./MathJaxDisplay";

export const AIQuestionBox: React.FC = () => {
    const [question, setQuestion] = useState("");
    const { loading, error, answer, askQuestion, clearAnswer } =
        useAIQuestion();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (question.trim()) {
            askQuestion(question.trim());
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">AIに質問</h3>

            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-4">
                    <label
                        htmlFor="question"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        数学に関する質問を入力してください
                    </label>
                    <textarea
                        id="question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="例: 二次方程式の解の公式を教えてください"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={4}
                        disabled={loading}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !question.trim()}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm lg:text-base font-medium whitespace-nowrap"
                >
                    {loading ? "質問中..." : "質問する"}
                </button>
            </form>

            {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {answer && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">
                        AIの回答
                    </h4>
                    <MathJaxDisplay content={answer} />

                    <button
                        onClick={clearAnswer}
                        className="mt-4 bg-gray-500 text-white py-3 px-4 rounded-md hover:bg-gray-600 transition-colors text-sm lg:text-base font-medium whitespace-nowrap"
                    >
                        クリア
                    </button>
                </div>
            )}
        </div>
    );
};
