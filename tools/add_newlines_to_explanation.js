// tools/add_newlines_to_explanation.js
const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../src/data/lessonsData.ts");

// 追加したいキーワード
const keywords = [
    "たとえば",
    "例：",
    "例)",
    "例：",
    "例）",
    "ポイント：",
    "ポイントs*:", // 半角コロンも考慮
    "ポイントs*：",
    "【ポイント】",
    "【例】",
    "【注意】",
];

function addNewlineBeforeKeyword(str) {
    // 各キーワードの直前に空行を挿入
    let result = str;
    keywords.forEach((kw) => {
        // すでに直前が空行なら何もしない
        // そうでなければ空行を挿入
        const re = new RegExp(`([^\n])\n(\s*)(${kw})`, "g");
        result = result.replace(re, (match, p1, p2, p3) => {
            return `${p1}\n\n${p2}${p3}`;
        });
        // 行頭の場合にも対応
        const re2 = new RegExp(`([^\n])(${kw})`, "g");
        result = result.replace(re2, (match, p1, p2) => {
            return `${p1}\n\n${p2}`;
        });
    });
    return result;
}

function processFile() {
    let text = fs.readFileSync(FILE, "utf8");
    text = text.replace(/explanation:\s*`([\s\S]*?)`/g, (match, p1) => {
        const replaced = addNewlineBeforeKeyword(p1);
        return `explanation: \`${replaced}\``;
    });
    fs.writeFileSync(FILE, text, "utf8");
    console.log("explanation内のキーワード前に空行を追加しました。");
}

processFile();
