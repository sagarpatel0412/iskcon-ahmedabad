// src/api/tripApi.ts

import {api} from "./client";

export const getTrips = () => api.get("/trips");

export const getTripByUuid = (uuid: string) =>
  api.get(`/trips/${uuid}`);

export const createTrip = (payload: any) =>
  api.post("/trips", payload);

export const updateTrip = (uuid: string, payload: any) =>
  api.patch(`/trips/${uuid}`, payload);

export const registerTrip = (uuid: string, payload: any) =>
  api.post(`/trips/${uuid}/register`, payload);

export const verifyTripPayment = (payload: any) =>
  api.post("/trips/verify-payment", payload);

export const getMyCreatedTrips = () =>
  api.get("/trips/me/created");

export const getMyTripRegistrations = () =>
  api.get("/trips/me/registrations");

export const getTripRegistrations = (tripUuid: string) =>
  api.get(`/trips/${tripUuid}/registrations`);