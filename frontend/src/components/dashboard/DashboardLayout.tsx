import React from 'react';
import {
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  Users,
  Network,
  LogOut,
  Moon,
  Sun,
  Briefcase,
  Menu,
  X,
  FileBarChart2,
  Settings,
} from "lucide-react";

import {
  roleLabel,
  roleColor,
  cn,
} from "../../lib/utils";

import {
  ToastProvider,
} from "../../components/ui/Toast";

import Avatar from "../../components/ui/Avatar";
import Footer from "../layout/Footer";
import { useAuthStore } from '../../store/auth.store';
import { useUIStore } from '../../store/ui.store';
import ProfileModal from '../auth/ProfileModal';


const navItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/employees",
    label: "Employees",
    icon: Users,
  },
  {
    to: "/organization",
    label: "Organization",
    icon: Network,
  },
  {
    label: "Reports",
    to: "/reports",
    icon: FileBarChart2,
    roles: [
      "super_admin",
      "hr",
    ],
  },
  {
     label: "Settings",
   to: "/settings",
    icon: Settings,
    roles: [
      "super_admin",
    ],
  },
];

export default function DashboardLayout() {

  const {
    user,
    logout,
  } = useAuthStore();
  const dark = useUIStore((state) => state.dark);
  const toggleDark = useUIStore((state) => state.toggleDark);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    console.log("Theme:", dark);

    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);
  useEffect(() => {
    document.body.style.overflow =
      sidebarOpen
        ? "hidden"
        : "";
    return () => {
      document.body.style.overflow = "";

    };
  }, [sidebarOpen]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <ToastProvider>
      <div
        className="
        flex
        h-screen
        overflow-hidden
        bg-slate-50
        dark:bg-slate-950
        "
      >
        <aside
          className={cn(
            `
            fixed
            inset-y-0
            left-0
            z-50
            flex
            w-72
            flex-col
            border-r
            border-slate-200
            bg-white
            transition-transform
            duration-300
            ease-in-out
            dark:border-slate-800
            dark:bg-slate-900
            lg:static
            lg:w-64
            lg:translate-x-0
            `,

            sidebarOpen
              ?
              "translate-x-0"
              :
              "-translate-x-full"
          )}

        ><div
          className="
            flex
            h-16
            items-center
            justify-between
            border-b
            border-slate-200
            px-6
            dark:border-slate-800
            "
        >


            <div
              className="
              flex
              items-center
              gap-3
              "
            >

              <div
                className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-sky-600
                "
              >

                <Briefcase
                  className="
                  h-5
                  w-5
                  text-white
                  "
                />
              </div>
              <span
                className="
                text-xl
                font-bold
                text-slate-900
                dark:text-white
                "
              >
                EMS
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="
              rounded-lg
              p-2
              hover:bg-slate-100
              dark:hover:bg-slate-800
              lg:hidden
              "

            >
              <X
                className="
                h-5
                w-5
                "
              />
            </button>
          </div>
          <nav
            className="
            flex-1
            space-y-1
            overflow-y-auto
            p-4
            "
          >
            {
              navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        `
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-4
                        py-3
                        text-sm
                        font-medium
                        transition
                        `,
                        isActive
                          ?
                          `
                        bg-sky-50
                        text-sky-700
                        dark:bg-sky-500/10
                        dark:text-sky-400
                        `
                          :
                          `
                        text-slate-600
                        hover:bg-slate-100
                        dark:text-slate-400
                        dark:hover:bg-slate-800
                        `
                      )
                    }
                  >
                    <Icon
                      className="
                      h-5
                      w-5
                      "
                    />
                    {item.label}
                  </NavLink>
                );
              })
            }
          </nav>
          <div className="border-t border-slate-200 p-4 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Avatar
                name={user?.name}
                size={40}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">
                  {user?.name}
                </p>

                <span
                  className={cn(
                    "mt-1 inline-flex rounded-full px-2 py-0.5 text-xs",
                    roleColor(user?.role ?? "")
                  )}
                >
                  {roleLabel(user?.role ?? "")}
                </span>

              </div>

            </div>

            <button
              onClick={() => {
                console.log("Profile Click");
                setProfileOpen(true);
              }}
              className="
      mt-4
      w-full
      rounded-xl
      bg-sky-600
      px-4
      py-2
      text-sm
      font-medium
      text-white
      transition
      hover:bg-sky-700
      cursor-pointer
    "
            >
              My Profile
            </button>

          </div>
        </aside>
        {
          sidebarOpen && (
            <div
              onClick={() => setSidebarOpen(false)}
              className="
              fixed
              inset-0
              z-40
              bg-black/50
              backdrop-blur-sm
              lg:hidden
              "
            />
          )
        }
        <div
          className="
          flex
          min-w-0
          flex-1
          flex-col
          "
        ><header
          className="
            flex
            h-16
            items-center
            justify-between
            border-b
            border-slate-200
            bg-white
            px-4
            dark:border-slate-800
            dark:bg-slate-900
            "
        >
            <button
              onClick={() => setSidebarOpen(true)}
              className="
              rounded-lg
              p-2
              hover:bg-slate-100
              dark:hover:bg-slate-800
              lg:hidden
              "
            >
              <Menu
                className="
                h-5
                w-5
                "
              />
            </button>
            <div
              className="
              hidden
              lg:block
              "
            >
              <h2
                className="
                font-semibold
                text-slate-800
                dark:text-white
                "
              >
                Employee Management System
              </h2>
            </div>
            <div
              className="
              flex
              items-center
              gap-2
              "
            >
              <button
                onClick={() => {
                  console.log("clicked");
                  toggleDark();
                }}
                className="
                rounded-lg
                border
                p-2
                hover:bg-slate-100
                dark:hover:bg-slate-800
                "
              >

                {
                  dark
                    ?
                    <Sun className="h-5 w-5 text-yellow-600" />
                    :
                    <Moon className="h-5 w-5 text-blue-800" />
                }
              </button>
              <button
                onClick={handleLogout}
                className="
                flex
                items-center
                gap-2
                rounded-lg
                px-3
                py-2
                text-sm
                text-rose-600
                hover:bg-rose-50
                dark:hover:bg-rose-500/10
                "
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:block">
                  Logout
                </span>
              </button>
            </div>
          </header>
          <main
            className="
            flex-1
            overflow-y-auto
            p-4
            lg:p-6
            "
          >
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </ToastProvider>

  );
}