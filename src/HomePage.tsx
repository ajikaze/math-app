import React, { useState, useEffect } from "react";
import allSubjectsData from "./data/lessonsData"; // 科目データをインポート

// HomePageコンポーネントのPropsの型定義
interface HomePageProps {
    onSelectSubject: (subjectName: string) => void;
}

// 科目の順序を定義（デスクトップ用）
const desktopOrder = ["数学I", "数学A", "数学II", "数学B", "数学III", "数学C"];

// 科目の順序を定義（モバイル用：数学I・II・IIIの下に数学A・B・C）
const mobileOrder = ["数学I", "数学II", "数学III", "数学A", "数学B", "数学C"];

// HomePage コンポーネント
const HomePage: React.FC<HomePageProps> = ({ onSelectSubject }) => {
    const [isMobile, setIsMobile] = useState(false);

    // 画面サイズを検出
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768); // md breakpoint
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);

        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    // 科目の順序を取得する関数
    const getSubjectOrder = (subjectName: string) => {
        const orderArray = isMobile ? mobileOrder : desktopOrder;
        return orderArray.indexOf(subjectName);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex flex-col items-center justify-center p-4 font-inter text-gray-800 overflow-x-hidden">
            <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-2xl w-full mx-auto border-b-4 border-blue-300">
                <h1 className="text-4xl font-extrabold text-blue-700 mb-8">
                    高校数学 学習アプリ
                </h1>
                <p className="text-lg mb-8 text-gray-700">
                    学びたい科目を選んで、高校数学の学習を始めましょう！
                </p>
                <div className="flex flex-wrap gap-4">
                    {Object.keys(allSubjectsData).map((subjectName: string) => (
                        <button
                            key={subjectName}
                            onClick={() => onSelectSubject(subjectName)}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 px-6 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg w-full md:w-[calc(50%-0.5rem)]"
                            style={{
                                order: getSubjectOrder(subjectName),
                            }}
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
