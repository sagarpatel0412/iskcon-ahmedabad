// src/services/contentService.ts

import { api } from "../api/client";

export const getPosts = (params?: any) =>
  api.get("/content/posts", { params });

export const getPost = (uuid: string) =>
  api.get(`/content/posts/${uuid}`);

export const getAuthorPost = (uuid: string) =>
  api.get(`/content/posts/author/${uuid}`);

export const createPost = (data: any) =>
  api.post("/content/posts", data);

export const updatePost = (uuid: string, data: any) =>
  api.patch(`/content/posts/${uuid}`, data);

export const deletePost = (uuid: string) =>
  api.delete(`/content/posts/${uuid}`);

export const getMyPosts = () =>
  api.get("/content/my-posts");

export const getCategories = () =>
  api.get("/content/categories");

export const createCategory = (data: any) =>
  api.post("/content/categories", data);

export const getRecommendedContent = () =>
  api.get('/content/recommended');

export const getProgressLevels = () =>
  api.get('/daily-progress/levels');