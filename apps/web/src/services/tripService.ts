import { api } from "../api/client";

export const getTrips = (params?: any) => {
  return api.get('/trips', { params });
};

export const getLatestTrips = () => {
  return api.get('/trips/latest');
};

export const getTripByUuid = (uuid: string) => api.get(`/trips/${uuid}`);

export const createTrip = (payload: any) => api.post("/trips", payload);

export const registerTrip = (tripUuid: string, payload: any) =>
  api.post(`/trips/${tripUuid}/register`, payload);

export const verifyTripPayment = (payload: any) =>
  api.post("/trips/verify-payment", payload);

export const getMyTripRegistrations = () => api.get("/trips/me/registrations");

export const getTripRegistrations = (tripUuid: string) =>
  api.get(`/trips/${tripUuid}/registrations`);

export const updateTrip = (tripUuid: string, payload: any) =>
  api.patch(`/trips/${tripUuid}`, payload);

export const getMyCreatedTrips = () => api.get("/trips/me/created");

export const uploadTripCoverImage = (uuid: string, file: File) => {
  const formData = new FormData();
  formData.append("cover_image", file);

  return api.post(`/trips/${uuid}/cover-image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
