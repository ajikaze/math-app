// tools/fix_lessonsData_commas.cjs
const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../src/data/lessonsData.ts");

function fixCommas() {
    let text = fs.readFileSync(FILE, "utf8");
    // 1. explanation: "" の直後にカンマがなければ追加
    text = text.replace(/(explanation: "")([^,\n])/g, 'explanation: "",$2');
    // 2. explanation: ""\n の直後にカンマがなければ追加
    text = text.replace(
        /(explanation: ""\s*)\n(\s*)([a-zA-Z])/g,
        'explanation: "",\n$2$3'
    );
    // 3. pitfall: の前にカンマがなければ追加
    text = text.replace(/([\}\]])\s*\n(\s*)pitfall:/g, "$1,\n$2pitfall:");
    // 4. problems: の前にカンマがなければ追加
    text = text.replace(/([\}\]])\s*\n(\s*)problems:/g, "$1,\n$2problems:");
    // 5. examples: の前にカンマがなければ追加
    text = text.replace(/([\}\]])\s*\n(\s*)examples:/g, "$1,\n$2examples:");
    // 6. title: の前にカンマがなければ追加（steps配列内のみ）
    text = text.replace(/([\}\]])\s*\n(\s*)title:/g, "$1,\n$2title:");
    // 7. steps: の前にカンマがなければ追加
    text = text.replace(/([\}\]])\s*\n(\s*)steps:/g, "$1,\n$2steps:");
    // 8. topic: の前にカンマがなければ追加
    text = text.replace(/([\}\]])\s*\n(\s*)topic:/g, "$1,\n$2topic:");
    // 9. 連続カンマを1つにまとめる
    text = text.replace(/,+/g, ",");
    // 10. 連続空行を1つにまとめる
    text = text.replace(/\n{3,}/g, "\n\n");
    fs.writeFileSync(FILE, text, "utf8");
    console.log(
        "explanation直後や主要区切りのカンマ・改行を自動修正しました。"
    );
}

fixCommas();
