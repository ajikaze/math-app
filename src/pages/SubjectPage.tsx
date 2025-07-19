import React, { useState } from "react";
import type { LearningTopic } from "../data/lessonsData";
import { LessonViewer } from "../components/LessonViewer";
import { AIProblemGenerator } from "../components/AIProblemGenerator";
import { AIQuestionBox } from "../components/AIQuestionBox";

interface SubjectPageProps {
    subjectName: string;
    lessonsData: LearningTopic[];
    onBackToHome: () => void;
}

export const SubjectPage: React.FC<SubjectPageProps> = ({
    subjectName,
    lessonsData,
    onBackToHome,
}) => {
    const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [showTableOfContents, setShowTableOfContents] = useState(false);
    const [reverseLayout, setReverseLayout] = useState(false); // 追加: レイアウト反転状態

    const currentTopic = lessonsData[currentTopicIndex];
    const currentStep = currentTopic?.steps[currentStepIndex];

    const canGoNext =
        currentTopic && currentStepIndex < currentTopic.steps.length - 1;
    const canGoPrevious = currentStepIndex > 0 || currentTopicIndex > 0;

    const handleNextStep = () => {
        if (currentTopic && currentStepIndex < currentTopic.steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        } else if (currentTopicIndex < lessonsData.length - 1) {
            setCurrentTopicIndex(currentTopicIndex + 1);
            setCurrentStepIndex(0);
        }
    };

    const handlePreviousStep = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1);
        } else if (currentTopicIndex > 0) {
            setCurrentTopicIndex(currentTopicIndex - 1);
            setCurrentStepIndex(
                lessonsData[currentTopicIndex - 1].steps.length - 1
            );
        }
    };

    const handleNavigateToStep = (topicIdx: number, stepIdx: number) => {
        setCurrentTopicIndex(topicIdx);
        setCurrentStepIndex(stepIdx);
        setShowTableOfContents(false);
    };

    if (!currentTopic || !currentStep) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center py-8">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">
                            学習コンテンツが見つかりません
                        </h1>
                        <button
                            onClick={onBackToHome}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            ホームに戻る
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen items-center bg-gray-50">
            {/* ヘッダー */}
            <header className="fixed bg-white shadow-sm border-b w-full">
                <div className="xl:max-w-[1280px] xl:mx-auto px-4 py-4 w-full">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                {subjectName}
                            </h1>
                            <p className="text-gray-600">
                                {currentTopic.topic} - {currentStep.title}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() =>
                                    setShowTableOfContents(!showTableOfContents)
                                }
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                            >
                                {showTableOfContents ? "閉じる" : "目次"}
                            </button>
                            <button
                                onClick={onBackToHome}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                ホーム
                            </button>
                            <button
                                onClick={() =>
                                    setReverseLayout((prev) => !prev)
                                }
                                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center"
                                title="メインとサイドの幅を逆転"
                            >
                                {/* Google Fonts Material Icons: transition_side */}
                                <span
                                    className={`material-symbols-outlined text-2xl transition-transform duration-300 ${
                                        reverseLayout ? "rotate-180" : ""
                                    }`}
                                    aria-label="幅の比率を切り替え"
                                    style={{ textTransform: "none" }}
                                >
                                    transition_slide
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-col xs:flex-row w-full flex-1 xl:max-w-[1280px] xl:mx-auto px-4 py-4 mt-24">
                {/* メインコンテンツ */}
                <main
                    className={
                        reverseLayout
                            ? "w-full xs:w-1/3 xs:flex-[1] md:flex-[1] xl:flex-none bg-white order-2 xs:order-1"
                            : "w-full xs:w-2/3 xs:flex-[2] md:flex-[2] xl:flex-none bg-white order-1"
                    }
                >
                    <LessonViewer
                        currentTopic={currentTopic}
                        currentStep={currentStep}
                        currentStepIndex={currentStepIndex}
                        onNextStep={handleNextStep}
                        onPreviousStep={handlePreviousStep}
                        canGoNext={canGoNext}
                        canGoPrevious={canGoPrevious}
                    />
                </main>
                {/* サイドバー */}
                <aside
                    className={
                        reverseLayout
                            ? "w-full xs:w-2/3 xs:flex-[2] md:flex-[2] xs:min-w-[150px] xs:max-w-[100%] xl:flex-none bg-gray-100 mb-4 xs:mb-0 xs:mr-6 order-1 xs:order-2"
                            : "w-full xs:w-1/3 xs:flex-[1] md:flex-[1] xs:min-w-[150px] xs:max-w-[400px] xl:flex-none bg-gray-100 mb-4 xs:mb-0 xs:ml-6 order-2"
                    }
                >
                    <div className="space-y-6">
                        {/* AI問題生成 */}
                        <AIProblemGenerator
                            subject={subjectName}
                            topic={currentTopic.topic}
                        />
                        {/* AI質問ボックス */}
                        <AIQuestionBox />
                    </div>
                </aside>
            </div>

            {/* 目次モーダル */}
            {showTableOfContents && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">
                                学習目次
                            </h2>
                            <button
                                onClick={() => setShowTableOfContents(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-4">
                            {lessonsData.map((topic, topicIdx) => (
                                <div
                                    key={topicIdx}
                                    className="border rounded-lg p-4"
                                >
                                    <h3 className="font-semibold text-gray-800 mb-3">
                                        {topic.topic}
                                    </h3>
                                    <div className="space-y-2">
                                        {topic.steps.map((step, stepIdx) => (
                                            <button
                                                key={stepIdx}
                                                onClick={() =>
                                                    handleNavigateToStep(
                                                        topicIdx,
                                                        stepIdx
                                                    )
                                                }
                                                className={`block w-full text-left p-2 rounded-md transition-colors ${
                                                    topicIdx ===
                                                        currentTopicIndex &&
                                                    stepIdx === currentStepIndex
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "hover:bg-gray-100"
                                                }`}
                                            >
                                                {step.title}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
