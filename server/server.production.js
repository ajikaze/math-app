import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || "development";

// セキュリティヘッダーの設定
app.use(helmet());

// CORS設定（本番環境では特定のドメインのみ許可）
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:5173", "http://localhost:3000"];

app.use(
    cors({
        origin: function (origin, callback) {
            // 本番環境ではoriginのチェックを厳密に行う
            if (NODE_ENV === "production") {
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                } else {
                    callback(new Error("CORS policy violation"));
                }
            } else {
                callback(null, true);
            }
        },
        credentials: true,
    })
);

// レート制限の設定
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15分
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 15分間に100リクエストまで
    message: {
        error: "リクエストが多すぎます。しばらく待ってから再試行してください。",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

// JSONボディのサイズ制限
app.use(express.json({ limit: "1mb" }));

// APIキーの検証ミドルウェア
const validateApiKey = (req, res, next) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({
            error: "サーバー設定エラー: APIキーが設定されていません",
        });
    }
    next();
};

// ログミドルウェア
const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
    next();
};

app.use(requestLogger);

// AI問題生成エンドポイント
app.post("/api/generate-problem", validateApiKey, async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "プロンプトが必要です" });
        }

        // プロンプトの長さ制限
        if (prompt.length > 5000) {
            return res.status(400).json({ error: "プロンプトが長すぎます" });
        }

        const apiKey = process.env.GEMINI_API_KEY;
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
            error: "問題生成中にエラーが発生しました",
        });
    }
});

// AI質問エンドポイント
app.post("/api/ask-question", validateApiKey, async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "プロンプトが必要です" });
        }

        // プロンプトの長さ制限
        if (prompt.length > 3000) {
            return res.status(400).json({ error: "質問が長すぎます" });
        }

        const apiKey = process.env.GEMINI_API_KEY;
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
            res.json({ answer });
        } else {
            res.status(500).json({ error: "AIからの回答生成に失敗しました" });
        }
    } catch (error) {
        console.error("AI質問エラー:", error);
        res.status(500).json({
            error: "AI質問中にエラーが発生しました",
        });
    }
});

// ヘルスチェックエンドポイント
app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        message: "サーバーは正常に動作しています",
        environment: NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});

// 404エラーハンドラー
app.use((req, res) => {
    res.status(404).json({ error: "エンドポイントが見つかりません" });
});

// グローバルエラーハンドラー
app.use((error, req, res, next) => {
    console.error("グローバルエラー:", error);
    res.status(500).json({
        error: "サーバー内部エラーが発生しました",
    });
});

app.listen(PORT, () => {
    console.log(`サーバーがポート${PORT}で起動しました (環境: ${NODE_ENV})`);
});
