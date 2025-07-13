import React from "react";
import type { LearningTopic, LearningStep } from "../data/lessonsData";
import MathJaxDisplay from "./MathJaxDisplay";

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

                <div className="prose max-w-none">
                    <MathJaxDisplay content={currentStep.explanation} />
                </div>
            </div>

            {currentStep.pitfall && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">
                        ⚠️ 注意点
                    </h4>
                    <MathJaxDisplay content={currentStep.pitfall.detail} />
                </div>
            )}

            {currentStep.examples && currentStep.examples.length > 0 && (
                <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3">例題</h4>
                    {currentStep.examples.map((example, index) => (
                        <div
                            key={index}
                            className="mb-4 p-4 bg-gray-50 rounded-lg overflow-hidden"
                        >
                            <MathJaxDisplay content={example.detail} />
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
