import { memo } from "react";
import {
    BaseEdge,
    EdgeLabelRenderer,
    getSmoothStepPath,
    type EdgeProps,
} from "reactflow";

function OrganizationEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
}: EdgeProps) {
    const [path] = getSmoothStepPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        borderRadius: 16,
    });

    return (
        <>
            <BaseEdge
                id={id}
                path={path}
                style={{
                    stroke: "#0ea5e9",
                    strokeWidth: 2,
                }}
            />

            <EdgeLabelRenderer>
                <div
                    style={{
                        position: "absolute",
                        transform: `translate(-50%, -50%)`,
                    }}
                >
                    Label
                </div>
            </EdgeLabelRenderer>
        </>
    );
}

export default memo(OrganizationEdge);