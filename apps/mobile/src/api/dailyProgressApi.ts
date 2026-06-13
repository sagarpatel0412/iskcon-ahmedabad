import { api } from "./client";
import { getToken } from "../storage/authStorage";

const authHeaders = async () => {
  const token = await getToken();

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const saveDailyProgress = async (payload: any) => {
  const headers = await authHeaders();
  return api.post("/daily-progress", payload, { headers });
};

export const getMyDailyProgress = async () => {
  const headers = await authHeaders();
  return api.get("/daily-progress/me", { headers });
};

export const getTodayProgress = async () => {
  const headers = await authHeaders();
  return api.get("/daily-progress/me/today", { headers });
};

export const getProgressSummary = async () => {
  const headers = await authHeaders();
  return api.get("/daily-progress/me/summary", { headers });
};

export const updateDailyProgress = async (uuid: string, payload: any) => {
  const headers = await authHeaders();
  return api.patch(`/daily-progress/${uuid}`, payload, { headers });
};

export const deleteDailyProgress = async (uuid: string) => {
  const headers = await authHeaders();
  return api.delete(`/daily-progress/${uuid}`, { headers });
};