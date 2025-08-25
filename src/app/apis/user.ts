import axios from "axios";
import axiosInstance from "./axios";
import { getAuth } from "../modules/auth";

const userAuth = getAuth();

const getAllUsersApi = async ({
  is_registered,
  nameFilter,
  offset,
  roleFilter,
}: {
  nameFilter?: string;
  roleFilter?: string;
  is_registered?: string | number;
  offset: string | number;
}) => {
  return await axiosInstance.post(`/user/all/filter`, {
    nameFilter,
    roleFilter,
    offset,
    is_registered,
  });
};

const getAllParticipantsApi = async ({
  offset,
}: {
  offset: number | string;
}) => {
  return await axiosInstance.get(`/user/participants/${offset}`);
};

const filterParticipantsApi = async ({
  nameFilter,
  roleFilter,
  offset,
}: {
  roleFilter?: string;
  nameFilter?: string;
  offset: number | string;
}) => {
  const formdata = new FormData();
  roleFilter?.length > 0 && formdata.append("roleFilter", roleFilter);
  nameFilter?.length > 0 && formdata.append("nameFilter", nameFilter);
  formdata.append("offset", String(offset));
  return await axiosInstance.post(`/user/participants/filter`, formdata);
};

const createUserApi = async (data: any) => {
  return await axiosInstance.post("/user/create/v2", data);
};

const updateUserApi = async (data: FormData) => {
  return await axiosInstance.post(`/user/update`, data);
};

const getUserQRCodeApi = async (user_id: string) => {
  return await axiosInstance.get(`/user/get/qrcode/${user_id}`);
};

const getUserBadgeApi = async () => {
  return await axios.get(
    `${import.meta.env.VITE_APP_HTTP_API_URL}/ticket/badge`,
    {
      headers: {
        Authorization: `Bearer ${userAuth}`,
      },
      // responseType: "blob",
    }
  );
};

const resendEmailToUserApi = async (email: string) => {
  return await axiosInstance.post(`/user/create/email/resend`, {
    email: email,
  });
};

const SuggestionsApi = async ({
  offset,
  user_id,
}: {
  user_id: string;
  offset: number | string;
}) => {
  return await axiosInstance.post(`/user/suggestions`, {
    user_id: user_id,
    offset: offset,
  });
};

const checkUserEmailExists = async (email: string) => {
  return await axiosInstance.post(`/email/exists`, {
    email: email,
  });
};

const updateUserFnameApi = async ({
  fname,
  lname,
}: {
  fname: string;
  lname: string;
}) =>
  await axiosInstance.post("/user/update/name", {
    fname,
    lname,
  });

const updateUserLogo = async (data: FormData) =>
  await axiosInstance.post("/user/update/logo", data);
export {
  getAllUsersApi,
  createUserApi,
  updateUserApi,
  getAllParticipantsApi,
  getUserQRCodeApi,
  getUserBadgeApi,
  resendEmailToUserApi,
  filterParticipantsApi,
  SuggestionsApi,
  checkUserEmailExists,
  updateUserFnameApi,
  updateUserLogo,
};
