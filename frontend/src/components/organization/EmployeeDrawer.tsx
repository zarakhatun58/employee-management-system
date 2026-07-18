import { X, Mail, Phone, Building2, Briefcase } from "lucide-react";
import Avatar from "../ui/Avatar";
import { roleColor, roleLabel, cn } from "../../lib/utils";
import type { TreeNode } from "../../types";

interface Props {
    employee: TreeNode | null;
    open: boolean;
    onClose: () => void;
}

export default function EmployeeDrawer({
    employee,
    open,
    onClose,
}: Props) {

    if (!employee) return null;

    return (
        <>
            {/* Overlay */}

            <div
                className={cn(
                    "fixed inset-0 z-40 bg-black/40 transition-opacity",

                    open
                        ? "opacity-100"
                        : "pointer-events-none opacity-0"
                )}
                onClick={onClose}
            />

            {/* Drawer */}

            <div
                className={cn(
                    "fixed right-0 top-0 z-50 h-full w-[420px] bg-white shadow-2xl transition-transform duration-300 dark:bg-slate-900",

                    open
                        ? "translate-x-0"
                        : "translate-x-full"
                )}
            >
                <div className="flex items-center justify-between border-b p-5">

                    <h2 className="text-xl font-bold">
                        Employee Details
                    </h2>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-slate-100"
                    >
                        <X />
                    </button>

                </div>

                <div className="space-y-6 p-6">

                    <div className="flex items-center gap-4">

                        <Avatar
                            name={employee.name}
                            src={employee.profileImage}
                            size={72}
                        />

                        <div>

                            <h2 className="text-xl font-bold">
                                {employee.name}
                            </h2>

                            <p className="text-slate-500">
                                {employee.designation}
                            </p>

                            <span
                                className={cn(
                                    "mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                                    roleColor(employee.role)
                                )}
                            >
                                {roleLabel(employee.role)}
                            </span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Mail size={18} />
                            <span>{employee.email || "Not Available"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone size={18} />
                            <span>{employee.phone || "Not Available"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Building2 size={18} />
                            <span>{employee.department}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Briefcase size={18} />
                            <span>{employee.designation}</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="mb-3 font-semibold">
                            Direct Reports
                        </h3>

                        {employee.children.length === 0 ? (

                            <p className="text-sm text-slate-500">
                                No Direct Reports
                            </p>

                        ) : (

                            <div className="space-y-2">

                                {employee.children.map(child => (

                                    <div
                                        key={child._id}
                                        className="flex items-center gap-3 rounded-lg border p-3"
                                    >

                                        <Avatar
                                            name={child.name}
                                            src={child.profileImage}
                                            size={38}
                                        />

                                        <div>

                                            <p className="font-medium">
                                                {child.name}
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                {child.designation}
                                            </p>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </>
    );
}