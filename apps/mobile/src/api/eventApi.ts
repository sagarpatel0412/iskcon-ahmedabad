import { api } from "./client";
import { getToken } from "../storage/authStorage";

const authHeaders = async () => {
  const token = await getToken();

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const createEvent = async (payload: any) => {
  const headers = await authHeaders();

  return api.post("/events", payload, { headers });
};

export const getMyEvents = async () => {
  const headers = await authHeaders();

  return api.get("/events/my-events", { headers });
};

export const createEventFormFields = async (
  eventUuid: string,
  fields: any[]
) => {
  const headers = await authHeaders();

  return api.post(
    `/events/${eventUuid}/form-fields`,
    { fields },
    { headers }
  );
};

export const getEventByUuid = async (eventUuid: string) => {
  const headers = await authHeaders();
  return api.get(`/events/${eventUuid}`, { headers });
};

export const getEventFormFields = async (eventUuid: string) => {
  const headers = await authHeaders();
  return api.get(`/events/${eventUuid}/form-fields`, { headers });
};

// export const createEventFormFields = async (eventUuid: string, fields: any[]) => {
//   const headers = await authHeaders();
//   return api.post(`/events/${eventUuid}/form-fields`, { fields }, { headers });
// };

export const deleteEventFormField = async (fieldUuid: string) => {
  const headers = await authHeaders();
  return api.delete(`/events/form-fields/${fieldUuid}`, { headers });
};

export const updateEvent = async (eventUuid: string, payload: any) => {
  const headers = await authHeaders();
  return api.patch(`/events/${eventUuid}`, payload, { headers });
};

export const deleteEvent = async (eventUuid: string) => {
  const headers = await authHeaders();
  return api.delete(`/events/${eventUuid}`, { headers });
};

export const uploadEventPoster = async (eventUuid: string, image: any) => {
  const tokenHeaders = await authHeaders();

  const formData = new FormData();

  formData.append("poster", {
    uri: image.uri,
    name: image.fileName || `poster-${Date.now()}.jpg`,
    type: image.mimeType || "image/jpeg",
  } as any);

  return api.post(`/events/${eventUuid}/poster`, formData, {
    headers: {
      ...tokenHeaders,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const createEventFormFieldsBulk = async (
  eventUuid: string,
  fields: any[]
) => {
  const headers = await authHeaders();

  return api.post(
    `/events/${eventUuid}/form-fields/bulk`,
    { fields },
    { headers }
  );
};

export const getPublicEvents = async () => {
  const headers = await authHeaders();
  return api.get("/events", { headers });
};

export const registerForEvent = async (
  eventUuid: string,
  formAnswers: any
) => {
  const headers = await authHeaders();

  return api.post(
    `/events/${eventUuid}/register`,
    {
      form_answers: formAnswers,
    },
    { headers }
  );
};

export const getMyRegistrations = async () => {
  const headers = await authHeaders();
  return api.get("/events/my-registrations", { headers });
};

export const scanEventQr = async (payload: { qr_token: string }) => {
  const headers = await authHeaders();
  return api.post("/events/scan-qr", payload, { headers });
};

export const getEventRegistrations = async (uuid: string) =>{
  const headers = await authHeaders();
  return api.get(`/events/${uuid}/registrations`,{ headers });
}