import axiosInstance from "./axios";
import type { ProgramEvent, ProgramEventRequest } from "../types/program-event";

export const getAllProgramEvents = async (): Promise<ProgramEvent[]> => {
  const response = await axiosInstance.get("/program-events");
  return response.data;
};

export const getProgramEvent = async (id: string): Promise<ProgramEvent> => {
  const response = await axiosInstance.get(`/program-events/${id}`);
  return response.data;
};

export const createProgramEvent = async (
  data: ProgramEventRequest
): Promise<ProgramEvent> => {
  const response = await axiosInstance.post("/program-events", data);
  return response.data;
};

export const updateProgramEvent = async (
  id: string,
  data: ProgramEventRequest
): Promise<ProgramEvent> => {
  const response = await axiosInstance.post(`/program-events/${id}`, data);
  return response.data;
};

export const deleteProgramEvent = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/program-events/${id}`);
};
