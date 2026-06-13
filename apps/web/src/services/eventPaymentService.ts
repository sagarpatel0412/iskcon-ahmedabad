import { api } from "../api/client";

export const createEventPaymentOrder = (eventUuid: string) =>
  api.post(`/event-payments/create-order`, {
    event_uuid: eventUuid,
  });

export const verifyEventPayment = (payload: any) =>
  api.post(`/event-payments/verify`, payload);