import { Meeting, MeetingDetail } from "../types/meetings";
import axiosInstance from "./axios";

export const getUserMeetings = async (): Promise<Meeting[]> => {
  const response = await axiosInstance.get("/meeting/index");
  return response.data;
};

export const showOneMeeting = async (id: string): Promise<MeetingDetail> => {
  const response = await axiosInstance.get(`/meeting/show/${id}`);
  return response.data;
};

export const createMeeting = async (data: {
  receiver_id: string;
  topic: string;
  start_time: string;
  end_time: string;
  location: string;
}) => {
  const response = await axiosInstance.post("/meeting/create", data);
  return response.data;
};

export const updateMeeting = async (data: {
  id: string;
  meeting_date?: string;
  location?: string;
}) => {
  const response = await axiosInstance.post("/meeting/update", data);
  return response.data;
};

export const deleteMeeting = async (id: string) => {
  const response = await axiosInstance.post(`/meeting/delete`, {
    meeting_id: id,
  });
  return response.data;
};

export const respondToMeeting = async (data: {
  id: string;
  status: "accepted" | "declined";
}) => {
  const response = await axiosInstance.post("/meeting/respond", data);
  return response.data;
};
