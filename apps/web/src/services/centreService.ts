import { api } from "../api/client";

export const getCentres = () => api.get("/centres");

export const createCentre = (payload: any) => {
  return api.post("/meta-idx/centres", payload);
};

export const updateCentre = (id: number | string, payload: any) =>
  api.patch(`/meta-idx/centres/${id}`, payload);

export const deleteCentre = (id: number | string) =>
  api.delete(`/meta-idx/centres/${id}`);