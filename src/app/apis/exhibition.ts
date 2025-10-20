import axiosInstance from "./axios";

const calculateExhibitionDemandTotal = async (data: FormData) => {
  return axiosInstance.post(`/exhibition-demand/calculateTotal`, data);
};

const createExhibitionDemandApi = async (data: FormData) => {
  return axiosInstance.post(`/exhibition-demand/create`, data);
};

const updateExhibitionDemandApi = async (data: FormData) => {
  return axiosInstance.post(`/exhibition-demand/edit`, data);
};

const getAllExhibitionDemandsApi = async () => {
  return axiosInstance.get(`/exhibition-demand/all`);
};

const getCompanyExhibitionDemand = async () => {
  return axiosInstance.get(`/exhibition-demand/company`);
};

const acceptExhibitionDemandApi = async (id: string) => {
  return axiosInstance.post(`/exhibition-demand/accept`, {
    demand_id: id,
  });
};

const refuseExhibitionDemandApi = async (id: string) => {
  return axiosInstance.post(`/exhibition-demand/refuse`, {
    demand_id: id,
  });
};

const getExhibitionDemandTransactionApi = async (id: string) =>
  await axiosInstance.get(`/exhibition-demand/transaction/${id}`);

const checkExhibitionDemandTransactionApi = async () =>
  await axiosInstance.post(`/exhibition-demand/check`);

const uploadExhibitionDemandTransferDocument = async (data: FormData) =>
  await axiosInstance.post(`/exhibition-demand/uploadTransferDocument`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

const payOnlineExhibitionDemandApi = async (demand_id: string) =>
  await axiosInstance.post(`/exhibition-demand/pay`, {
    demand_id,
  });

const markExhibitionDemandAsPaidApi = async (demand_id: string) =>
  await axiosInstance.post(`/exhibition-demand/markAsPaid`, {
    demand_id,
  });

const markExhibitionDemandAsUnpaidApi = async (
  demand_id: string,
  notes: string
) =>
  await axiosInstance.post(`/exhibition-demand/markAsUnpaid`, {
    demand_id,
    notes,
  });

const showExhibitionDemandApi = async (demand_id: string) => {
  const res = await axiosInstance.post(`/exhibition-demand/show`, {
    demand_id,
  });
  return res?.data;
};

export {
  calculateExhibitionDemandTotal,
  createExhibitionDemandApi,
  getAllExhibitionDemandsApi,
  getCompanyExhibitionDemand,
  acceptExhibitionDemandApi,
  refuseExhibitionDemandApi,
  getExhibitionDemandTransactionApi,
  checkExhibitionDemandTransactionApi,
  updateExhibitionDemandApi,
  uploadExhibitionDemandTransferDocument,
  payOnlineExhibitionDemandApi,
  markExhibitionDemandAsPaidApi,
  markExhibitionDemandAsUnpaidApi,
  showExhibitionDemandApi,
};
