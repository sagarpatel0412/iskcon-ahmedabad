import axios from "axios";
import { getToken } from "../storage/authStorage";

export const API_BASE_URL = "http://192.168.29.176:3000/api/v1";
// For real mobile later use Mac IP:
// export const API_BASE_URL = "http://192.168.1.5:3000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});