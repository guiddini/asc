import { BlogSearchParams } from "../pages/blogs/types/blog";
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
  const response = await axiosInstance.get(`/blog/${id}`);
  return response.data;
};

export const getBlogBySlug = async (slug: string) => {
  const response = await axiosInstance.get(`/blog/slug/${slug}`);
  return response.data;
};
