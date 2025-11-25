import { PublicCompany } from "./../types/company";
import axiosInstance from "./axios";

const getAllCompaniesApi = async (params?: {
  search?: string;
  country_id?: string | number;
}) => {
  return axiosInstance.get("/company/all", { params });
};

const getCompanyApi = async (id: string | number) => {
  return await axiosInstance.get(`/company/profile/${id}`);
};

const updateCompanyApi = async (data: FormData) => {
  return axiosInstance.post(`/company/update`, data);
};

// staff
const getAllCompanyStaffApi = async (company_id: string | number) => {
  return axiosInstance.get(`/company/staff/${company_id}`);
};

const findStaffUserApi = async (user_id: string) => {
  return axiosInstance.get(`/company/staff/find/${user_id}`);
};

const addCompanyStaffApi = async ({
  company_id,
  user_id,
  role,
}: {
  user_id: string;
  company_id: string;
  role: string;
}) => {
  const formdata = new FormData();
  formdata.append("user_id", user_id);
  formdata.append("company_id", company_id);
  formdata.append("role", role);
  return axiosInstance.post(`/company/staff/add`, formdata);
};

const removeStaffCompanyApi = async ({
  company_id,
  user_id,
}: {
  user_id: string;
  company_id: string;
}) => {
  const formdata = new FormData();
  formdata.append("user_id", user_id);
  formdata.append("company_id", company_id);
  return axiosInstance.post(`/company/staff/remove`, formdata);
};

const getAllNotInCompanyStaffApi = async ({
  nameFilter,
  offset,
  roleFilter,
}: {
  nameFilter?: string;
  roleFilter?: string;
  offset: string | number;
}) => {
  return axiosInstance.post("/company/users/not-in-company-staff", {
    nameFilter,
    roleFilter,
    offset,
  });
};

const createOrUpdateCompanyApi = async (data: FormData) =>
  await axiosInstance.post("/company/createOrUpdate", data);

export {
  createCompanyApi,
  getAllCompaniesApi,
  updateCompanyApi,
  getCompanyApi,
  getAllCompanyStaffApi,
  findStaffUserApi,
  addCompanyStaffApi,
  removeStaffCompanyApi,
  getAllNotInCompanyStaffApi,
  createOrUpdateCompanyApi,
};

// V2
const createCompanyApi = async (data: FormData) => {
  return axiosInstance.post("/company/create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getPublicCompanies = async (): Promise<PublicCompany[]> => {
  const res = await axiosInstance.get("/public/companies");
  return res.data;
};

export const getCompanyStats = async (company_id: string | number) => {
  return axiosInstance.get(`/company/${company_id}/stats`);
};
