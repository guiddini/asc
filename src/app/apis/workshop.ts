import {
  WorkshopsResponse,
  CreateWorkshopRequest,
  ShowWorkshopResponse,
} from "../types/workshop";
import axiosInstance from "./axios";

export const getAllWorkshops = async (): Promise<WorkshopsResponse> => {
  const res = await axiosInstance.get("/workshop/index");
  return res?.data;
};

export const getAllPublishedWorkshops = async (): Promise<WorkshopsResponse> => {
  const res = await axiosInstance.get("/workshops/published");
  return res.data;
};

export const showWorkshopById = async (
  workshop_id: string
): Promise<ShowWorkshopResponse> => {
  const res = await axiosInstance.get(`/workshop/show/${workshop_id}`);
  return res?.data;
};

export const createWorkshop = async (data: CreateWorkshopRequest) => {
  const res = await axiosInstance.post("/workshop/create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateWorkshop = async (
  workshop_id: string,
  data: CreateWorkshopRequest
) => {
  const res = await axiosInstance.post(
    `/workshop/update/${workshop_id}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};

export const deleteWorkshop = async (workshop_id: string) => {
  const res = await axiosInstance.post(`/workshop/delete/${workshop_id}`);
  return res.data;
};

export const cancelWorkshop = async (workshop_id: string) => {
  const res = await axiosInstance.post(`/workshop/cancel/${workshop_id}`);
  return res.data;
};

export const addSpeakerToWorkshop = async (
  workshop_id: string,
  user_id: string
) => {
  const res = await axiosInstance.post(`/workshop/add-speaker/${workshop_id}`, {
    user_id,
  });
  return res.data;
};

export const removeSpeakerFromWorkshop = async (
  workshop_id: string,
  user_id: string
) => {
  const res = await axiosInstance.post(
    `/workshop/remove-speaker/${workshop_id}`,
    { user_id }
  );
  return res.data;
};

export const joinWorkshop = async (workshop_id: string) => {
  const res = await axiosInstance.post(`/workshop/add-attendee/${workshop_id}`);
  return res.data;
};

export const leaveWorkshop = async (workshop_id: string) => {
  const res = await axiosInstance.post(
    `/workshop/remove-attendee/${workshop_id}`
  );
  return res.data;
};
