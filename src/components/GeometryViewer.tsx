import React from "react";
import GeometryCanvas from "./GeometryCanvas";
import MathJaxDisplay from "./MathJaxDisplay";

interface GeometryViewerProps {
    type: "triangle" | "circle" | "coordinate" | "function";
    title?: string;
    description?: string;
    width?: number;
    height?: number;
    interactive?: boolean;
    data?: any;
    className?: string;
}

export const GeometryViewer: React.FC<GeometryViewerProps> = ({
    type,
    title,
    description,
    width = 400,
    height = 300,
    interactive = false,
    data,
    className = "",
}) => {
    const getTypeLabel = (type: string) => {
        switch (type) {
            case "triangle":
                return "三角形";
            case "circle":
                return "円";
            case "coordinate":
                return "座標平面";
            case "function":
                return "関数グラフ";
            default:
                return type;
        }
    };

    return (
        <div
            className={`bg-white p-4 rounded-lg border border-gray-200 ${className}`}
        >
            {title && (
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    {title}
                </h4>
            )}

            <div className="flex flex-col lg:flex-row gap-4 items-start">
                <div className="flex-shrink-0">
                    <GeometryCanvas
                        type={type}
                        width={width}
                        height={height}
                        interactive={interactive}
                        data={data}
                    />
                </div>

                <div className="flex-1 min-w-0">
                    {description && (
                        <div className="prose max-w-none">
                            <MathJaxDisplay content={description} />
                        </div>
                    )}

                    <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">図形タイプ:</span>{" "}
                        {getTypeLabel(type)}
                        {interactive && (
                            <span className="ml-2 text-blue-600">
                                • インタラクティブ
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeometryViewer;
