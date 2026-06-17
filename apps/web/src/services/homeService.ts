import { api } from "../api/client";

export const getRecommendedKrishnaImages = () =>
  api.get("/krishna-images/recommended");

export const getAllKrishnaImages = () => api.get("/krishna-images");