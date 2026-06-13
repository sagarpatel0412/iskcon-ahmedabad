import { api } from "../api/client";

export const submitContactMessage = (data: any) =>
  api.post("/support/contact", data);

export const submitProblemReport = (data: any) =>
  api.post("/support/report-problem", data);