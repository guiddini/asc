import axiosInstance from "./axios";
import {
  SendFcmRequest,
  SendFcmResponse,
  FcmUsersWithTokensResponse,
} from "../types/fcm";

export const getUsersWithFcmTokens = async (params?: {
  per_page?: number;
  page?: number;
  roles?: string[];
  role_id?: number;
  role_ids?: number[];
}): Promise<FcmUsersWithTokensResponse> => {
  const res = await axiosInstance.get("/fcm/users-with-tokens", { params });
  return res.data;
};

export const sendFcmToUsers = async (
  payload: SendFcmRequest
): Promise<SendFcmResponse> => {
  const res = await axiosInstance.post("/fcm/send", payload);
  return res.data;
};
