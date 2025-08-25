import axiosInstance from "./axios";

const getAllActiveAdsApi = async () => {
  return await axiosInstance.get("/ad");
};

const getAllAdsApi = async () => {
  return await axiosInstance.get("/ad/all");
};

const getCompanyAdsApi = async (company_id: string | number) => {
  return await axiosInstance.get(`/ad/company/${company_id}`);
};

// admin routes
const createAdsApi = async (data: {
  name: string;
  image: File;
  company_id: string;
  link: string;
  start_date: string;
  end_date: string;
}) => {
  const formdata = new FormData();
  formdata.append("name", data.name);
  formdata.append("image", data.image);
  formdata.append("company_id", data.company_id);
  formdata.append("link", data.link);
  formdata.append("start_date", data.start_date);
  formdata.append("end_date", data.end_date);
  return axiosInstance.post("/ad/create", formdata);
};

const deleteAdsApi = async (id: string | number) => {
  const formdata = new FormData();
  formdata.append("id", String(id));

  return axiosInstance.post("/ad/delete", formdata);
};

const updateAdsApi = async (data: FormData) => {
  return axiosInstance.post("/ad/update", data);
};

const acceptAdsApi = async (id: string | number) => {
  const formdata = new FormData();
  formdata.append("id", String(id));
  return axiosInstance.post("/ad/accept/demand", formdata);
};

// user routes
const createAdsDemandApi = async (data: {
  name: string;
  image: File;
  company_id: string | number;
  link: string;
  start_date: string;
  end_date: string;
}) => {
  const formdata = new FormData();
  formdata.append("name", data.name);
  formdata.append("image", data.image);
  formdata.append("company_id", String(data.company_id));
  formdata.append("link", data.link);
  formdata.append("start_date", data.start_date);
  formdata.append("end_date", data.end_date);
  return axiosInstance.post("/ad/create/demand", formdata);
};

const refuseAdsDemandApi = async (
  id: string | number,
  status_reason: string
) => {
  const formdata = new FormData();
  formdata.append("id", String(id));
  formdata.append("status_reason", status_reason);
  return axiosInstance.post("/ad/refuse/demand", formdata);
};

const updateAdsDemandApi = async (data: FormData) => {
  return axiosInstance.post("/ad/update", data);
};

const clickAdsApi = async (id: string | number) => {
  const formdata = new FormData();
  formdata.append("id", String(id));
  return axiosInstance.post("/ad/click", formdata);
};

export {
  createAdsApi,
  deleteAdsApi,
  updateAdsApi,
  createAdsDemandApi,
  refuseAdsDemandApi,
  updateAdsDemandApi,
  clickAdsApi,
  getAllAdsApi,
  getAllActiveAdsApi,
  acceptAdsApi,
  getCompanyAdsApi,
};
