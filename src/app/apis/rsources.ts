import axiosInstance from "./axios";

const getCountriesApi = async () => {
  return await axiosInstance.get("/countries/all");
};

const getWillayasApi = async () => {
  return await axiosInstance.get("/wilayas");
};

const getCommunesApi = async (willaya_id: number | string) => {
  return await axiosInstance.get(`/wilayas/${willaya_id}/communes`);
};

const getAllUniversitiesApi = async () => {
  return axiosInstance.get(`/university/all`);
};

// occupations
const getAllOccupationsApi = async () => {
  return axiosInstance.get(`/occupation/all`);
};

const createOccupationApi = async (data: {
  label_fr: string;
  label_en: string;
}) => {
  return axiosInstance.post(`/occupation/create`, data);
};

const updateOccupationApi = async (data: {
  label_fr: string;
  label_en: string;
  occupation_id: string;
}) => {
  return axiosInstance.post(`/occupation/update`, data);
};

// activities

const getAllActivitiesApi = async () => {
  return await axiosInstance.get(`/activity/all`);
};

const createActivityApi = async (data: {
  label_fr: string;
  label_en: string;
}) => {
  return axiosInstance.post(`/activityarea/create`, data);
};

const updateActivityApi = async (data: {
  label_fr: string;
  label_en: string;
  activity_area_id: string;
}) => {
  return axiosInstance.post(`/activityarea/update`, data);
};

export {
  getWillayasApi,
  getCommunesApi,
  getCountriesApi,
  getAllOccupationsApi,
  getAllActivitiesApi,
  getAllUniversitiesApi,
  createOccupationApi,
  updateOccupationApi,
  createActivityApi,
  updateActivityApi,
};
