// src/services/adminService.ts

import { api } from "../api/client";

export const getAdminUsers = (params?: any) =>
  api.get("/meta-idx/users", { params });

export const verifyDevotee = (uuid: string) =>
  api.patch(`/meta-idx/users/${uuid}/verify-devotee`);

export const unverifyDevotee = (uuid: string) =>
  api.patch(`/meta-idx/users/${uuid}/unverify-devotee`);

export const activateUser = (uuid: string) =>
  api.patch(`/meta-idx/users/${uuid}/activate`);

export const deactivateUser = (uuid: string) =>
  api.patch(`/meta-idx/users/${uuid}/deactivate`);

export const getDevoteeRequests = (params?: any) =>
  api.get("/meta-idx/devotee-requests", { params });

export const reviewDevoteeRequest = (uuid: string, payload: any) =>
  api.patch(`/meta-idx/devotee-requests/${uuid}/review`, payload);

export const getAdminEvents = () => api.get("/meta-idx/events");
export const getAdminTrips = () => api.get("/meta-idx/trips");
export const getAdminCourses = () => api.get("/meta-idx/courses");
export const getAdminContent = () => api.get("/meta-idx/content");
export const getAdminContentPayments = () => api.get("/meta-idx/payments/content");
export const getAdminTripPayments = () => api.get("/meta-idx/payments/trips");
export const getAdminCoursePayments = () => api.get("/meta-idx/payments/courses");
export const getAdminSubscriptions = () => api.get("/meta-idx/subscriptions");
export const getAdminDonations = () => api.get("/meta-idx/donations");

export const updateAdminUser = (uuid: string, payload: any) =>
  api.patch(`/meta-idx/users/${uuid}`, payload);

export const updateAdminEventStatus = (uuid: string, status: string) =>
  api.patch(`/meta-idx/events/${uuid}/status`, { status });

export const deleteAdminEvent = (uuid: string) =>
  api.delete(`/meta-idx/events/${uuid}`);

export const updateAdminTripStatus = (
  uuid: string,
  status: string,
) => api.patch(`/meta-idx/trips/${uuid}/status`, { status });

export const deleteAdminTrip = (uuid: string) =>
  api.delete(`/meta-idx/trips/${uuid}`);