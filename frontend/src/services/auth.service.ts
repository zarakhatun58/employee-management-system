import api from "./api";
import type { Role, User } from "../types";

export interface RegisterResponse {
  token: string;
  refreshToken?: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export interface MeResponse {
  user: User;
}

export const authService = {
  async register(data: RegisterPayload) {
    const res = await api.post<RegisterResponse>(
      "/auth/register",
      data
    );

    return res.data;
  },

  async login(data: LoginPayload) {
    const res = await api.post<RegisterResponse>(
      "/auth/login",
      data
    );

    return res.data;
  },

  async logout() {
    const res = await api.post("/auth/logout");

    return res.data;
  },

  async me() {
    const res = await api.get<MeResponse>(
      "/auth/me"
    );

    return res.data;
  },
};