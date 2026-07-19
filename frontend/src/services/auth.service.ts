import api from "./api";
import type { AuthResponse, Role, User } from "../types";

export interface RegisterResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  user: User;
}
export interface UpdateProfileResponse {
  success: boolean;
  message: string;
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
  async login(data: LoginPayload) {
    const res = await api.post<AuthResponse>(
      "/auth/login",
      data
    );

    return res.data;
  },

  async register(data: RegisterPayload) {
    const res = await api.post<AuthResponse>(
      "/auth/register",
      data
    );

    return res.data;
  },

  async logout() {
    return (await api.post("/auth/logout")).data;
  },

 async me() {
  const { data } = await api.get("/auth/me");
  return data.user;
},
updateProfile(data: {
  name: string;
  email: string;
}) {
  return api
    .put<UpdateProfileResponse>(
      "/auth/profile",
      data
    )
    .then((res) => res.data);
}
};