import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ミドルウェアの設定
app.use(cors());
app.use(express.json());

// AI問題生成エンドポイント
app.post("/api/generate-problem", async (req, res) => {
    try {
        const { subject, topic, difficulty } = req.body;

        if (!subject || !topic || !difficulty) {
            return res.status(400).json({
                error: "subject, topic, difficulty が必要です",
            });
        }

        // プロンプトを構築
        const prompt = `
あなたは高校生向けの数学学習アプリのAI学習コーチです。
現在の学習科目は「${subject}」のトピック「${topic}」です。
難易度は「${difficulty}」です。

このトピックに関連する新しい練習問題を1問作成してください。
問題は**日本の高校数学で一般的に用いられる表記（日本語の文章とLaTeX数式を組み合わせた形式）**で記述し、その解答と**ヒント**も提供してください。

**特に、すべての数式は、インラインの場合は\`$\`で囲み、独立したブロックとして表示する場合は\`$$\`で囲んでください。例：\`$y = x^2$\` または \`$$\\int_0^1 x^2 dx$$\`**

**解答は、半角英数字と基本的な記号（+ - * / ^ =）のみを使用し、スペースを含まない簡潔な文字列形式で提供してください。例えば、\`x^2-10x+25\` や \`2x+C\`、\`y=3x+1\` のようにしてください。**

出力は以下のJSON形式でお願いします。
{
  "question": "ここに日本の高校数学で使われる形式の問題文",
  "answer": "ここに解答",
  "hint": "ここにヒント"
}
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
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        question: { type: "STRING" },
                        answer: { type: "STRING" },
                        hint: { type: "STRING" },
                    },
                    propertyOrdering: ["question", "answer", "hint"],
                },
            },
        };

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                `APIエラー: ${response.status} ${response.statusText} - ${
                    errorData.error?.message || "Unknown error"
                }`
            );
        }

        const result = await response.json();

        if (
            result.candidates &&
            result.candidates.length > 0 &&
            result.candidates[0].content &&
            result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0
        ) {
            const jsonText = result.candidates[0].content.parts[0].text;
            const parsedProblem = JSON.parse(jsonText);
            res.json(parsedProblem);
        } else {
            res.status(500).json({ error: "AIからの問題生成に失敗しました" });
        }
    } catch (error) {
        console.error("問題生成エラー:", error);
        res.status(500).json({
            error: `問題生成中にエラーが発生しました: ${error.message}`,
        });
    }
});

// AI質問エンドポイント
app.post("/api/ask-question", async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ error: "question が必要です" });
        }

        // プロンプトを構築
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
                maxOutputTokens: 1000,
            },
        };

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                `APIエラー: ${response.status} ${response.statusText} - ${
                    errorData.error?.message || "Unknown error"
                }`
            );
        }

        const result = await response.json();

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
    } catch (error) {
        console.error("AI質問エラー:", error);
        res.status(500).json({
            error: `AI質問中にエラーが発生しました: ${error.message}`,
        });
    }
});

// ヘルスチェックエンドポイント
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", message: "サーバーは正常に動作しています" });
});

app.listen(PORT, () => {
    console.log(`サーバーがポート${PORT}で起動しました`);
});
