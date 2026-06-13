import { api } from "../api/client";

export const getSubscriptionPlans = () =>
  api.get("/content/subscriptions/plans");

export const createPostPurchaseOrder = (postUuid: string) =>
  api.post(`/content/posts/${postUuid}/create-order`);

export const verifyPostPurchase = (payload: any) =>
  api.post("/content/posts/verify-payment", payload);

export const createSubscriptionOrder = (planUuid: string) =>
  api.post(`/content/subscriptions/${planUuid}/create-order`);

export const verifySubscriptionPayment = (payload: any) =>
  api.post("/content/subscriptions/verify-payment", payload);

export const getMySubscription = () =>
  api.get("/content/my-subscription");

export const getMyPurchases = () =>
  api.get("/content/my-purchases");