import axiosInstance from "./axios";

export type SpeakersResponse = {
  current_page: number;
  data: {
    id: string;
    fname: string;
    lname: string;
    avatar: string | null;
  }[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
};

export type SpeakerConference = {
  id: string;
  title: string;
  description: string;
  date: string;
};

export type Speaker = {
  id: string;
  fname: string;
  lname: string;
  avatar: string;
  conferences: SpeakerConference[];
};

export const getAllSpeakers = async (page = 1): Promise<SpeakersResponse> => {
  const response = await axiosInstance.get("/speakers", {
    params: {
      page,
    },
  });
  return response?.data;
};

export const showOneSpeaker = async (id: string): Promise<Speaker> => {
  const response = await axiosInstance.get(`/speaker/${id}`);
  return response.data;
};
