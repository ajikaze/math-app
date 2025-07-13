import React from "react";
import allSubjectsData from "./data/lessonsData"; // 科目データをインポート

// HomePageコンポーネントのPropsの型定義
interface HomePageProps {
    onSelectSubject: (subjectName: string) => void;
}

// HomePage コンポーネント
const HomePage: React.FC<HomePageProps> = ({ onSelectSubject }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex flex-col items-center justify-center p-4 font-inter text-gray-800 overflow-x-hidden">
            <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-2xl w-full mx-auto border-b-4 border-blue-300">
                <h1 className="text-4xl font-extrabold text-blue-700 mb-8">
                    高校数学 学習アプリ
                </h1>
                <p className="text-lg mb-8 text-gray-700">
                    学びたい科目を選んで、高校数学の学習を始めましょう！
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(allSubjectsData).map((subjectName: string) => (
                        <button
                            key={subjectName}
                            onClick={() => onSelectSubject(subjectName)}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 px-6 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                        >
                            {subjectName}
                        </button>
                    ))}
                </div>
            </div>
            <p className="mt-8 text-gray-600 text-center">
                あなたの学習を全力でサポートします！
            </p>
        </div>
    );
};

export default HomePage;
