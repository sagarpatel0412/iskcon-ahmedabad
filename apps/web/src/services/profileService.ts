// src/services/profileService.ts

import { api } from "../api/client";

export const getMyProfile = () => api.get("/users/me");

export const updateMyProfile = (payload: any) =>
  api.patch("/users/me", payload);

export const getMySubscription = () =>
  api.get("/content/my-subscription");

export const getMyPurchases = () =>
  api.get("/content/my-purchases");

export const cancelSubscription = (reason?: string) =>
  api.post("/content/subscriptions/cancel", {
    reason,
  });