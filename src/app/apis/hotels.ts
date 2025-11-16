import axiosInstance from "./axios";
import { HotelsResponse, ShowHotelResponse } from "../types/hotel";

export const getAllHotels = async (
  search?: string
): Promise<HotelsResponse> => {
  const res = await axiosInstance.get("/hotels", {
    params: search ? { search } : {},
  });
  return res.data;
};

export const createHotel = async (
  formData: FormData
): Promise<ShowHotelResponse> => {
  const res = await axiosInstance.post("/hotels", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res?.data;
};

export const showHotel = async (
  hotelId: string
): Promise<ShowHotelResponse> => {
  const res = await axiosInstance.get(`/hotels/${hotelId}`);
  return res?.data;
};

export const updateHotel = async (
  hotelId: string,
  formData: FormData
): Promise<ShowHotelResponse> => {
  const res = await axiosInstance.post(`/hotels/${hotelId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res?.data;
};

export const deleteHotel = async (hotelId: string) => {
  return await axiosInstance.delete(`/hotels/${hotelId}`);
};
