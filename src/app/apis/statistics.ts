import { AdminStatsResponse } from "../types/statistics";
import axiosInstance from "./axios";

export const getStatistics = async (): Promise<{
  unread_conversations: number;
  pending_meetings: number;
}> => {
  const res = await axiosInstance.get("/statistics/unread");
  return res.data;
};

export const getAdminStats = async (): Promise<AdminStatsResponse> => {
  const res = await axiosInstance.get("/statistics/admin");
  return res?.data;
};
