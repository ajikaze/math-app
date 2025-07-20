// src/utils/sanitizeAIOutput.ts

const OUTPUT_NG_WORDS = [
    "パスワード",
    "管理者",
    "システムプロンプト",
    "<script",
    "onerror=",
    "onload=",
    // 必要に応じて追加
];

export function sanitizeAIOutput(output: string): string {
    // scriptタグ除去
    let sanitized = output.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
    // NGワードマスキング
    for (const word of OUTPUT_NG_WORDS) {
        if (sanitized.includes(word)) {
            sanitized = sanitized.replace(new RegExp(word, "gi"), "＊");
        }
    }
    // 追加で必要ならHTMLタグ全除去も可
    // sanitized = sanitized.replace(/<[^>]+>/g, "");
    return sanitized;
}
