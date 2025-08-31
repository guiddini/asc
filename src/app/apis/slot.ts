import axiosInstance from "./axios";

export const checkSlot = async (data: {
  receiver_id: string;
  start_time: string;
  end_time: string;
}) => {
  const response = await axiosInstance.post("/slot/check", data);
  return response?.data;
};

export const getBookedUserSlot = async (receiver_id: string) => {
  const response = await axiosInstance.get(`/slot/user/${receiver_id}`);
  return response?.data;
};

export const getMyBookedSlot = async () => {
  const response = await axiosInstance.get("/slot/my");
  return response?.data;
};

export const getAllBookedSlots = async () => {
  const response = await axiosInstance.get("/slot/all");
  return response?.data;
};
