import axiosInstance from "./axios";

export const getStatistics = async (): Promise<{
  unread_conversations: number;
  pending_meetings: number;
}> => {
  const res = await axiosInstance.get("/statistics/unread");
  return res.data;
};
