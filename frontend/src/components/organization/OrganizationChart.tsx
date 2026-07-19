import { useEffect, useMemo, useState } from "react";
import { getLayoutedElements } from "./layout";
import { useReactFlow } from "reactflow";
import { BackgroundVariant } from "reactflow";
import OrganizationToolbar from "./OrganizationToolbar";
import OrganizationEdge from "./OrganizationEdge";
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    Node,
    Edge,
    MarkerType,
    useNodesState,
    useEdgesState,
    ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";

import EmployeeNode from "./EmployeeNode";
import type { TreeNode } from "../../types";
import EmployeeDrawer from "./EmployeeDrawer";

interface Props {
    forest: TreeNode[];
}
const edgeTypes = {
    organization: OrganizationEdge,
};
const nodeTypes = {
    employee: EmployeeNode,
};

const CARD_WIDTH = 290;
const LEVEL_HEIGHT = 100;

export default function OrganizationChart({ forest }: Props) {
    return (
        <ReactFlowProvider>
            <Chart forest={forest} />
        </ReactFlowProvider>
    );
}

function Chart({ forest }: Props) {
    const { zoomIn, zoomOut, fitView, setCenter } = useReactFlow();
    const [search, setSearch] = useState("");
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
    const [selectedEmployee, setSelectedEmployee] = useState<TreeNode | null>(null);
    const [department, setDepartment] = useState("");
    const [role, setRole] = useState("");
    const [sort, setSort] = useState("name");
    const [drawerOpen, setDrawerOpen] = useState(false);
    useEffect(() => {
        const ids = new Set<string>();
        const collect = (node: TreeNode) => {
            ids.add(node._id);
            node.children?.forEach(collect);
        };
        forest.forEach(collect);
        setExpandedNodes(ids);
    }, [forest]);
    useEffect(() => {
        const flowNodes: Node[] = [];
        const flowEdges: Edge[] = [];

        let currentX = 0;
        const buildTree = (
            employee: TreeNode,
            level: number,
            parentId?: string
        ): number => {
            const children = employee.children ?? [];
            const startX = currentX;

            // ===========================
            // LEAF NODE
            // ===========================
            if (children.length === 0) {
                currentX += CARD_WIDTH + 40;

                flowNodes.push({
                    id: employee._id,
                    type: "employee",
                    position: {
                        x: startX,
                        y: level * LEVEL_HEIGHT,
                    },
                    data: {
                        ...employee,
                        reports: 0,

                        expanded: expandedNodes.has(employee._id),

                        onClick: () => {
                            setSelectedEmployee(employee);
                            setDrawerOpen(true);
                        },

                        onToggle: () => {
                            setExpandedNodes((prev) => {
                                const next = new Set(prev);

                                if (next.has(employee._id)) {
                                    next.delete(employee._id);
                                } else {
                                    next.add(employee._id);
                                }

                                return next;
                            });
                        },
                    },
                });

                if (parentId) {
                    flowEdges.push({
                        id: `${parentId}-${employee._id}`,
                        source: parentId,
                        target: employee._id,
                        type: "organization",
                        markerEnd: {
                            type: MarkerType.ArrowClosed,
                        },
                    });
                }

                return startX;
            }

            // ===========================
            // MANAGER NODE
            // ===========================
            const childPositions: number[] = [];

            if (expandedNodes.has(employee._id)) {
                children.forEach((child) => {
                    const x = buildTree(
                        child,
                        level + 1,
                        employee._id
                    );

                    childPositions.push(x);
                });
            }

            const center =
                childPositions.length > 0
                    ? (Math.min(...childPositions) +
                        Math.max(...childPositions)) / 2
                    : startX;

            flowNodes.push({
                id: employee._id,
                type: "employee",
                position: {
                    x: center,
                    y: level * LEVEL_HEIGHT,
                },
                data: {
                    ...employee,

                    reports: children.length,

                    expanded: expandedNodes.has(employee._id),

                    onClick: () => {
                        setSelectedEmployee(employee);
                        setDrawerOpen(true);
                    },

                    onToggle: () => {
                        setExpandedNodes((prev) => {
                            const next = new Set(prev);

                            if (next.has(employee._id)) {
                                next.delete(employee._id);
                            } else {
                                next.add(employee._id);
                            }

                            return next;
                        });
                    },
                },
            });

            if (parentId) {
                flowEdges.push({
                    id: `${parentId}-${employee._id}`,
                    source: parentId,
                    target: employee._id,
                    type: "organization",
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                    },
                });
            }

            return center;
        };

        forest.forEach((root) => {
            buildTree(root, 0);
            currentX += 120;
        });
        console.log("Forest:", forest);
        console.table(
            forest.map((e: any) => ({
                id: e._id,
                name: e.name,
            }))
        );
        const layout = getLayoutedElements(flowNodes, flowEdges);
        console.log("FLOW NODES", flowNodes);
        console.log("FLOW EDGES", flowEdges);
        console.log("NODE COUNT", flowNodes.length);
        setNodes(layout.nodes);
        setEdges(layout.edges);
    }, [forest, setNodes, setEdges, expandedNodes,]);

    useEffect(() => {
        setNodes((nds) =>
            nds.map((node) => ({
                ...node,
                data: {
                    ...node.data,
                    highlight:
                        search.length > 0 &&
                        node.data.name
                            .toLowerCase()
                            .includes(search.toLowerCase()),
                },
            }))
        );
    }, [search, setNodes]);
    useEffect(() => {
        if (!search) return;

        const found = nodes.find((n) =>
            n.data.name.toLowerCase().includes(search.toLowerCase())
        );

        if (!found) return;

        setCenter(
            found.position.x,
            found.position.y,
            {
                zoom: 1.4,
                duration: 700,
            }
        );
    }, [search, nodes]);

    const defaultEdgeOptions = {
        animated: true,
        type: "organization",
        style: {
            stroke: "#0ea5e9",
            strokeWidth: 2,
        },
    };
    const departments = Array.from(
        new Set(
            nodes.map(
                (node: any) => node.data.department
            )
        )
    );

    return (
        <>
            <OrganizationToolbar
                search={search}
                setSearch={setSearch}
                department={department}
                setDepartment={setDepartment}
                role={role}
                setRole={setRole}
                sort={sort}
                setSort={setSort}
                departments={departments}
                totalEmployees={nodes.length}
                onZoomIn={() => zoomIn()}
                onZoomOut={() => zoomOut()}
                onFit={() => fitView()}
            />
            <div className="h-[750px] w-full rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                <ReactFlow
                    fitView
                    edgeTypes={edgeTypes}
                    fitViewOptions={{ padding: 0.3 }}
                    minZoom={0.2}
                    maxZoom={2}
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    defaultEdgeOptions={defaultEdgeOptions}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    proOptions={{ hideAttribution: true }}
                >
                    <Background
                        gap={30}
                        size={1.4}
                        color="#dbeafe"
                        variant={BackgroundVariant.Dots}
                    />
                    <MiniMap
                        pannable
                        zoomable
                        nodeStrokeWidth={2}
                        nodeBorderRadius={8}
                        maskColor="rgba(15,23,42,.15)"
                        style={{
                            background: "#efd0d0",
                            borderRadius: 12,
                            border: "1px solid #e2e8f0",
                        }}
                    />
                    <Controls showInteractive={false} />
                </ReactFlow>

            </div>
            <EmployeeDrawer
                employee={selectedEmployee}
                open={drawerOpen}
                onClose={() => {
                    setDrawerOpen(false);
                }}
            />
        </>
    );
}