// tools/force_fix_explanation_empty.cjs
const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../src/data/lessonsData.ts");

function forceFix() {
    let text = fs.readFileSync(FILE, "utf8");
    // explanation: で始まり、バッククォートで始まらない、または途中で閉じていないものを explanation: "" に置換
    // 1. 'explanation:' から 'examples:' までの間が壊れている場合
    text = text.replace(
        /explanation:\s*[^`][\s\S]*?(?=examples:|pitfall:|problems:|title:|steps:|topic:|\}\,|\}\]|\}\))/g,
        'explanation: ""\n'
    );
    // 2. explanation: ` で始まるが閉じバッククォートがない場合も "" に
    text = text.replace(
        /explanation:\s*`[\s\S]*?(?=examples:|pitfall:|problems:|title:|steps:|topic:|\}\,|\}\]|\}\))/g,
        'explanation: ""\n'
    );
    fs.writeFileSync(FILE, text, "utf8");
    console.log("不正なexplanationをすべて空文字に修正しました。");
}

forceFix();
