import { useState } from "react";
import type { AIGeneratedProblem } from "../types";
import { apiService } from "../services/api";

export const useAIProblem = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [problem, setProblem] = useState<AIGeneratedProblem | null>(null);

    const generateProblem = async (
        subject: string,
        topic: string,
        difficulty: "easy" | "medium" | "hard"
    ) => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiService.generateAIProblem(
                subject,
                topic,
                difficulty
            );

            if (response.success && response.data) {
                setProblem(response.data);
            } else {
                setError(response.error || "問題の生成に失敗しました");
            }
        } catch (err) {
            setError("予期しないエラーが発生しました");
            console.error("AI problem generation error:", err);
        } finally {
            setLoading(false);
        }
    };

    const clearProblem = () => {
        setProblem(null);
        setError(null);
    };

    return {
        loading,
        error,
        problem,
        generateProblem,
        clearProblem,
    };
};
