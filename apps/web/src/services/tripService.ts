import { api } from "../api/client";

export const getTrips = () => api.get("/trips");

export const getTripByUuid = (uuid: string) => api.get(`/trips/${uuid}`);

export const createTrip = (payload: any) => api.post("/trips", payload);

export const registerTrip = (tripUuid: string, payload: any) =>
  api.post(`/trips/${tripUuid}/register`, payload);

export const verifyTripPayment = (payload: any) =>
  api.post("/trips/verify-payment", payload);

export const getMyTripRegistrations = () =>
  api.get("/trips/me/registrations");

export const getTripRegistrations = (tripUuid: string) =>
  api.get(`/trips/${tripUuid}/registrations`);

export const updateTrip = (tripUuid: string, payload: any) =>
  api.patch(`/trips/${tripUuid}`, payload);

export const getMyCreatedTrips = () =>
  api.get("/trips/me/created");