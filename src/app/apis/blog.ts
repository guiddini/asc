import { BlogSearchParams } from "../pages/blogs/types/blog";
import axiosInstance from "./axios";

export const searchBlogs = async ({ title }: BlogSearchParams) => {
  const response = await axiosInstance.post("/blog/search", {
    title,
  });

  return response.data;
};
