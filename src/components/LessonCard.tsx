import React from "react";
import type { Lesson } from "../types";

interface LessonCardProps {
    lesson: Lesson;
    onSelect: (lesson: Lesson) => void;
    isSelected?: boolean;
}

export const LessonCard: React.FC<LessonCardProps> = ({
    lesson,
    onSelect,
    isSelected = false,
}) => {
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "basic":
                return "bg-green-100 text-green-800";
            case "intermediate":
                return "bg-yellow-100 text-yellow-800";
            case "advanced":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div
            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onSelect(lesson)}
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                    {lesson.title}
                </h3>
                <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(
                        lesson.difficulty
                    )}`}
                >
                    {lesson.difficulty === "basic" && "基礎"}
                    {lesson.difficulty === "intermediate" && "中級"}
                    {lesson.difficulty === "advanced" && "上級"}
                </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{lesson.content}</p>
            <div className="flex justify-between items-center text-xs text-gray-500">
                <span>カテゴリ: {lesson.category}</span>
                {lesson.exercises && (
                    <span>{lesson.exercises.length}個の練習問題</span>
                )}
            </div>
        </div>
    );
};
