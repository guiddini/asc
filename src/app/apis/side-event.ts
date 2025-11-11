import {
  CreateSideEventRequest,
  ShowSideEventResponse,
  SideEventsResponse,
  ProgramEvent,
  Workshop,
  Conference,
  PublicScheduleItem,
  SideEventAttendee,
} from "../types/side-event";
import axiosInstance from "./axios";

export const getAllSideEvents = async (): Promise<SideEventsResponse> => {
  const res = await axiosInstance.get("/side-events");
  return res.data;
};

export const getPublishedSideEvents = async (): Promise<SideEventsResponse> => {
  const res = await axiosInstance.get("/side-events/published");
  return res.data;
};

export const getPublicSideEvents = async (): Promise<SideEventsResponse> => {
  const res = await axiosInstance.get("/public/side-events");
  return res.data;
};

export const showSideEventBySlug = async (
  slug: string
): Promise<ShowSideEventResponse> => {
  const res = await axiosInstance.get(`/public/side-events/${slug}`);
  return res.data;
};

export const showSideEventById = async (
  id: string
): Promise<ShowSideEventResponse> => {
  const res = await axiosInstance.get(`/side-events/show/${id}`);
  return res.data;
};

export const createSideEvent = async (data: CreateSideEventRequest) => {
  const form = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (Array.isArray(v)) v.forEach((f) => form.append(`${k}[]`, f));
    else if (v !== undefined) form.append(k, v);
  });
  const res = await axiosInstance.post("/side-events", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateSideEvent = async (
  id: string,
  data: CreateSideEventRequest
) => {
  const form = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (Array.isArray(v)) v.forEach((f) => form.append(`${k}[]`, f));
    else if (v !== undefined) form.append(k, v);
  });

  const res = await axiosInstance.post(`/side-events/update/${id}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteSideEvent = async (id: string) => {
  const res = await axiosInstance.delete(`/side-events/delete/${id}`);
  return res.data;
};

// New APIs
export const getProgramEventsBySideEvent = async (
  id: string
): Promise<ProgramEvent[]> => {
  const res = await axiosInstance.get(`/side-events/program-events/${id}`);
  return res.data;
};

export const getWorkshopsBySideEvent = async (
  id: string
): Promise<Workshop[]> => {
  const res = await axiosInstance.get(`/side-events/workshops/${id}`);
  return res.data;
};

export const getConferencesBySideEvent = async (
  id: string
): Promise<Conference[]> => {
  const res = await axiosInstance.get(`/side-events/conferences/${id}`);
  return res.data;
};

export const getPublicSchedule = async (params?: {
  type?: string;
  start_date?: string;
}): Promise<PublicScheduleItem[]> => {
  const res = await axiosInstance.get("/public/side-events/public-schedule", {
    params,
  });
  return res.data;
};

export const checkIfUserJoinedSideEvent = async (
  id: string
): Promise<{ joined: boolean }> => {
  const res = await axiosInstance.get(`/side-events/${id}/is-joined`);
  return res.data;
};

export const joinSideEvent = async (id: string) => {
  const res = await axiosInstance.post(`/side-events/${id}/join`);
  return res.data;
};

export const leaveSideEvent = async (id: string) => {
  const res = await axiosInstance.post(`/side-events/${id}/leave`);
  return res.data;
};

export const getSideEventAttendees = async (
  id: string
): Promise<SideEventAttendee[]> => {
  const res = await axiosInstance.get(`/side-events/${id}/attendees`);
  return res.data;
};
