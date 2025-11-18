// src/api/pitch-deck.ts
import axiosInstance from "./axios";
import {
  PitchDeck,
  PitchDeckListResponse,
  PitchDeckStatusResponse,
  ShowPitchDeckResponse,
  MyPitchDeckResponse,
} from "../types/pitch-deck";

export const getPitchDecks = async (params?: {
  status?: "pending" | "accepted" | "refused";
  company_id?: string;
  search?: string;
  page?: number;
  per_page?: number;
}): Promise<PitchDeckListResponse> => {
  const res = await axiosInstance.get("/pitch-decks", { params });
  return res.data;
};

export const getAcceptedPitchDecks = async (params?: {
  company_id?: string;
  country_id?: string;
  search?: string;
}): Promise<PitchDeckListResponse> => {
  const res = await axiosInstance.get("/pitch-decks/accepted", { params });
  return res.data;
};

export const showPitchDeck = async (
  id: string
): Promise<ShowPitchDeckResponse> => {
  const res = await axiosInstance.get(`/pitch-decks/${id}`);
  return res.data;
};

export const downloadPitchDeck = async (id: string): Promise<Blob> => {
  const res = await axiosInstance.get(`/pitch-decks/${id}/download`, {
    responseType: "blob",
  });
  return res.data;
};

export const acceptPitchDeck = async (
  id: string
): Promise<{ status: "accepted" }> => {
  const res = await axiosInstance.post(`/pitch-decks/${id}/accept`);
  return res.data;
};

export const refusePitchDeck = async (
  id: string
): Promise<{ status: "refused" }> => {
  const res = await axiosInstance.post(`/pitch-decks/${id}/refuse`);
  return res.data;
};

export const uploadPitchDeck = async (
  file: File,
  opts?: { company_id?: string; title?: string }
): Promise<PitchDeck> => {
  const form = new FormData();
  form.append("pitch", file);
  if (opts?.company_id) form.append("company_id", opts.company_id);
  if (opts?.title) form.append("title", opts.title);
  const res = await axiosInstance.post("/pitch-decks", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getMyPitchDeck = async (): Promise<MyPitchDeckResponse> => {
  const res = await axiosInstance.get("/my-pitch-deck");
  return res.data;
};

export const getPitchDeckStatus =
  async (): Promise<PitchDeckStatusResponse> => {
    const res = await axiosInstance.get("/pitch-decks-status");
    return res.data;
  };

export const downloadMyPitchDeck = async (): Promise<Blob> => {
  const res = await axiosInstance.get("/download-my-pitch", {
    responseType: "blob",
  });
  return res.data;
};
