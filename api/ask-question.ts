import { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const { question } = req.body;
        if (!question) {
            return res.status(400).json({ error: "question が必要です" });
        }

        const prompt = `
あなたは高校生向けの数学学習アプリのAI学習コーチです。
以下の数学に関する質問に、分かりやすく回答してください。

質問: ${question}

回答は以下の点に注意してください：
1. 高校生が理解できるレベルで説明する
2. 数式はLaTeX形式で記述する（例：$y = x^2$ や $$\\int_0^1 x^2 dx$$）
3. 必要に応じて例題や図解を交える
4. 段階的に説明する
    `;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res
                .status(500)
                .json({ error: "APIキーが設定されていません" });
        }

        const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = {
            contents: chatHistory,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048,
            },
        };

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        type ErrorResponse = { error?: { message?: string } };

        if (!response.ok) {
            const errorData = (await response.json()) as ErrorResponse;
            throw new Error(
                `APIエラー: ${response.status} ${response.statusText} - ${
                    errorData.error?.message || "Unknown error"
                }`
            );
        }

        type GeminiResponse = {
            candidates?: Array<{
                content?: {
                    parts?: Array<{ text?: string }>;
                };
            }>;
        };

        const result = (await response.json()) as GeminiResponse;

        if (
            result.candidates &&
            result.candidates.length > 0 &&
            result.candidates[0].content &&
            result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0
        ) {
            const answer = result.candidates[0].content.parts[0].text;
            res.json(answer);
        } else {
            res.status(500).json({ error: "AIからの回答生成に失敗しました" });
        }
    } catch (error: unknown) {
        console.error("AI質問エラー:", error);
        let message = "不明なエラー";
        if (error instanceof Error) {
            message = error.message;
        }
        res.status(500).json({
            error: `AI質問中にエラーが発生しました: ${message}`,
        });
    }
}
