import { api } from "./client";

export const getContentPosts = (type: "journal" | "newsletter") => {
  return api.get("/content/posts", {
    params: { type },
  });
};

export const getContentPostByUuid = (uuid: string) => {
  return api.get(`/content/posts/${uuid}`);
};