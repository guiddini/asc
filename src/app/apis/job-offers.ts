import axiosInstance from "./axios";

const getAllActiveJobOffers = async () => {
  return axiosInstance.get(`/joboffer/active/all/companies`);
};

const getOneJobOfferApi = async (id: string | number) => {
  return axiosInstance.get(`/joboffer/${id}`);
};

const createJobOfferApi = async (data: FormData) => {
  return axiosInstance.post("/joboffer/add", data);
};

const updateJobOfferApi = async (data: FormData) => {
  return axiosInstance.post("/joboffer/update", data);
};

const getCompanyActiveJobOffersApi = async (id: string | number) => {
  return axiosInstance.get(`/joboffer/active/${id}`);
};

const getCompanyInactiveJobOffersApi = async (id: string | number) => {
  return axiosInstance.get(`/joboffer/inactive/${id}`);
};

const makeCompanyJobOfferActiveApi = async (id: string | number) => {
  return axiosInstance.get(`/joboffer/activate/${id}`);
};

const makeCompanyJobOfferInactiveApi = async (id: string | number) => {
  return axiosInstance.get(`/joboffer/deactivate/${id}`);
};

// job applications

const applyToJobApi = async (data: {
  company_job_offer_id: string | number;
  user_website: string;
  user_cv: File;
  user_phone_number: string | number;
}) => {
  const formdata = new FormData();
  formdata.append("company_job_offer_id", String(data.company_job_offer_id));
  formdata.append("user_cv", data.user_cv);
  formdata.append("user_website", data.user_website);
  formdata.append("user_phone_number", String(data.user_phone_number));
  return axiosInstance.post(`/jobapplication/apply`, formdata);
};

const getUserJobApplicationsApi = async () => {
  return axiosInstance.get(`/jobapplication/all`);
};

const getAllCompanyJobApplicationsApi = async () => {
  return axiosInstance.get(`/jobapplication/all`);
};

const getPendingCompanyJobApplicationsApi = async (id: string | number) => {
  return axiosInstance.get(`/jobapplication/pending/${id}`);
};

const getAcceptedCompanyJobApplicationsApi = async (id: string | number) => {
  return axiosInstance.get(`/jobapplication/accepted/${id}`);
};

const getRefusedCompanyJobApplicationsApi = async (id: string | number) => {
  return axiosInstance.get(`/jobapplication/refused/${id}`);
};

const acceptJobApplicationApi = ({
  id,
  company_meetup_date,
  company_meetup_time,
}: {
  id: string | number;
  company_meetup_time: string;
  company_meetup_date: string;
}) => {
  const formdata = new FormData();
  formdata.append("user_job_application_id", String(id));
  formdata.append("company_meetup_time", company_meetup_time);
  formdata.append("company_meetup_date", company_meetup_date);
  return axiosInstance.post(`/jobapplication/accept`, formdata);
};

const refuseJobApplicationApi = async ({ id }: { id: string | number }) => {
  const formdata = new FormData();
  formdata.append("user_job_application_id", String(id));

  return axiosInstance.post(`/jobapplication/refuse`, formdata);
};

export {
  createJobOfferApi,
  getCompanyActiveJobOffersApi,
  getCompanyInactiveJobOffersApi,
  makeCompanyJobOfferActiveApi,
  makeCompanyJobOfferInactiveApi,
  applyToJobApi,
  getUserJobApplicationsApi,
  getAllCompanyJobApplicationsApi,
  getAllActiveJobOffers,
  acceptJobApplicationApi,
  refuseJobApplicationApi,
  getPendingCompanyJobApplicationsApi,
  getAcceptedCompanyJobApplicationsApi,
  getRefusedCompanyJobApplicationsApi,
  getOneJobOfferApi,
  updateJobOfferApi,
};
