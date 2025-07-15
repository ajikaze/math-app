// tools/backup_and_fix_pitfall_indent.cjs
const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../src/data/lessonsData.ts");
const BACKUP = path.join(__dirname, "../src/data/lessonsData.ts.bak");

// 1. バックアップ作成
if (!fs.existsSync(BACKUP)) {
    fs.copyFileSync(FILE, BACKUP);
    console.log("lessonsData.ts のバックアップを作成しました。");
} else {
    console.log("バックアップファイルは既に存在します。");
}

// 2. pitfall.detailの行頭インデントを一括削除
let text = fs.readFileSync(FILE, "utf8");
// pitfall: { ... detail: `...` ... } のdetail部分を抽出し、各行の先頭空白を削除
text = text.replace(
    /(pitfall:\s*\{[^}]*detail:\s*`)([\s\S]*?)(`)/g,
    (match, p1, p2, p3) => {
        // 各行の行頭空白を削除
        const fixed = p2
            .split("\n")
            .map((line) => line.replace(/^\s+/, ""))
            .join("\n");
        return p1 + fixed + p3;
    }
);
fs.writeFileSync(FILE, text, "utf8");
console.log("pitfall.detail の行頭インデントを一括削除しました。");
