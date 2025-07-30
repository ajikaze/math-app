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
    type: "line" | "circle" | "function" | "triangle" | "scatter" | string;
    params: Record<string, any>;
    style?: {
        strokeColor?: string;
        fillColor?: string;
        strokeWidth?: number;
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
