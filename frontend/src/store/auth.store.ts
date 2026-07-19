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

  updateProfile: (
    data: {
      name: string;
      email: string;
    }
  ) => Promise<boolean>;
  clearError: () => void;
}


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
          const res = await authService.register({
            name,
            email,
            password,
            role,
          });

          localStorage.setItem("token", res.token);

          localStorage.setItem(
            "user",
            JSON.stringify(res.user)
          );

          set({
            token: res.token,
            user: res.user,
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
          const res = await authService.login({
            email,
            password,
          });

          localStorage.setItem("token", res.token);

          localStorage.setItem(
            "user",
            JSON.stringify(res.user)
          );

          set({
            token: res.token,
            user: res.user,
            loading: false,
          });

          return true;
        } catch (err: any) {
          set({
            error:
              err.response?.data?.message ??
              "Login failed",
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
            user: data.user,
          });
        } catch {
          set({
            token: null,
            refreshToken: null,
            user: null,
          });
        }
      },
      updateProfile: async (data) => {
        set({
          loading: true,
          error: null,
        });

        try {
          const res = await authService.updateProfile(data);

          localStorage.setItem(
            "user",
            JSON.stringify(res.user)
          );

          set({
            user: res.user,
            loading: false,
          });

          return true;
        } catch (err: any) {
          set({
            error:
              err.response?.data?.message ??
              "Failed to update profile",
            loading: false,
          });

          return false;
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