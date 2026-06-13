import { api } from "../api/client";

export const getCountries = () => api.get("/location/countries");

export const getStates = (countryCode: string) =>
  api.get(`/location/states/${countryCode}`);

export const getCities = (countryCode: string, stateCode: string) =>
  api.get(`/location/cities/${countryCode}/${stateCode}`);