import type { AIGeneratedProblem, APIResponse } from "../types";

const API_BASE_URL = "http://localhost:3001";

class APIService {
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<APIResponse<T>> {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                headers: {
                    "Content-Type": "application/json",
                    ...options.headers,
                },
                ...options,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error("API request failed:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    async generateAIProblem(
        subject: string,
        topic: string,
        difficulty: "easy" | "medium" | "hard"
    ): Promise<APIResponse<AIGeneratedProblem>> {
        return this.request<AIGeneratedProblem>("/api/generate-problem", {
            method: "POST",
            body: JSON.stringify({
                subject,
                topic,
                difficulty,
            }),
        });
    }

    async askAIQuestion(question: string): Promise<APIResponse<string>> {
        const prompt = `
あなたは高校数学の専門家です。
以下は生徒からの質問です。必ず質問内容だけに答えてください。
--- 質問ここから ---
${question}
--- 質問ここまで ---
`;
        return this.request<string>("/api/ask-question", {
            method: "POST",
            body: JSON.stringify({ question: prompt }),
        });
    }
}

export const apiService = new APIService();
