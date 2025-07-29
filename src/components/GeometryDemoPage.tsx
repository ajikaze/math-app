import React, { useState } from "react";
import GeometryExample from "./GeometryExample";
import InteractiveGeometryTool from "./InteractiveGeometryTool";
import GeometryAIGenerator from "./GeometryAIGenerator";

export const GeometryDemoPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<
        "examples" | "interactive" | "ai"
    >("examples");

    const tabs = [
        { id: "examples", label: "図形例", icon: "📐" },
        { id: "interactive", label: "インタラクティブツール", icon: "🎮" },
        { id: "ai", label: "AI問題生成", icon: "🤖" },
    ];

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* ヘッダー */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        図形・グラフ機能デモ
                    </h1>
                    <p className="text-lg text-gray-600">
                        数学学習アプリの図形・グラフ機能を体験してください
                    </p>
                </div>

                {/* タブナビゲーション */}
                <div className="mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === tab.id
                                            ? "border-blue-500 text-blue-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                                >
                                    <span className="mr-2">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* タブコンテンツ */}
                <div className="space-y-8">
                    {activeTab === "examples" && (
                        <div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                    📐 図形・グラフの例
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    基本的な図形とグラフの表示例です。各図形の性質と計算結果を確認できます。
                                </p>
                                <GeometryExample />
                            </div>
                        </div>
                    )}

                    {activeTab === "interactive" && (
                        <div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                    🎮 インタラクティブツール
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    図形を操作して、リアルタイムで計算結果を確認できます。パラメータを変更して図形の性質を学習しましょう。
                                </p>
                                <InteractiveGeometryTool />
                            </div>
                        </div>
                    )}

                    {activeTab === "ai" && (
                        <div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                    🤖 AI図形問題生成
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    AIが図形やグラフを含む問題を自動生成します。難易度と図形タイプを選択して、オリジナルの問題を作成しましょう。
                                </p>
                                <GeometryAIGenerator
                                    subject="数学I"
                                    topic="図形と計量"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* 機能説明 */}
                <div className="mt-12 bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        機能の活用方法
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-semibold text-blue-800 mb-2">
                                📚 学習支援
                            </h3>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• 図形の視覚的理解</li>
                                <li>• 計算結果の即座確認</li>
                                <li>• インタラクティブな学習</li>
                                <li>• 数学的概念の具体化</li>
                            </ul>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                            <h3 className="font-semibold text-green-800 mb-2">
                                🎯 問題解決
                            </h3>
                            <ul className="text-sm text-green-700 space-y-1">
                                <li>• 図形問題の自動生成</li>
                                <li>• 段階的な難易度調整</li>
                                <li>• 即座のフィードバック</li>
                                <li>• 個別学習のサポート</li>
                            </ul>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg">
                            <h3 className="font-semibold text-purple-800 mb-2">
                                🔧 実用的機能
                            </h3>
                            <ul className="text-sm text-purple-700 space-y-1">
                                <li>• リアルタイム計算</li>
                                <li>• パラメータ調整</li>
                                <li>• 美しい数式表示</li>
                                <li>• レスポンシブデザイン</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 技術仕様 */}
                <div className="mt-8 bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        技術仕様
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                            <h4 className="font-medium text-gray-700 mb-2">
                                実装技術
                            </h4>
                            <ul className="space-y-1">
                                <li>• Canvas API + SVG</li>
                                <li>• React + TypeScript</li>
                                <li>• MathJax統合</li>
                                <li>• 数学計算ライブラリ</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-700 mb-2">
                                対応図形
                            </h4>
                            <ul className="space-y-1">
                                <li>• 三角形（面積、角度、特殊点）</li>
                                <li>• 円（面積、円周）</li>
                                <li>• 関数グラフ（二次関数、三角関数）</li>
                                <li>• 座標平面</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeometryDemoPage;
