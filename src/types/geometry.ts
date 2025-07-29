// 基本的な点の型定義
export interface Point {
    x: number;
    y: number;
}

// 3D点の型定義
export interface Point3D {
    x: number;
    y: number;
    z: number;
}

// 図形の基本型定義
export interface GeometryData {
    type:
        | "triangle"
        | "circle"
        | "coordinate"
        | "function"
        | "polygon"
        | "line";
    id: string;
    title?: string;
    description?: string;
    interactive?: boolean;
}

// 三角形のデータ型定義
export interface TriangleData extends GeometryData {
    type: "triangle";
    points: [Point, Point, Point];
    angles?: [number, number, number]; // 角度（ラジアン）
    sides?: [number, number, number]; // 辺の長さ
}

// 円のデータ型定義
export interface CircleData extends GeometryData {
    type: "circle";
    center: Point;
    radius: number;
    area?: number;
    circumference?: number;
}

// 座標平面のデータ型定義
export interface CoordinateData extends GeometryData {
    type: "coordinate";
    xRange: [number, number];
    yRange: [number, number];
    grid?: boolean;
    axes?: boolean;
    functions?: FunctionData[];
}

// 関数のデータ型定義
export interface FunctionData {
    id: string;
    expression: string; // LaTeX形式の関数式
    func: (x: number) => number; // JavaScript関数
    color?: string;
    lineWidth?: number;
    domain?: [number, number];
}

// 多角形のデータ型定義
export interface PolygonData extends GeometryData {
    type: "polygon";
    points: Point[];
    sides: number;
    regular?: boolean; // 正多角形かどうか
}

// 直線のデータ型定義
export interface LineData extends GeometryData {
    type: "line";
    start: Point;
    end: Point;
    slope?: number;
    intercept?: number;
}

// 図形の表示設定
export interface GeometryDisplayOptions {
    width?: number;
    height?: number;
    backgroundColor?: string;
    gridColor?: string;
    axisColor?: string;
    showLabels?: boolean;
    showGrid?: boolean;
    showAxes?: boolean;
    interactive?: boolean;
}

// 図形の計算結果
export interface GeometryCalculations {
    area?: number;
    perimeter?: number;
    volume?: number;
    surfaceArea?: number;
    angles?: number[];
    sides?: number[];
    centroid?: Point;
    circumcenter?: Point;
    incenter?: Point;
    orthocenter?: Point;
}
