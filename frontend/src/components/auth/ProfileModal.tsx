import {
    X,
    Mail,
    Phone,
    Building2,
    Briefcase,
    BadgeCheck,
} from "lucide-react";

import Avatar from "../ui/Avatar";
import { cn, roleColor, roleLabel } from "../../lib/utils";
import { User } from "../../types";
import { useEffect, useState } from "react";
import { authService } from "../../services/auth.service";


interface Props {
    open: boolean;
    onClose: () => void;
}
interface CurrentUser {
    id: string;
    name: string;
    email: string;
    role: string;

    employee?: {
        employeeId: string;
        department: string;
        designation: string;
        profileImage?: string;
    };
}
export default function ProfileModal({
    open,
    onClose,
}: Props) {
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!open) return;

        setLoading(true);

        authService
            .me()
            .then((res) => {
                console.log("ME API RESPONSE:", res);
                setUser(res);
            })
            .catch((error) => {
                console.error("ME API ERROR:", error);
            })
            .finally(() => {
                setLoading(false);
            });

    }, [open]);
    if (!open) return null;

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center">
                Loading...
            </div>
        );
    }
    if (!user) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
                <div className="rounded-xl bg-white p-4 text-center">
                    <p className="text-slate-700">
                        Unable to load profile
                    </p>

                    <button
                        onClick={onClose}
                        className="mt-4 rounded-lg bg-sky-500 px-4 py-2 text-white"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }
    return (
        <>
            <div
                onClick={onClose}
                className={cn(
                    "fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm transition",
                    open ? "opacity-100" : "pointer-events-none opacity-0"
                )}
            />

            <div
                className={cn(
                    "fixed left-1/2 top-1/2 z-[100] w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl transition-all duration-300 dark:bg-slate-900",
                    open
                        ? "scale-100 opacity-100"
                        : "pointer-events-none scale-95 opacity-0"
                )}
            >

                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-700">
                    <h2 className="text-lg mt-2font-semibold text-slate-900 dark:text-white">
                        My Profile
                    </h2>

                    <button
                        onClick={onClose}
                        className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <X />
                    </button>
                </div>

                {loading ? (
                    <div className="p-10 text-center text-slate-500">
                        Loading profile...
                    </div>
                ) : (
                    <div className="p-4">

                        <div className="flex flex-col items-center">

                            <Avatar
                                name={user.name}
                                src={user.employee?.profileImage}
                                size={64}
                            />

                            <h2 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">
                                {user.name}
                            </h2>

                            <span
                                className={cn(
                                    "mt-2 rounded-full px-3 py-1 text-xs font-semibold",
                                    roleColor(user.role)
                                )}
                            >
                                {roleLabel(user.role)}
                            </span>

                        </div>

                        <div className="mt-4 space-y-2">

                            <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Email
                                </p>

                                <span className="text-xs pl-4 font-medium text-slate-900 dark:text-white">
                                    {user.email}
                                </span>
                            </div>

                            <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Role
                                </p>

                                <span className="text-xs pl-4 font-medium text-slate-900 dark:text-white">
                                    {roleLabel(user.role)}
                                </span>
                            </div>

                            <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Employee ID
                                </p>

                                <span className="text-xs pl-4 font-medium text-slate-900 dark:text-white">
                                    {user.employee?.employeeId ?? "N/A"}
                                </span>
                            </div>

                            <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Department
                                </p>

                                <span className="text-xs pl-4 font-medium text-slate-900 dark:text-white">
                                    {user.employee?.department ?? "N/A"}
                                </span>
                            </div>

                            <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Designation
                                </p>

                                <span className="text-xs pl-4 font-medium text-slate-900 dark:text-white">
                                    {user.employee?.designation ?? "N/A"}
                                </span>
                            </div>

                        </div>

                    </div>
                )}
            </div>
        </>
    );
}

function InfoCard({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-2 flex items-center gap-2 text-sky-600">
                {icon}

                <span className="text-sm font-semibold">
                    {label}
                </span>
            </div>

            <p className="break-all text-sm text-slate-700 dark:text-slate-300">
                {value}
            </p>
        </div>
    );
}

function InfoRow({
    icon,
    title,
    value,
}: {
    icon: React.ReactNode;
    title: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700">

            <div className="rounded-lg bg-sky-100 p-3 text-sky-600 dark:bg-sky-500/10">
                {icon}
            </div>

            <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                    {title}
                </p>

                <p className="mt-1 font-medium text-slate-800 dark:text-white">
                    {value}
                </p>
            </div>

        </div>
    );
}

function StatCard({
    title,
    value,
}: {
    title: string;
    value: string;
}) {
    return (
        <div className="rounded-xl bg-slate-100 p-5 text-center dark:bg-slate-800">

            <p className="text-xs uppercase text-slate-500">
                {title}
            </p>

            <h3 className="mt-2 text-lg font-bold text-slate-800 dark:text-white">
                {value}
            </h3>

        </div>
    );
}