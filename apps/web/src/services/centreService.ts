import { api } from "../api/client";

export const getCentres = () => api.get("/centres");