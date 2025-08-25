import axiosInstance from "./axios";

const getAllGuests = async () => {
  return axiosInstance.get("/guest/all");
};

const generateGuestCode = async () => {
  return axiosInstance.get("/guest/generate/code");
};

const createGuest = async (data: {
  fname: string;
  lname: string;
  code: string;
}) => {
  return axiosInstance.post("/guest/create", data);
};

const UpdateGuest = async (data: {
  fname: string;
  lname: string;
  code: string;
  ticket_name: string;
}) => {
  return axiosInstance.post(`/guest/update`, data);
};

const checkGuestCodeApi = async (code: string) => {
  return axiosInstance.post("/guest/check/code", code);
};

const handleGestStatus = async (data: any) => {
  return axiosInstance.post("/guest/handle/status", data);
};

export {
  getAllGuests,
  generateGuestCode,
  createGuest,
  UpdateGuest,
  checkGuestCodeApi,
  handleGestStatus,
};
