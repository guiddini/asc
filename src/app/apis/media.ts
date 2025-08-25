import axiosInstance from "./axios";

const findMediaApi = (id: string) => {
  return axiosInstance.get(`/media/find/${id}`);
};

const deleteMediaApi = (id: string) => {
  return axiosInstance.get(`/media/delete/${id}`);
};

export { findMediaApi, deleteMediaApi };
