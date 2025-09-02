import {
  Conference,
  ConferencesResponse,
  CreateConferenceRequest,
  ShowConferenceResponse,
} from "../types/conference";
import axiosInstance from "./axios";

export const getAllConference = async (): Promise<ConferencesResponse> => {
  const res = await axiosInstance.get("/conference/index");
  return res?.data;
};

export const showConferenceById = async (
  conference_id: string
): Promise<ShowConferenceResponse> => {
  const res = await axiosInstance.get(`/conference/show/${conference_id}`);
  return res?.data;
};

export const createConference = async (data: CreateConferenceRequest) => {
  const res = await axiosInstance.post("/conference/create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateConference = async (
  conference_id: string,
  data: CreateConferenceRequest
) => {
  const res = await axiosInstance.post(
    `/conference/update/${conference_id}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};

export const deleteConference = async (conference_id: string) => {
  const res = await axiosInstance.delete(`/conference/delete/${conference_id}`);
  return res.data;
};

export const addSpeakerToConference = async (
  conference_id: string,
  user_id: string
) => {
  const res = await axiosInstance.post(
    `/conference/add-speaker/${conference_id}`,
    { user_id }
  );
  return res.data;
};

export const removeSpeakerFromConference = async (
  conference_id: string,
  user_id: string
) => {
  const res = await axiosInstance.post(
    `/conference/remove-speaker/${conference_id}`,
    { user_id }
  );
  return res.data;
};

export const addAttendeeToConference = async (
  conference_id: string,
  user_id: string
) => {
  const res = await axiosInstance.post(
    `/conference/add-attendee/${conference_id}`,
    { user_id }
  );
  return res.data;
};

export const removeAttendeeFromConference = async (
  conference_id: string,
  user_id: string
) => {
  const res = await axiosInstance.post(
    `/conference/remove-attendee/${conference_id}`,
    { user_id }
  );
  return res.data;
};
