import React from "react";
import Dialog from "@mui/material/Dialog";
import Slider from "react-slick";
import JSXGraphBoard from "./JSXGraphBoard";
import type { GraphData } from "../types";

export type GraphModalProps = {
    open: boolean;
    onClose: () => void;
    graphs: GraphData[];
};

const GraphModal: React.FC<GraphModalProps> = ({ open, onClose, graphs }) => (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <div style={{ padding: 24 }}>
            <Slider
                dots
                infinite
                speed={500}
                slidesToShow={1}
                slidesToScroll={1}
            >
                {graphs.map((graph, idx) => (
                    <div key={idx}>
                        <div style={{ marginBottom: 8 }}>
                            {graph.description}
                        </div>
                        <JSXGraphBoard
                            draw={(board) => {
                                // graph.typeやparamsに応じて描画
                                if (graph.type === "triangle") {
                                    board.create(
                                        "polygon",
                                        graph.params.points,
                                        graph.style
                                    );
                                }
                                // 他のtypeもここで拡張
                            }}
                            width={400}
                            height={300}
                        />
                    </div>
                ))}
            </Slider>
        </div>
    </Dialog>
);

export default GraphModal;
