import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../services/api";
import type { Role, User } from "../types";
import { authService } from "../services/auth.service";

interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: User;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;

  register: (
    name: string,
    email: string,
    password: string,
    role?: Role
  ) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  getMe: () => Promise<void>;
  clearError: () => void;
}
const demoUsers: Array<{
  email: string;
  password: string;
  user: User;
}> = [
    {
      email: "admin@ems.com",
      password: "Admin@123",
      user: {
        id: "1",
        name: "Super Admin",
        email: "admin@ems.com",
        role: "super_admin" as Role,
        employee: null,
      },
    },
    {
      email: "hr@ems.com",
      password: "Hr@12345",
      user: {
        id: "2",
        name: "HR Manager",
        email: "hr@ems.com",
        role: "hr" as Role,
        employee: null,
      },
    },
    {
      email: "alice@ems.com",
      password: "Alice@123",
      user: {
        id: "3",
        name: "Alice Employee",
        email: "alice@ems.com",
        role: "employee" as Role,
        employee: null,
      },
    },
  ];


export const useAuthStore = create<AuthState>()(

  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,
      loading: false,
      error: null,

      register: async (
        name,
        email,
        password,
        role = "employee"
      ) => {

        set({
          loading: true,
          error: null
        });


        try {

          const res =
            await authService.register({
              name,
              email,
              password
            });


          localStorage.setItem(
            'token',
            res.token
          );

          localStorage.setItem(
            'user',
            JSON.stringify(res.user)
          );

          set({
            token: res.token,
            refreshToken: res.refreshToken ?? null,
            user: {
              ...res.user,
              role: res.user.role as Role,
            },
            loading: false,
          });
          return true;
        } catch (err: any) {
          set({

            error:
              err.response?.data?.message ??
              'Registration failed',

            loading: false

          });


          return false;

        }

      },

      login: async (email, password) => {

        set({
          loading: true,
          error: null,
        });


        try {

          // First try backend API
          try {

            const res = await authService.login({
              email,
              password,
            });


            localStorage.setItem(
              'token',
              res.token
            );

            localStorage.setItem(
              'user',
              JSON.stringify(res.user)
            );


            set({
              token: res.token,
              user: res.user,
              loading: false,
            });


            return true;

          } catch {

            // Demo login fallback
            const demo = demoUsers.find(
              (item) =>
                item.email === email &&
                item.password === password
            );


            if (!demo) {
              throw new Error(
                'Invalid email or password'
              );
            }


            const demoToken =
              'demo-token-' + Date.now();


            localStorage.setItem(
              'token',
              demoToken
            );


            localStorage.setItem(
              'user',
              JSON.stringify(demo.user)
            );


            set({
              token: demoToken,
              user: demo.user,
              loading: false,
            });


            return true;
          }


        } catch (err: any) {

          set({
            error:
              err.message ||
              'Login failed',
            loading: false,
          });

          return false;
        }
      },


      getMe: async () => {
        try {
          const token = get().token;

          if (!token) return;

          api.defaults.headers.common.Authorization = `Bearer ${token}`;

          const { data } = await api.get("/auth/me");

          set({
            user: data.user ?? data,
          });
        } catch {
          set({
            token: null,
            refreshToken: null,
            user: null,
          });
        }
      },

      logout: async () => {
        try {
          await api.post("/auth/logout");
        } catch { }

        delete api.defaults.headers.common.Authorization;

        set({
          token: null,
          refreshToken: null,
          user: null,
          error: null,
        });
      },

      clearError: () =>
        set({
          error: null,
        }),
    }),
    {
      name: "ems-auth",
    }
  )
);