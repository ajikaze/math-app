// レッスン関連の型定義
export interface Lesson {
    id: string;
    title: string;
    content: string;
    difficulty: "basic" | "intermediate" | "advanced";
    category: string;
    examples?: Example[];
    exercises?: Exercise[];
}

export interface Example {
    id: string;
    problem: string;
    solution: string;
    explanation: string;
}

export interface Exercise {
    id: string;
    problem: string;
    answer: string;
    explanation?: string;
    difficulty: "easy" | "medium" | "hard";
}

// 科目関連の型定義
export interface Subject {
    id: string;
    name: string;
    description: string;
    icon: string;
    lessons: Lesson[];
}

// AI生成問題の型定義
export interface AIGeneratedProblem {
    question: string;
    answer: string;
    hint: string;
}

// API関連の型定義
export interface APIResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// ユーザー進捗の型定義
export interface UserProgress {
    lessonId: string;
    completed: boolean;
    score?: number;
    lastAttempted?: Date;
}

// 設定の型定義
export interface AppSettings {
    theme: "light" | "dark";
    difficulty: "easy" | "medium" | "hard";
    autoSave: boolean;
}

// JSXGraphで使うグラフ情報
export type GraphData = {
    type:
        | "triangle"
        | "centroid"
        | "incenter"
        | "circumcenter"
        | "orthocenter"
        | "linear"
        | "quadratic"
        | "trigonometric"
        | "exponential"
        | "logarithmic"
        | "circle"
        | "ellipse"
        | "hyperbola"
        | "parabola"
        | "histogram"
        | "scatter"
        | "boxplot"
        | string;
    params: {
        // 三角形関連
        points?: [number, number][];
        similarity?: boolean;

        // 関数グラフ関連
        function?: string; // 関数の式（例: "2*x + 1"）
        coefficients?: number[]; // 係数配列
        domain?: [number, number]; // 定義域
        range?: [number, number]; // 値域

        // 一次関数: y = ax + b
        slope?: number; // 傾き a
        intercept?: number; // 切片 b

        // 二次関数: y = ax² + bx + c
        a?: number; // 二次の係数
        b?: number; // 一次の係数
        c?: number; // 定数項

        // 三角関数: y = a*sin(bx + c) + d
        amplitude?: number; // 振幅 a
        frequency?: number; // 周波数 b
        phase?: number; // 位相 c
        verticalShift?: number; // 垂直移動 d
        trigType?: "sin" | "cos" | "tan"; // 三角関数の種類

        // 指数関数: y = a * b^x
        base?: number; // 底 b
        scale?: number; // スケール a

        // 対数関数: y = a * log_b(x) + c
        logBase?: number; // 対数の底
        logScale?: number; // スケール a
        logShift?: number; // 垂直移動 c

        // 円・楕円関連
        center?: [number, number]; // 中心座標
        radius?: number; // 半径
        semiMajorAxis?: number; // 長軸
        semiMinorAxis?: number; // 短軸

        // 双曲線・放物線関連
        horizontal?: boolean; // 横軸が主軸かどうか
        vertex?: [number, number]; // 頂点座標（放物線）
        focus?: [number, number]; // 焦点座標（放物線）

        // 統計関連
        data?: number[]; // データ配列
        dataPairs?: [number, number][]; // データペア配列
        bins?: number; // ヒストグラムのビン数
    };
    style?: {
        strokeColor?: string;
        fillColor?: string;
        strokeWidth?: number;
        dash?: number;
        [key: string]: any;
    };
    description?: string;
};

// Step型やProblem型に追加（既存定義がある場合は拡張、なければ新規定義）
export type Step = {
    title: string;
    explanation: string;
    graph?: GraphData; // 単一グラフ
    graphs?: GraphData[]; // 複数グラフ
    // ...他のフィールド
};
