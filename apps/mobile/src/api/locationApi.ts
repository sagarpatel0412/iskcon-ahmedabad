import { api } from "./client";

export const getCountries = () => {
  return api.get("/location/countries");
};

export const getStates = (countryCode: string) => {
  return api.get(`/location/states/${countryCode}`);
};

export const getCities = (countryCode: string, stateCode: string) => {
  return api.get(`/location/cities/${countryCode}/${stateCode}`);
};