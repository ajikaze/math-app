import React, { useState, useEffect } from "react";
import HomePage from "./HomePage";
import { SubjectPage } from "./pages/SubjectPage";
import loadMathJax from "./MathJaxLoader";
import allSubjectsData, { type LearningTopic } from "./data/lessonsData"; // 型定義をインポート

// メインの App コンポーネント
const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<"home" | "subject">("home"); // 'home' or 'subject'
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null); // 例: '数学I'

    // MathJaxのロードはAppコンポーネントで一度だけ行う
    useEffect(() => {
        loadMathJax();
    }, []);

    const handleSelectSubject = (subjectName: string): void => {
        setSelectedSubject(subjectName);
        setCurrentPage("subject");
    };

    const handleBackToHome = (): void => {
        setCurrentPage("home");
        setSelectedSubject(null);
    };

    if (currentPage === "home") {
        return <HomePage onSelectSubject={handleSelectSubject} />;
    } else if (currentPage === "subject" && selectedSubject) {
        const lessonsForSubject: LearningTopic[] =
            allSubjectsData[selectedSubject];
        return (
            <SubjectPage
                subjectName={selectedSubject}
                lessonsData={lessonsForSubject}
                onBackToHome={handleBackToHome}
            />
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-800">
            <p className="text-xl font-bold">
                エラー: ページが見つかりません。
            </p>
        </div>
    );
};

export default App;
