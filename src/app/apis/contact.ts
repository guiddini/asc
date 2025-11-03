import axiosInstance from "./axios";
import {
  ContactRequest,
  ContactRequestPayload,
  PaginatedContactResponse,
} from "../types/contact";

export const getContactRequests = async (params?: {
  type?: "contact" | "sponsor";
  search?: string;
  page?: number;
  per_page?: number;
}): Promise<PaginatedContactResponse> => {
  const res = await axiosInstance.get("/contact-requests", { params });
  return res.data;
};

export const createContactRequest = async (
  data: ContactRequestPayload
): Promise<ContactRequest> => {
  const res = await axiosInstance.post("/contact-requests", data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};
