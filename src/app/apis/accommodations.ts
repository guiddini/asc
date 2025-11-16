import axiosInstance from "./axios";
import {
  AccommodationsResponse,
  CompanionAccommodationsResponse,
  CreateAccommodationRequest,
  ShowAccommodationResponse,
  ShowCompanionAccommodationResponse,
  UpdateAccommodationRequest,
  UserAccommodationsResponse,
} from "../types/accommodation";

export type GetAllAccommodationsParams = {
  hotel_id?: string;
  guest_id?: string;
  companion_id?: string;
};

export const getAllAccommodations = async (
  params?: GetAllAccommodationsParams
): Promise<AccommodationsResponse> => {
  const res = await axiosInstance.get("/accommodations", { params });
  return res.data;
};

export const createAccommodation = async (
  payload: CreateAccommodationRequest
): Promise<ShowAccommodationResponse> => {
  const res = await axiosInstance.post("/accommodations", payload);
  return res?.data;
};

export const showAccommodation = async (
  id: string
): Promise<ShowAccommodationResponse> => {
  const res = await axiosInstance.get(`/accommodations/${id}`);
  return res?.data;
};

export const updateAccommodation = async (
  id: string,
  payload: UpdateAccommodationRequest
): Promise<ShowAccommodationResponse> => {
  const res = await axiosInstance.post(`/accommodations/${id}`, payload);
  return res?.data;
};

export const deleteAccommodation = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/accommodations/${id}`);
};

export const getGuestAccommodations = async (
  userId: string
): Promise<UserAccommodationsResponse> => {
  const res = await axiosInstance.get(`/accommodations/guest/${userId}`);
  return res.data;
};

export const getCompanionAccommodations = async (
  userId: string
): Promise<CompanionAccommodationsResponse> => {
  const res = await axiosInstance.get(`/accommodations/companion/${userId}`);
  return res.data;
};

export const showCompanionAccommodation = async (
  userId: string,
  id: string
): Promise<ShowCompanionAccommodationResponse> => {
  const res = await axiosInstance.get(
    `/accommodations/companion/${userId}/${id}`
  );
  return res.data;
};
