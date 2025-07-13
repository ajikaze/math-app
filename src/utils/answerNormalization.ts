// Helper function to normalize strings for comparison (remove all whitespace)
export const normalizeString = (str: string | null | undefined): string => {
    if (typeof str !== "string") return "";
    // Remove all whitespace and convert to lowercase for robust comparison
    // Also handle specific common math symbols that might vary in input
    let normalized = str.toLowerCase();
    normalized = normalized.replace(/[\s\u3000]+/g, ""); // 半角・全角スペース
    normalized = normalized.replace(/−/g, "-"); // Unicode minus sign
    normalized = normalized.replace(/×/g, "*"); // Multiplication sign
    normalized = normalized.replace(/÷/g, "/"); // Division sign
    normalized = normalized.replace(/√/g, "sqrt"); // Square root symbol
    normalized = normalized.replace(/π/g, "pi"); // Pi symbol
    normalized = normalized.replace(/±/g, "+-"); // Plus-minus symbol (approximate for comparison)
    normalized = normalized.replace(/°/g, "度"); // Degree symbol (if comparing with '度')

    // Remove parentheses, brackets, braces, equals, comma, semicolon, colon
    // This is a more aggressive removal, adjust if specific punctuation needs to be preserved for comparison
    normalized = normalized.replace(/[(){}\[\]=,;:\\]/g, "");

    // For specific Japanese math terms that might appear in answers
    normalized = normalized.replace(/商:/g, "商");
    normalized = normalized.replace(/余り:/g, "余り");

    return normalized;
};

// Helper function to determine if an answer is likely a mathematical expression
// Updated to be more robust for various math expressions and common Japanese math terms
export const isMathematicalExpression = (
    answer: string | null | undefined
): boolean => {
    if (!answer || typeof answer !== "string") return false;
    // Check for common variables (x, y, a, b, n, k, m, d, r), exponents, common functions, or integration constant
    // Added specific checks for common math symbols/keywords in Japanese context
    const mathPattern =
        /[xyzabnkmdrC]|\^|sqrt|sin|cos|tan|log|exp|pi|∞|±|\\vec|\\frac|\\int|\\lim|\\sum|\\begin|\\end|\\cases|\\circ|度|重解|割り切れる|不連続|連続|重心|外心|内心|商:|余り:/i;
    const isNumeric = /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(answer); // Check if it's purely numeric

    // If it's not purely numeric and contains math patterns, it's likely an expression.
    // Also, if it contains specific math constants/words that are not simple Japanese words.
    // Added specific checks for common math constants/words that might not be caught by regex alone.
    const commonMathWords = [
        "pi",
        "sqrt",
        "sin",
        "cos",
        "tan",
        "log",
        "exp",
        "∞",
        "不連続",
        "連続",
        "重心",
        "外心",
        "内心",
        "商:",
        "余り:",
        "重解",
        "割り切れる",
    ];

    const containsMathWord = commonMathWords.some((word) =>
        answer.toLowerCase().includes(word.toLowerCase())
    );

    return (!isNumeric && mathPattern.test(answer)) || containsMathWord;
};
