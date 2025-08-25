import axiosInstance from "./axios";

const regiterApi = async (data: FormData) =>
  await axiosInstance.post("/register", data);

const loginApi = async (data: { email: string; password: string }) => {
  return axiosInstance.post("/login", data);
};

const completeProfileApi = async (data: any) => {
  return axiosInstance.post(`/user/complete-profile`, data);
};

const logoutApi = async () => {
  return axiosInstance.post("/logout");
};

const getUserDataApi = async (id: string) => {
  return axiosInstance.get(`/user/profile/${id}`);
};

const getAuthenticatedUserDataApi = async () =>
  await axiosInstance.get("/user/me");

const resetUserPasswordApi = async (data: {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
  user_id: string;
}) => {
  return axiosInstance.post("/reset/password/v2", data);
};

const forgetPasswordApi = async (data: { email: string }) => {
  return await axiosInstance.post("/password/email", {
    email: data.email,
  });
};

const adminResetUserPasswordApi = async (data: {
  user_id: string;
  password: string;
  confirmation_password: string;
}) => axiosInstance.post("/reset/admin/password/v2", data);

export {
  loginApi,
  completeProfileApi,
  logoutApi,
  getUserDataApi,
  resetUserPasswordApi,
  forgetPasswordApi,
  regiterApi,
  getAuthenticatedUserDataApi,
  adminResetUserPasswordApi,
};
