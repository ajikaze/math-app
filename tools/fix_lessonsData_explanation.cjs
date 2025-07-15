// tools/fix_lessonsData_explanation.cjs
const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../src/data/lessonsData.ts");

function fixFile() {
    let text = fs.readFileSync(FILE, "utf8");
    // 't{replaced}` という不正な文字列をすべて削除
    text = text.replace(/'t\{replaced}`\s*,?/g, "");
    // 連続した空行を1つにまとめる
    text = text.replace(/\n{3,}/g, "\n\n");
    fs.writeFileSync(FILE, text, "utf8");
    console.log("不正な 't{replaced}` を削除しました。");
}

fixFile();
