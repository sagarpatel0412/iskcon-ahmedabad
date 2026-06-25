import { api } from "../api/client";

export const getActivePromotionalBanner = (position = "all") => {
  return api.get("/promotional-banners/active", {
    params: { position },
  });
};

export const getPromotionalBanners = (params?: any) => {
  return api.get("/promotional-banners", { params });
};

export const getPromotionalBannerByUuid = (uuid: string) => {
  return api.get(`/promotional-banners/${uuid}`);
};

export const createPromotionalBanner = (payload: any) => {
  return api.post("/promotional-banners", payload);
};

export const updatePromotionalBanner = (uuid: string, payload: any) => {
  return api.patch(`/promotional-banners/${uuid}`, payload);
};

export const deletePromotionalBanner = (uuid: string) => {
  return api.delete(`/promotional-banners/${uuid}`);
};

export const uploadPromotionalBannerImage = (uuid: string, file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  return api.post(`/promotional-banners/${uuid}/image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};