const TOKEN_KEY = "krishna_web_token";
const USER_KEY = "krishna_web_user";
import { api } from "../api/client";

export const logoutApi = () => api.post("/auth/logout");

export const saveToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const saveUser = (user: any) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getStoredUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const logout = async () => {
  try {
    await logoutApi();
  } catch (error) {
    console.error(error);
  } finally {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};