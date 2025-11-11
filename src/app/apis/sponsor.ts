import {
  SponsorResponse,
  SponsorsResponse,
  CreateSponsorRequest,
  SponsorFilter,
} from "../types/sponsor";
import axiosInstance from "./axios";

export const getAllSponsors = async (
  filter?: SponsorFilter
): Promise<SponsorsResponse> => {
  const res = await axiosInstance.get("/sponsors", { params: filter });
  return res.data;
};

export const getPublicSponsors = async (
  filter?: SponsorFilter
): Promise<SponsorsResponse> => {
  const res = await axiosInstance.get("/public/sponsors", { params: filter });
  return res.data;
};

export const showSponsorById = async (id: string): Promise<SponsorResponse> => {
  const res = await axiosInstance.get(`/sponsors/${id}`);
  return res.data;
};

export const createSponsor = async (data: CreateSponsorRequest) => {
  const res = await axiosInstance.post("/sponsors", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateSponsor = async (id: string, data: CreateSponsorRequest) => {
  const res = await axiosInstance.post(`/sponsors/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteSponsor = async (id: string) => {
  const res = await axiosInstance.delete(`/sponsors/${id}`);
  return res.data;
};
