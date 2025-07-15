// tools/latexify_explanation.cjs
const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../src/data/lessonsData.ts");

// 変換ルール
function latexifyLine(line) {
    let s = line;
    // すでに$...$で囲まれている場合はスキップ
    if (/\$.*\$/.test(s)) return s;
    // sqrt(a) → \sqrt{a}
    s = s.replace(/√([a-zA-Z0-9]+)/g, "\\sqrt{$1}");
    // × → \times
    s = s.replace(/×/g, " \\times ");
    // ÷ → \div
    s = s.replace(/÷/g, " \\div ");
    // π → \pi
    s = s.replace(/π/g, "\\pi");
    // ^n → ^{n}
    s = s.replace(/([a-zA-Z0-9])\^([0-9]+)/g, "$1^{$2}");
    // a/b → \frac{a}{b}（ただしa,bが数字または英字1文字）
    s = s.replace(/([a-zA-Z0-9]+)\s*\/\s*([a-zA-Z0-9]+)/g, "\\frac{$1}{$2}");
    // 不等号
    s = s.replace(/<=/g, " \\le ");
    s = s.replace(/>=/g, " \\ge ");
    // =, +, - などの前後に空白
    s = s.replace(/\s*=\s*/g, " = ");
    s = s.replace(/\s*\+\s*/g, " + ");
    s = s.replace(/\s*-\s*/g, " - ");
    // もし数式っぽい行なら$...$で囲む
    if (/([=><]|\\sqrt|\\frac|\\times|\\div|\^|\+|-)/.test(s)) {
        s = `$$
${s}
$$`;
    }
    return s;
}

function latexifyExplanationBlock(block) {
    // 各行ごとに処理
    return block.split("\n").map(latexifyLine).join("\n");
}

function processFile() {
    let text = fs.readFileSync(FILE, "utf8");
    // explanation: `...` の ... 部分をLaTeX化
    text = text.replace(/explanation:\s*`([\s\S]*?)`/g, (match, p1) => {
        const replaced = latexifyExplanationBlock(p1);
        return `explanation: \












































































































































































































't{replaced}\``;
    });
    fs.writeFileSync(FILE, text, "utf8");
    console.log("explanation内の式を自動でLaTeX化しました。");
}

processFile();
