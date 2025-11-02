import axiosInstance from "./axios";
import type {
  Slot,
  SlotCheckRequest,
  SlotCheckResponse,
  PublicSlot,
  PublicSlotType,
} from "../types/slot";

export const checkSlot = async (
  data: SlotCheckRequest
): Promise<SlotCheckResponse> => {
  const response = await axiosInstance.post("/slot/check", data);
  return response.data;
};

export const getBookedUserSlot = async (
  receiver_id: string
): Promise<Slot[]> => {
  const response = await axiosInstance.get(`/slot/user/${receiver_id}`);
  return response.data;
};

export const getMyBookedSlot = async (): Promise<Slot[]> => {
  const response = await axiosInstance.get("/slot/my");
  return response.data;
};

export const getAllBookedSlots = async (): Promise<Slot[]> => {
  const response = await axiosInstance.get("/slot/all");
  return response.data;
};

export const getPublicProgramSchedule = async (
  type?: PublicSlotType,
  start_date?: string
): Promise<PublicSlot[]> => {
  const params: Record<string, string> = {};
  if (type) params.type = type;
  if (start_date) params.start_date = start_date;

  const response = await axiosInstance.get("/public/program/schedule", {
    params,
  });
  return response.data;
};
