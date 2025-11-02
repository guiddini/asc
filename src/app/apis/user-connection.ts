import type {
  UserConnection,
  UserConnectionStatus,
  PaginatedUserConnections,
  PendingConnectionsCount,
} from "../types/user-connection";
import axiosInstance from "./axios";

export const sendUserConnectionRequest = async (
  receiver_id: string
): Promise<{ message: string }> => {
  const res = await axiosInstance.post("/connections/send", { receiver_id });
  return res.data;
};

export const acceptUserConnectionRequest = async (
  id: string
): Promise<{ message: string }> => {
  const res = await axiosInstance.post(`/connections/${id}/accept`);
  return res.data;
};

export const declineUserConnectionRequest = async (
  id: string
): Promise<{ message: string }> => {
  const res = await axiosInstance.post(`/connections/${id}/decline`);
  return res.data;
};

export const getMyUserConnections = async (
  page = 1,
  per_page = 10
): Promise<PaginatedUserConnections> => {
  const res = await axiosInstance.get("/connections", {
    params: { page, per_page },
  });
  return res.data;
};

export const getPendingUserConnections = async (
  page = 1,
  per_page = 10
): Promise<PaginatedUserConnections> => {
  const res = await axiosInstance.get("/connections/pending", {
    params: { page, per_page },
  });
  return res.data;
};

export const checkUserConnectionStatus = async (
  user_id: string
): Promise<{ status: UserConnectionStatus }> => {
  const res = await axiosInstance.get(`/connections/check/${user_id}`);
  return res.data;
};

export const getPendingUserConnectionsCount =
  async (): Promise<PendingConnectionsCount> => {
    const res = await axiosInstance.get("/connections/pending/count");
    return res.data;
  };
