
import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Bell,
    ChevronDown,
    Menu,
    Moon,
    Search,
    Sun
} from "lucide-react";
import Avatar from "../../components/ui/Avatar";
import { Input } from "../../components/ui/primitives";
import { useAuthStore } from "../../store/auth.store";
import { useUIStore } from "../../store/ui.store";
import { cn } from "../../lib/utils";

interface NavbarProps {
    onMenuClick: () => void;
}

const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/employees": "Employees",
    "/organization": "Organization",
    "/departments": "Departments",
    "/settings": "Settings",
    "/profile": "My Profile"
};

export default function Navbar({
    onMenuClick
}: NavbarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const { dark, toggleDark } = useUIStore();

    const [search, setSearch] = useState("");

    const [dropdownOpen, setDropdownOpen] =
        useState(false);

    const title = useMemo(() => {
        const key = Object.keys(pageTitles).find(path =>
            location.pathname.startsWith(path)
        );

        return key
            ? pageTitles[key]
            : "Employee Management";
    }, [location.pathname]);

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 lg:px-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="rounded-xl p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
                >
                    <Menu className="h-5 w-5" />
                </button>

                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                        {title}
                    </h1>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Welcome back{user?.name ? `, ${user.name}` : ""}
                    </p>
                </div>
            </div>

            <div className="hidden w-full max-w-md lg:block">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search employees..."
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={toggleDark}
                    className="rounded-xl p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    {dark ? (
                        <Sun className="h-5 w-5" />
                    ) : (
                        <Moon className="h-5 w-5" />
                    )}
                </button>

                <button className="relative rounded-xl p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Bell className="h-5 w-5" />

                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                </button>

                <div className="relative">
                    <button
                        onClick={() =>
                            setDropdownOpen((prev) => !prev)
                        }
                        className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <Avatar
                            name={user?.name}
                            size={40}
                        />

                        <div className="hidden text-left lg:block">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                {user?.name}
                            </p>

                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {user?.role.replace("_", " ")}
                            </p>
                        </div>

                        <ChevronDown
                            className={cn(
                                "h-4 w-4 transition-transform",
                                dropdownOpen && "rotate-180"
                            )}
                        />
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
                            <div className="border-b border-slate-200 p-4 dark:border-slate-700">
                                <div className="flex items-center gap-3">
                                    <Avatar name={user?.name} size={48} />
                                    <div className="min-w-0 flex-1">
                                        <h4 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                                            {user?.name}
                                        </h4>
                                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-2">
                                <Link
                                    to="/profile"
                                    onClick={() => setDropdownOpen(false)}
                                    className="flex items-center rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    My Profile
                                </Link>

                                <Link
                                    to="/settings"
                                    onClick={() => setDropdownOpen(false)}
                                    className="flex items-center rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    Settings
                                </Link>

                                <hr className="my-2 border-slate-200 dark:border-slate-700" />

                                <button
                                    onClick={async () => {
                                        await useAuthStore.getState().logout();
                                        setDropdownOpen(false);
                                        navigate("/login");
                                    }}
                                    className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}