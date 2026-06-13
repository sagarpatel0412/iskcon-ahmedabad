import { api } from "../api/client";

export const getEvents = () => api.get("/events");
export const getEvent = (uuid: string) => api.get(`/events/${uuid}`);
export const getMyEvents = () => api.get("/events/my-events");

export const createEvent = (data: any) => api.post("/events", data);
export const updateEvent = (uuid: string, data: any) =>
  api.patch(`/events/${uuid}`, data);
export const deleteEvent = (uuid: string) => api.delete(`/events/${uuid}`);

export const uploadEventPoster = (uuid: string, file: File) => {
  const formData = new FormData();
  formData.append("poster", file);
  return api.post(`/events/${uuid}/poster`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getEventFormFields = (uuid: string) =>
  api.get(`/events/${uuid}/form-fields`);

export const createEventFormFields = (uuid: string, fields: any[]) =>
  api.post(`/events/${uuid}/form-fields/bulk`, { fields });

export const updateEventFormField = (fieldUuid: string, data: any) =>
  api.patch(`/events/form-fields/${fieldUuid}`, data);

export const deleteEventFormField = (fieldUuid: string) =>
  api.delete(`/events/form-fields/${fieldUuid}`);

export const getEventRegistrations = (uuid: string) =>
  api.get(`/events/${uuid}/registrations`);

export const scanEventQr = (qr_token: string) =>
  api.post("/events/scan-qr", { qr_token });

export const registerForEvent = (uuid: string, data: any) =>
  api.post(`/events/${uuid}/register`, data);

export const getMyRegistrations = () =>
  api.get("/events/my-registrations");
