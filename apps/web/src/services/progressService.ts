import { api } from "../api/client";

export const createDailyProgress = (data: any) =>
  api.post("/daily-progress", data);

export const getMyDailyProgress = () =>
  api.get("/daily-progress/me");

export const getProgressStats = () =>
  api.get("/daily-progress/me/summary");
export const getMyProgressLevel = () =>
  api.get("/daily-progress/my-level");