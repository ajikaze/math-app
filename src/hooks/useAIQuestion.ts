import { useState } from "react";
import { apiService } from "../services/api";

export const useAIQuestion = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [answer, setAnswer] = useState<string | null>(null);

    const askQuestion = async (question: string) => {
        setLoading(true);
        setError(null);
        setAnswer(null);

        try {
            const response = await apiService.askAIQuestion(question);

            if (response.success && response.data) {
                setAnswer(response.data);
            } else {
                setError(response.error || "質問の処理に失敗しました");
            }
        } catch (err) {
            setError("予期しないエラーが発生しました");
            console.error("AI question error:", err);
        } finally {
            setLoading(false);
        }
    };

    const clearAnswer = () => {
        setAnswer(null);
        setError(null);
    };

    return {
        loading,
        error,
        answer,
        askQuestion,
        clearAnswer,
    };
};
