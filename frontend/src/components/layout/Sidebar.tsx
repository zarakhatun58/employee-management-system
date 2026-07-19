import { useState } from "react";
import {
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  Network,
  FileBarChart2,
  Settings,
  Briefcase,
  Shield,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import Avatar from "../ui/Avatar";
import { useAuthStore } from "../../store/auth.store";
import {
  cn,
  roleColor,
  roleLabel,
} from "../../lib/utils";
import { authService } from "../../services/auth.service";
import ProfileModal from "../auth/ProfileModal";

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const menuItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: [
      "super_admin",
      "hr",
      "employee",
    ],
  },
  {
    title: "Employees",
    path: "/employees",
    icon: Users,
    roles: [
      "super_admin",
      "hr",
    ],
  },
  {
    title: "Organization",
    path: "/organization",
    icon: Network,
    roles: [
      "super_admin",
      "hr",
      "employee",
    ],
  },
  {
    title: "Reports",
    path: "/reports",
    icon: FileBarChart2,
    roles: [
      "super_admin",
      "hr",
    ],
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
    roles: [
      "super_admin",
    ],
  },
];

export default function Sidebar({
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  const handleProfile = async () => {
    try {
      setLoadingProfile(true);
      const data = await authService.me();
      setProfile(data);
      setProfileOpen(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProfile(false);
    }
  };
  const renderMenu = () =>
    menuItems
      .filter(
        (item) =>
          user &&
          item.roles.includes(user.role)
      )
      .map((item) => {
        const Icon = item.icon;

        const active =
          location.pathname === item.path ||
          location.pathname.startsWith(
            item.path + "/"
          );

        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() =>
              setMobileOpen(false)
            }
            className={cn(
              "relative group flex items-center overflow-hidden rounded-2xl transition-all duration-300",

              collapsed
                ? "justify-center p-3"
                : "gap-4 px-4 py-3",

              active
                ? `
                  bg-gradient-to-r
                  from-sky-500
                  via-cyan-500
                  to-indigo-600
                  text-white
                  shadow-xl
                  shadow-sky-500/25
                  scale-[1.02]
                `
                : `
                  text-slate-600
                  hover:bg-sky-50
                  hover:text-sky-700
                  dark:text-slate-300
                  dark:hover:bg-slate-800
                  dark:hover:text-white
                  hover:translate-x-1
                `
            )}
          >
            {active && (
              <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-white" />
            )}

            <Icon className="h-5 w-5 shrink-0" />

            {!collapsed && (
              <span className="font-medium">
                {item.title}
              </span>
            )}

            {!collapsed && active && (
              <div className="ml-auto h-2 w-2 rounded-full bg-white" />
            )}
          </NavLink>
        );
      });
  return (
    <>
      {/* Mobile Overlay */}

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}

      <aside
        className={cn(
          `
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          flex-col
          border-r
          border-slate-200/70

          bg-gradient-to-b
          from-white
          via-slate-50
          to-slate-100

          dark:border-slate-800

          dark:from-slate-950
          dark:via-slate-900
          dark:to-slate-950

          transition-all
          duration-300
          shadow-xl
          `,

          collapsed ? "w-20" : "w-72",

          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >

        {/* Logo */}

        <div className="flex h-20 items-center justify-between border-b border-slate-200/70 px-5 dark:border-slate-800">

          <div className="flex items-center gap-4 overflow-hidden">

            <div
              className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl

              bg-gradient-to-br
              from-sky-500
              via-cyan-500
              to-indigo-600

              shadow-xl
              shadow-sky-500/30
              "
            >
              <Briefcase className="h-6 w-6 text-white" />
            </div>

            {!collapsed && (

              <div>

                <h1
                  className="
                  text-xl
                  font-extrabold
                  tracking-wide

                  bg-gradient-to-r
                  from-sky-600
                  to-indigo-600

                  bg-clip-text
                  text-transparent
                  "
                >
                  EMS
                </h1>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Employee Management
                </p>

              </div>

            )}

          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-xl p-2 hover:bg-slate-200 dark:hover:bg-slate-800 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* Collapse */}

        <div className="hidden border-b border-slate-200/70 p-4 dark:border-slate-800 lg:block">

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="
            flex
            w-full
            items-center
            justify-between
            rounded-2xl

            bg-slate-100
            px-4
            py-3

            hover:bg-slate-200

            dark:bg-slate-800
            dark:hover:bg-slate-700
            "
          >

            {!collapsed && (

              <span className="text-sm font-semibold">
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

        {/* Navigation */}

        <div className="flex-1 overflow-y-auto px-4 py-6">

          <div className="space-y-3">
            {renderMenu()}
          </div>

          {!collapsed && (

            <div
              className="
              mt-10
              rounded-3xl

              bg-gradient-to-br
              from-sky-500
              via-cyan-500
              to-indigo-600

              p-6

              text-white

              shadow-xl
              shadow-sky-500/25
              "
            >

              <Shield className="mb-4 h-9 w-9" />

              <h3 className="text-lg font-bold">
                Employee Portal
              </h3>

              <p className="mt-3 text-sm leading-6 text-sky-100">
                Manage employees, departments,
                reporting hierarchy and analytics
                from one place.
              </p>

            </div>

          )}

        </div>

        {/* User */}

        <div className="border-t border-slate-200/70 p-4 dark:border-slate-800">

          <div
            className={cn(
              `
              rounded-3xl

              border
              border-slate-200

              bg-white

              shadow-lg

              dark:border-slate-700
              dark:bg-slate-900
              `,
              collapsed ? "p-3" : "p-5"
            )}
          >

            {collapsed ? (

              <div className="flex flex-col items-center gap-4">

                <Avatar
                  name={user?.name}
                  size={46}
                />

                <button
                  onClick={handleLogout}
                  className="
                  rounded-xl
                  p-2

                  text-rose-500

                  hover:bg-rose-50

                  dark:hover:bg-rose-500/10
                  "
                >
                  <LogOut className="h-5 w-5" />
                </button>

              </div>

            ) : (

              <>

                <div className="flex items-center gap-3">

                  <Avatar
                    name={user?.name}
                    size={52}
                  />

                  <div className="min-w-0 flex-1">

                    <h4 className="truncate text-sm font-bold text-slate-900 dark:text-white">
                      {user?.name}
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

                <div className="mt-5 space-y-2">
                  <button
                    onClick={() => {
                      console.log("PROFILE BUTTON CLICKED");
                      setProfileOpen(true);
                      setMobileOpen(false);
                    }}
                    className="
  cursor-pointer
  flex
  w-full
  items-center
  gap-3
  rounded-xl
  px-3
  py-2
  text-sm
  text-slate-600
  transition
  hover:bg-slate-200
  dark:text-slate-300
  dark:hover:bg-slate-700
  "
                  >
                    <User className="h-4 w-4" />

                    <span>
                      {loadingProfile ? "Loading..." : "My Profile"}
                    </span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-3

                    text-rose-600

                    hover:bg-rose-50

                    dark:hover:bg-rose-500/10
                    "
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>

                </div>

              </>

            )}

          </div>

          {!collapsed && (

            <div className="mt-5 text-center">

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Employee Management System
              </p>

              <p className="mt-1 text-[11px] text-slate-400">
                Version 1.0.0
              </p>

            </div>

          )}

        </div>

      </aside>
      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </>
  );
}