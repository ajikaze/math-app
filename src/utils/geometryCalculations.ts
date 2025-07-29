import {
    Point,
    TriangleData,
    CircleData,
    GeometryCalculations,
} from "../types/geometry";

// 2点間の距離を計算
export const calculateDistance = (p1: Point, p2: Point): number => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

// 三角形の面積を計算（ヘロンの公式）
export const calculateTriangleArea = (
    points: [Point, Point, Point]
): number => {
    const [a, b, c] = points;
    const sideA = calculateDistance(b, c);
    const sideB = calculateDistance(a, c);
    const sideC = calculateDistance(a, b);

    const s = (sideA + sideB + sideC) / 2; // 半周長
    return Math.sqrt(s * (s - sideA) * (s - sideB) * (s - sideC));
};

// 三角形の辺の長さを計算
export const calculateTriangleSides = (
    points: [Point, Point, Point]
): [number, number, number] => {
    const [a, b, c] = points;
    return [
        calculateDistance(b, c),
        calculateDistance(a, c),
        calculateDistance(a, b),
    ];
};

// 三角形の角度を計算（余弦定理）
export const calculateTriangleAngles = (
    points: [Point, Point, Point]
): [number, number, number] => {
    const sides = calculateTriangleSides(points);
    const [a, b, c] = sides;

    const angleA = Math.acos((b * b + c * c - a * a) / (2 * b * c));
    const angleB = Math.acos((a * a + c * c - b * b) / (2 * a * c));
    const angleC = Math.acos((a * a + b * b - c * c) / (2 * a * b));

    return [angleA, angleB, angleC];
};

// 円の面積を計算
export const calculateCircleArea = (radius: number): number => {
    return Math.PI * radius * radius;
};

// 円の円周を計算
export const calculateCircleCircumference = (radius: number): number => {
    return 2 * Math.PI * radius;
};

// 三角形の重心を計算
export const calculateTriangleCentroid = (
    points: [Point, Point, Point]
): Point => {
    const [a, b, c] = points;
    return {
        x: (a.x + b.x + c.x) / 3,
        y: (a.y + b.y + c.y) / 3,
    };
};

// 三角形の外心を計算
export const calculateTriangleCircumcenter = (
    points: [Point, Point, Point]
): Point => {
    const [a, b, c] = points;

    // 外心の計算（垂直二等分線の交点）
    const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));

    if (Math.abs(d) < 1e-10) {
        // 3点が一直線上にある場合
        throw new Error("3点が一直線上にあります");
    }

    const ux =
        ((a.x * a.x + a.y * a.y) * (b.y - c.y) +
            (b.x * b.x + b.y * b.y) * (c.y - a.y) +
            (c.x * c.x + c.y * c.y) * (a.y - b.y)) /
        d;

    const uy =
        ((a.x * a.x + a.y * a.y) * (c.x - b.x) +
            (b.x * b.x + b.y * b.y) * (a.x - c.x) +
            (c.x * c.x + c.y * c.y) * (b.x - a.x)) /
        d;

    return { x: ux, y: uy };
};

// 三角形の内心を計算
export const calculateTriangleIncenter = (
    points: [Point, Point, Point]
): Point => {
    const [a, b, c] = points;
    const sides = calculateTriangleSides(points);
    const [sideA, sideB, sideC] = sides;
    const perimeter = sideA + sideB + sideC;

    return {
        x: (sideA * a.x + sideB * b.x + sideC * c.x) / perimeter,
        y: (sideA * a.y + sideB * b.y + sideC * c.y) / perimeter,
    };
};

// 三角形の垂心を計算
export const calculateTriangleOrthocenter = (
    points: [Point, Point, Point]
): Point => {
    const [a, b, c] = points;

    // 垂心の計算（高さの交点）
    const slopeAB = (b.y - a.y) / (b.x - a.x);
    const slopeAC = (c.y - a.y) / (c.x - a.x);

    if (Math.abs(slopeAB - slopeAC) < 1e-10) {
        throw new Error("3点が一直線上にあります");
    }

    // 点Cから辺ABへの垂線の傾き
    const perpendicularSlope = -1 / slopeAB;

    // 点Bから辺ACへの垂線の傾き
    const perpendicularSlope2 = -1 / slopeAC;

    // 2つの垂線の交点を計算
    const x =
        (c.y - perpendicularSlope * c.x - b.y + perpendicularSlope2 * b.x) /
        (perpendicularSlope2 - perpendicularSlope);
    const y = perpendicularSlope * (x - c.x) + c.y;

    return { x, y };
};

// 三角形の完全な計算結果を取得
export const calculateTriangleProperties = (
    triangleData: TriangleData
): GeometryCalculations => {
    const sides = calculateTriangleSides(triangleData.points);
    const angles = calculateTriangleAngles(triangleData.points);

    return {
        area: calculateTriangleArea(triangleData.points),
        perimeter: sides.reduce((sum, side) => sum + side, 0),
        sides,
        angles,
        centroid: calculateTriangleCentroid(triangleData.points),
        circumcenter: calculateTriangleCircumcenter(triangleData.points),
        incenter: calculateTriangleIncenter(triangleData.points),
        orthocenter: calculateTriangleOrthocenter(triangleData.points),
    };
};

// 円の完全な計算結果を取得
export const calculateCircleProperties = (
    circleData: CircleData
): GeometryCalculations => {
    return {
        area: calculateCircleArea(circleData.radius),
        perimeter: calculateCircleCircumference(circleData.radius),
    };
};

// 角度をラジアンから度に変換
export const radiansToDegrees = (radians: number): number => {
    return radians * (180 / Math.PI);
};

// 角度を度からラジアンに変換
export const degreesToRadians = (degrees: number): number => {
    return degrees * (Math.PI / 180);
};

// 点が円の内部にあるかチェック
export const isPointInCircle = (
    point: Point,
    center: Point,
    radius: number
): boolean => {
    const distance = calculateDistance(point, center);
    return distance <= radius;
};

// 点が三角形の内部にあるかチェック（重心座標法）
export const isPointInTriangle = (
    point: Point,
    triangle: [Point, Point, Point]
): boolean => {
    const [a, b, c] = triangle;

    const v0x = c.x - a.x;
    const v0y = c.y - a.y;
    const v1x = b.x - a.x;
    const v1y = b.y - a.y;
    const v2x = point.x - a.x;
    const v2y = point.y - a.y;

    const dot00 = v0x * v0x + v0y * v0y;
    const dot01 = v0x * v1x + v0y * v1y;
    const dot02 = v0x * v2x + v0y * v2y;
    const dot11 = v1x * v1x + v1y * v1y;
    const dot12 = v1x * v2x + v1y * v2y;

    const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
    const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

    return u >= 0 && v >= 0 && u + v <= 1;
};
