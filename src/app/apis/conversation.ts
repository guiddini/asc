import axiosInstance from "./axios";
import {
  CreateConversationRequest,
  CreateConversationResponse,
  ShowConversationResponse,
  DeleteConversationResponse,
  SendMessageRequest,
  MessagesPage,
  ConversationsPage,
  MarkMessageAsReadResponse,
  DeleteMessageResponse,
  GetUserConversationsRequest,
  GetMessagesRequest,
  Message,
} from "../types/conversation";

export const createConversation = async (
  payload: CreateConversationRequest
): Promise<CreateConversationResponse> => {
  const res = await axiosInstance.post("/conversations", payload);
  return res?.data;
};

export const getUserConversations = async (
  params?: GetUserConversationsRequest
): Promise<ConversationsPage> => {
  const res = await axiosInstance.get("/conversations", { params });
  return res?.data;
};

export const getConversation = async (
  id: string
): Promise<ShowConversationResponse> => {
  const res = await axiosInstance.get(`/conversations/${id}`);
  return res?.data;
};

export const deleteConversation = async (
  id: string
): Promise<DeleteConversationResponse> => {
  const res = await axiosInstance.delete(`/conversations/${id}`);
  return res?.data;
};

export const sendMessage = async (
  conversationId: string,
  payload: SendMessageRequest
): Promise<Message> => {
  if (payload.file) {
    const form = new FormData();
    form.append("file", payload.file);
    if (payload.content) form.append("content", payload.content);
    const res = await axiosInstance.post(
      `/conversations/${conversationId}/messages`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res?.data;
  } else {
    const res = await axiosInstance.post(
      `/conversations/${conversationId}/messages`,
      { content: payload.content ?? "" }
    );
    return res?.data;
  }
};

export const getMessages = async (
  conversationId: string,
  params?: GetMessagesRequest
): Promise<MessagesPage> => {
  const res = await axiosInstance.get(
    `/conversations/${conversationId}/messages`,
    { params }
  );
  return res?.data;
};

export const markMessageAsRead = async (
  messageId: string
): Promise<MarkMessageAsReadResponse> => {
  const res = await axiosInstance.post(`/messages/${messageId}/read`);
  return res?.data;
};

export const deleteMessage = async (
  messageId: string
): Promise<DeleteMessageResponse> => {
  const res = await axiosInstance.delete(`/messages/${messageId}`);
  return res?.data;
};
