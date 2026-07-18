import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Network,
  Building2,
  Briefcase,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  User,
  Shield,
  X
} from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { cn, roleColor, roleLabel } from "../../lib/utils";
import Avatar from "../../components/ui/Avatar";
import type { Role } from "../../types";

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
}

interface MenuItem {
  title: string;
  path: string;
  icon: React.ElementType;
  roles: Role[];
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: ["super_admin", "hr", "employee"]
  },
  {
    title: "Employees",
    path: "/employees",
    icon: Users,
    roles: ["super_admin", "hr"]
  },
  {
    title: "Organization",
    path: "/organization",
    icon: Network,
    roles: ["super_admin", "hr"]
  },
  {
    title: "Departments",
    path: "/departments",
    icon: Building2,
    roles: ["super_admin", "hr"]
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
    roles: ["super_admin"]
  }
];

export default function Sidebar({
  mobileOpen,
  setMobileOpen
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuthStore();

  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const renderMenu = () =>
    menuItems
      .filter(item => user && item.roles.includes(user.role))
      .map(item => {
        const Icon = item.icon;

        const active =
          location.pathname === item.path ||
          location.pathname.startsWith(item.path + "/");

        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "group flex items-center rounded-xl transition-all duration-200",
              collapsed ? "justify-center p-3" : "gap-3 px-4 py-3",
              active
                ? "bg-sky-600 text-white shadow-lg shadow-sky-600/20"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />

            {!collapsed && (
              <span className="truncate text-sm font-medium">
                {item.title}
              </span>
            )}
          </NavLink>
        );
      });

        return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-slate-200 bg-white transition-all duration-300 dark:border-slate-800 dark:bg-slate-900",
          collapsed ? "w-20" : "w-72",
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-600 shadow-lg shadow-sky-600/30">
              <Briefcase className="h-6 w-6 text-white" />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <h1 className="truncate text-lg font-bold text-slate-900 dark:text-white">
                  EMS
                </h1>

                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  Employee Management
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="hidden border-b border-slate-200 p-3 dark:border-slate-800 lg:block">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "flex w-full items-center rounded-xl border border-slate-200 bg-slate-50 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700",
              collapsed ? "justify-center p-3" : "justify-between px-4 py-3"
            )}
          >
            {!collapsed && (
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Collapse Menu
              </span>
            )}

            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5">
          <div className="space-y-2">
            {renderMenu()}
          </div>

          {!collapsed && (
            <div className="mt-8 rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-500 p-5 text-white">
              <Shield className="mb-3 h-8 w-8" />

              <h3 className="text-base font-semibold">
                Employee Portal
              </h3>

              <p className="mt-2 text-sm leading-6 text-sky-100">
                Secure employee management with role-based access,
                reporting hierarchy and organization insights.
              </p>
            </div>
          )}
        </div>
                <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <div
            className={cn(
              "rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800",
              collapsed ? "p-3" : "p-4"
            )}
          >
            {collapsed ? (
              <div className="flex flex-col items-center gap-3">
                <Avatar name={user?.name} size={44} />
                <button
                  onClick={handleLogout}
                  className="rounded-xl p-2 text-slate-500 transition hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <Avatar name={user?.name} size={48} />

                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {user?.name ?? "Unknown User"}
                    </h4>

                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {user?.email}
                    </p>

                    <span
                      className={cn(
                        "mt-2 inline-flex rounded-full px-2 py-1 text-[11px] font-semibold",
                        roleColor(user?.role ?? "employee")
                      )}
                    >
                      {roleLabel(user?.role ?? "employee")}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <NavLink
                    to="/profile"
                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
                    onClick={() => setMobileOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>My Profile</span>
                  </NavLink>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {!collapsed && (
            <div className="mt-4 text-center">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Employee Management System
              </p>
              <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                Version 1.0.0
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}