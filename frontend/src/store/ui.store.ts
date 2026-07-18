import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  dark: boolean;
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  pageLoading: boolean;

  toggleDark: () => void;
  setDark: (value: boolean) => void;

  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;

  toggleSidebarCollapsed: () => void;

  setPageLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      dark: true,
      sidebarOpen: false,
      sidebarCollapsed: false,
      pageLoading: false,

      toggleDark: () =>
        set((state) => ({
          dark: !state.dark,
        })),

      setDark: (value) =>
        set({
          dark: value,
        }),

      toggleSidebar: () =>
        set((state) => ({
          sidebarOpen: !state.sidebarOpen,
        })),

      openSidebar: () =>
        set({
          sidebarOpen: true,
        }),

      closeSidebar: () =>
        set({
          sidebarOpen: false,
        }),

      toggleSidebarCollapsed: () =>
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        })),

      setPageLoading: (loading) =>
        set({
          pageLoading: loading,
        }),
    }),
    {
      name: "ems-ui",
      partialize: (state) => ({
        dark: state.dark,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);