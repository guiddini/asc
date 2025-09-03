import axios from "axios";
import axiosInstance from "./axios";
import { getAuth } from "../modules/auth";

const userAuth = getAuth();

export type UsersResponse = {
  current_page: number;
  data: {
    id: string;
    fname: string;
    lname: string;
    email: string;
    avatar: string | null;
    can_create_company: number;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    ticket_count: number;
    user_has_ticket_id: string | null;
    pivot: {
      model_type: string;
      role_id: number;
      model_id: string;
    };
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
  country,
  interestsFilter,
}: {
  roleFilter?: string;
  nameFilter?: string;
  offset: number | string;
  country?: string;
  interestsFilter?: string[] | string;
}) => {
  const formdata = new FormData();

  // Add existing filters
  roleFilter?.length &&
    roleFilter.length > 0 &&
    formdata.append("roleFilter", roleFilter);
  nameFilter?.length &&
    nameFilter.length > 0 &&
    formdata.append("nameFilter", nameFilter);
  formdata.append("offset", String(offset));

  // Add new filters
  country?.length &&
    country.length > 0 &&
    formdata.append("countryFilter", country);

  // Handle interestsFilter - can be array or string
  if (interestsFilter) {
    if (Array.isArray(interestsFilter)) {
      // If it's an array, join with commas or send as JSON string
      interestsFilter.length > 0 &&
        formdata.append("interestsFilter", interestsFilter.join(","));
    } else if (
      typeof interestsFilter === "string" &&
      interestsFilter.length > 0
    ) {
      formdata.append("interestsFilter", interestsFilter);
    }
  }

  return await axiosInstance.post(`/user/participants/filter/v2`, formdata);
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

export const getUsersPerRole = async (
  roleID: string,
  page = 1,
  search = ""
): Promise<UsersResponse> => {
  const response = await axiosInstance.get(`/users/${roleID}`, {
    params: { page, search },
  });
  return response?.data;
};
