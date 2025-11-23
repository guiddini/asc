import axiosInstance from "./axios";
import {
  PitchDeckWithRelations,
  PitchDeckListResponse,
  PitchDeckStatusResponse,
  ShowPitchDeckResponse,
  MyPitchDeckResponse,
  UploadPitchDeckPayload,
  ListPitchDeckFilters,
  AcceptedPitchDeckFilters,
} from "../types/pitch-deck";

export const getPitchDecks = async (
  params?: ListPitchDeckFilters
): Promise<PitchDeckListResponse> => {
  const res = await axiosInstance.get("/pitch-decks", { params });
  return res.data;
};

export const getAcceptedPitchDecks = async (
  params?: AcceptedPitchDeckFilters
): Promise<PitchDeckWithRelations[]> => {
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
  payload: UploadPitchDeckPayload
): Promise<PitchDeckWithRelations> => {
  const form = new FormData();
  form.append("pitch", file);
  form.append("title", String(payload.title));
  form.append("phone", String(payload.phone));
  form.append("country", String(payload.country));
  form.append("founder_linkedin", String(payload.founder_linkedin));
  form.append("year_of_creation", String(payload.year_of_creation));
  form.append("project_description", String(payload.project_description));
  form.append("maturity_level", String(payload.maturity_level));
  form.append("revenue_2024", String(payload.revenue_2024));
  form.append("users_count", String(payload.users_count));
  form.append("employees_count", String(payload.employees_count));
  form.append("investment_category", String(payload.investment_category));
  form.append("requested_amount_usd", String(payload.requested_amount_usd));
  payload.website_links.forEach((u) => form.append("website_links[]", u));
  payload.activity_sectors.forEach((s) => form.append("activity_sectors[]", s));

  const res = await axiosInstance.post("/pitch-decks", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updatePitchDeck = async (
  id: string,
  payload: {
    file?: File;
    title?: string;
    phone?: string;
    country?: number;
    founder_linkedin?: string;
    year_of_creation?: number;
    website_links?: string[];
    activity_sectors?: string[];
    project_description?: string;
    maturity_level?: string;
    revenue_2024?: number;
    users_count?: number;
    employees_count?: number;
    investment_category?: string;
    requested_amount_usd?: number;
  }
): Promise<PitchDeckWithRelations> => {
  const form = new FormData();
  if (payload.file) form.append("pitch", payload.file);
  if (payload.title !== undefined) form.append("title", String(payload.title));
  if (payload.phone !== undefined) form.append("phone", String(payload.phone));
  if (payload.country !== undefined && payload.country !== null)
    form.append("country", String(payload.country));
  if (payload.founder_linkedin !== undefined)
    form.append("founder_linkedin", String(payload.founder_linkedin));
  if (
    payload.year_of_creation !== undefined &&
    payload.year_of_creation !== null
  )
    form.append("year_of_creation", String(payload.year_of_creation));
  if (payload.project_description !== undefined)
    form.append(
      "project_description",
      String(payload.project_description ?? "")
    );
  if (payload.maturity_level !== undefined)
    form.append("maturity_level", String(payload.maturity_level ?? ""));
  if (payload.revenue_2024 !== undefined && payload.revenue_2024 !== null)
    form.append("revenue_2024", String(payload.revenue_2024));
  if (payload.users_count !== undefined && payload.users_count !== null)
    form.append("users_count", String(payload.users_count));
  if (payload.employees_count !== undefined && payload.employees_count !== null)
    form.append("employees_count", String(payload.employees_count));
  if (payload.investment_category !== undefined)
    form.append(
      "investment_category",
      String(payload.investment_category ?? "")
    );
  if (
    payload.requested_amount_usd !== undefined &&
    payload.requested_amount_usd !== null
  )
    form.append("requested_amount_usd", String(payload.requested_amount_usd));
  if (payload.website_links !== undefined)
    (payload.website_links ?? []).forEach((u) =>
      form.append("website_links[]", u)
    );
  if (payload.activity_sectors !== undefined)
    (payload.activity_sectors ?? []).forEach((s) =>
      form.append("activity_sectors[]", s)
    );

  const res = await axiosInstance.put(`/pitch-decks/${id}`, form, {
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
