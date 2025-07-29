import React, { useRef, useEffect, useState } from "react";

interface Point {
    x: number;
    y: number;
}

interface GeometryCanvasProps {
    type: "triangle" | "circle" | "coordinate" | "function";
    width?: number;
    height?: number;
    interactive?: boolean;
    data?: any;
    className?: string;
}

export const GeometryCanvas: React.FC<GeometryCanvasProps> = ({
    type,
    width = 400,
    height = 300,
    interactive = false,
    data,
    className = "",
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragPoint, setDragPoint] = useState<Point | null>(null);

    // 座標変換（数学座標 → キャンバス座標）
    const transformPoint = (point: Point): Point => ({
        x: point.x + width / 2,
        y: height / 2 - point.y,
    });

    // 三角形の描画
    const drawTriangle = (ctx: CanvasRenderingContext2D, points: Point[]) => {
        ctx.beginPath();
        ctx.moveTo(transformPoint(points[0]).x, transformPoint(points[0]).y);
        ctx.lineTo(transformPoint(points[1]).x, transformPoint(points[1]).y);
        ctx.lineTo(transformPoint(points[2]).x, transformPoint(points[2]).y);
        ctx.closePath();
        ctx.strokeStyle = "#3B82F6";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "rgba(59, 130, 246, 0.1)";
        ctx.fill();
    };

    // 円の描画
    const drawCircle = (
        ctx: CanvasRenderingContext2D,
        center: Point,
        radius: number
    ) => {
        const transformedCenter = transformPoint(center);
        ctx.beginPath();
        ctx.arc(
            transformedCenter.x,
            transformedCenter.y,
            radius,
            0,
            2 * Math.PI
        );
        ctx.strokeStyle = "#10B981";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "rgba(16, 185, 129, 0.1)";
        ctx.fill();
    };

    // 座標平面の描画
    const drawCoordinatePlane = (ctx: CanvasRenderingContext2D) => {
        // グリッド線
        ctx.strokeStyle = "#E5E7EB";
        ctx.lineWidth = 1;

        // 縦線
        for (let x = -10; x <= 10; x++) {
            const canvasX = transformPoint({ x, y: 0 }).x;
            ctx.beginPath();
            ctx.moveTo(canvasX, 0);
            ctx.lineTo(canvasX, height);
            ctx.stroke();
        }

        // 横線
        for (let y = -10; y <= 10; y++) {
            const canvasY = transformPoint({ x: 0, y }).y;
            ctx.beginPath();
            ctx.moveTo(0, canvasY);
            ctx.lineTo(width, canvasY);
            ctx.stroke();
        }

        // 軸
        ctx.strokeStyle = "#374151";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2, height);
        ctx.stroke();
    };

    // 関数の描画
    const drawFunction = (
        ctx: CanvasRenderingContext2D,
        func: (x: number) => number
    ) => {
        ctx.strokeStyle = "#EF4444";
        ctx.lineWidth = 3;
        ctx.beginPath();

        for (let i = 0; i < width; i++) {
            const x = (i - width / 2) / 20; // スケール調整
            const y = func(x);
            const point = transformPoint({ x, y });

            if (i === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        }

        ctx.stroke();
    };

    // 描画処理
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // キャンバスをクリア
        ctx.clearRect(0, 0, width, height);

        switch (type) {
            case "triangle":
                if (data?.points) {
                    drawTriangle(ctx, data.points);
                }
                break;
            case "circle":
                if (data?.center && data?.radius) {
                    drawCircle(ctx, data.center, data.radius);
                }
                break;
            case "coordinate":
                drawCoordinatePlane(ctx);
                if (data?.function) {
                    drawFunction(ctx, data.function);
                }
                break;
            case "function":
                drawCoordinatePlane(ctx);
                if (data?.function) {
                    drawFunction(ctx, data.function);
                }
                break;
        }
    }, [type, data, width, height]);

    // マウスイベント処理（インタラクティブ機能）
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!interactive) return;
        setIsDragging(true);
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
            setDragPoint({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!interactive || !isDragging) return;
        // ドラッグ処理の実装
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setDragPoint(null);
    };

    return (
        <div className={`relative ${className}`}>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className="border border-gray-300 rounded-lg cursor-crosshair"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            />
            {interactive && (
                <div className="absolute top-2 left-2 text-xs text-gray-600 bg-white px-2 py-1 rounded">
                    ドラッグで操作可能
                </div>
            )}
        </div>
    );
};

export default GeometryCanvas;
