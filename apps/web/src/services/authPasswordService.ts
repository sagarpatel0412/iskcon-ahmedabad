import { api } from "../api/client";

export const forgotPassword = (email: string) =>
  api.post("/auth/forgot-password", { email });

export const resetPassword = (token: string, password: string) =>
  api.post("/auth/reset-password", {
    token,
    password,
  });