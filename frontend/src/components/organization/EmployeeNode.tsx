import { memo } from "react";
import { Handle, Position } from "reactflow";
import Avatar from "../ui/Avatar";
import { roleColor, roleLabel, cn } from "../../lib/utils";
import { ChevronDown, ChevronRight, Crown } from "lucide-react";
import { departmentColor } from "../../lib/utils";

interface EmployeeNodeData {
    _id: string;
    name: string;
    designation: string;
    department: string;
    role: string;
    profileImage?: string;
    reports?: number;
    highlight?: boolean;
    expanded?: boolean;
    onToggle?: () => void;
    onClick?: () => void;
}

function EmployeeNode({ data }: { data: EmployeeNodeData }) {

    return (
        <>
            <Handle type="target" position={Position.Top} />
            <div
                onClick={data.onClick}
                className={cn(
                    "block w-72 cursor-pointer rounded-2xl border bg-white p-4 shadow-lg transition-all duration-300",
                    data.highlight
                        ? "border-sky-500 ring-4 ring-sky-200 scale-105"
                        : "border-slate-200 dark:border-slate-700"
                )}
            >
                <div className="flex items-center gap-3">

                    <Avatar
                        name={data.name}
                        src={data.profileImage}
                        size={52}
                    />

                    <div className="flex-1">
                        <div className="flex items-center gap-2">

                            <h3 className="font-semibold text-slate-800 dark:text-white">
                                {data.name}
                            </h3>
                            {(data.role === "ADMIN" ||
                                data.role === "CEO") && (
                                    <Crown
                                        size={16}
                                        className="text-yellow-500"
                                    />
                                )}
                        </div>
                        <p className="text-sm text-slate-500">
                            {data.designation}
                        </p>
                        <div
                            className={cn(
                                "mt-2 inline-flex rounded-full px-2 py-1 text-xs font-medium",
                                departmentColor(data.department)
                            )}
                        >
                            {data.department}
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between">

                    <span
                        className={cn(
                            "rounded-full px-3 py-1 text-xs font-semibold",
                            roleColor(data.role)
                        )}
                    >
                        {roleLabel(data.role)}
                    </span>

                    <div className="mt-4 flex items-center justify-between">
                        <span
                            className={cn(
                                "rounded-full px-3 py-1 text-xs font-semibold",
                                roleColor(data.role)
                            )}
                        >
                            {roleLabel(data.role)}
                        </span>

                        <span className="text-xs text-slate-500">
                            {data.reports} Reports
                        </span>
                    </div>

                    {data.reports !== undefined && data.reports > 0 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                data.onToggle?.();
                            }}
                            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-100 py-2 text-sm hover:bg-slate-200 dark:bg-slate-800"
                        >
                            {data.expanded ? (
                                <>
                                    <ChevronDown size={16} />
                                    Collapse
                                </>
                            ) : (
                                <>
                                    <ChevronRight size={16} />
                                    Expand
                                </>
                            )}
                        </button>
                    )}
                </div>

            </div>
            <Handle type="source" position={Position.Bottom} />
        </>
    );
}

export default memo(EmployeeNode);