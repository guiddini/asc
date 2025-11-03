import { BlogSearchParams } from "../pages/media/types/blog";
import axiosInstance from "./axios";

export const searchBlogs = async ({ title }: BlogSearchParams) => {
  const response = await axiosInstance.post("/blog/search", {
    title,
  });

  return response.data;
};

export const createBlogApi = async (formData: FormData) => {
  const response = await axiosInstance.post("/blog/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateBlogApi = async (formData: FormData) => {
  const response = await axiosInstance.post("/blog/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteBlogApi = async (id: string) => {
  const response = await axiosInstance.post(`/blog/delete`, { id });
  return response.data;
};

export const getBlogById = async (id: string) => {
  const response = await axiosInstance.get(`/blog/show/${id}`);
  return response.data;
};

export const getBlogBySlug = async (slug: string) => {
  const response = await axiosInstance.get(`/blog/slug/${slug}`);
  return response.data;
};

export const getBlogComments = async (
  blog_id: string,
  offset?: string | number,
  limit?: string | number
) => {
  const response = await axiosInstance.get(
    `/blogs/${blog_id}/comments?offset=${offset ?? 0}&limit=${limit ?? 10}`
  );
  return response.data;
};

export const storeBlogComment = async (blog_id: string, content: string) => {
  const response = await axiosInstance.post(`/comment`, {
    commentable_type: "blog",
    commentable_id: blog_id,
    content,
  });
  return response.data;
};

export const updateBlogComment = async (
  comment_id: string,
  content: string
) => {
  const response = await axiosInstance.post(`/comment/update`, {
    comment_id,
    content,
  });
  return response.data;
};

export const deleteBlogComment = async (comment_id: string) => {
  const response = await axiosInstance.post(`/uncomment`, {
    comment_id,
  });
  return response.data;
};
