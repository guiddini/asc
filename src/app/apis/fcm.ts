import axiosInstance from "./axios";
import {
  FcmUsersWithTokensResponse,
  SendFcmRequest,
  SendFcmResponse,
} from "../types/fcm";

export const getUsersWithFcmTokens = async (params?: {
  per_page?: number;
  page?: number;
}): Promise<FcmUsersWithTokensResponse> => {
  const res = await axiosInstance.get("/fcm/users-with-tokens", { params });
  return res?.data;
};

export const sendFcmToUsers = async (
  payload: SendFcmRequest
): Promise<SendFcmResponse> => {
  const res = await axiosInstance.post("/fcm/send", payload);
  return res?.data;
};
