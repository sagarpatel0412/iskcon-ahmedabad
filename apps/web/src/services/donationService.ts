import { api } from "../api/client";

export const createDonationOrder = (data: any) =>
  api.post("/donations/create-order", data);

export const verifyDonation = (data: any) =>
  api.post("/donations/verify", data);

export const myDonations = () =>
  api.get("/donations/my-donations");