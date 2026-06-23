import { api } from "../api/client";

export const getCourses = (params?: any) => {
  return api.get('/courses', { params });
};

export const getLatestCourses = () => {
  return api.get('/courses/latest');
};

export const getCourseByUuid = (uuid: string) =>
  api.get(`/courses/${uuid}`);

export const createCourse = (payload: any) =>
  api.post("/courses", payload);

export const updateCourse = (uuid: string, payload: any) =>
  api.patch(`/courses/${uuid}`, payload);

export const registerCourse = (uuid: string, payload: any) =>
  api.post(`/courses/${uuid}/register`, payload);

export const verifyCoursePayment = (payload: any) =>
  api.post("/courses/verify-payment", payload);

export const getMyCreatedCourses = () =>
  api.get("/courses/me/created");

export const getMyRegisteredCourses = () =>
  api.get("/courses/me/registered");

export const getCourseRegistrations = (uuid: string) =>
  api.get(`/courses/${uuid}/registrations`);

export const addUsersToCourse = (uuid: string, payload: any) =>
  api.post(`/courses/${uuid}/add-users`, payload);

export const refundCoursePayment = (paymentUuid: string, payload: any) =>
  api.post(`/courses/payments/${paymentUuid}/refund`, payload);

export const uploadCourseCoverImage = (uuid: string, file: File) => {
  const formData = new FormData();
  formData.append('cover_image', file);

  return api.post(`/courses/${uuid}/cover-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};