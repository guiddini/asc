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
const getAllExhibitionDemandsApi = async (params?: {
  status?:
    | "all"
    | "pending"
    | "accepted"
    | "refused"
    | "paid"
    | "unpaid"
    | "failed";
  page?: number;
  per_page?: number;
  exhibition_type?:
    | "connect_desk"
    | "premium_exhibition_space"
    | "scale_up_booth";
}) => {
  const response = await axiosInstance.get("/exhibition-demand/all", {
    params,
  });
  return response.data;
};

const getCompanyExhibitionDemand = async () => {
  return axiosInstance.get(`/exhibition-demand/company`);
};

const acceptExhibitionDemandApi = async (id: string) => {
  return axiosInstance.post(`/exhibition-demand/accept`, {
    demand_id: id,
  });
};

const refuseExhibitionDemandApi = async (id: string, notes?: string) => {
  return axiosInstance.post(`/exhibition-demand/refuse`, {
    demand_id: id,
    notes,
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
  await axiosInstance.post(`/exhibition-demand/online/pay`, {
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

const adminEditExhibitionDemandApi = async (data: {
  demand_id: string;
  notes: string;
  exhibition_type:
    | "connect_desk"
    | "premium_exhibition_space"
    | "scale_up_booth";
}) => {
  return axiosInstance.post(
    `/exhibition-demand/admin/edit/${data?.demand_id}`,
    data
  );
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
  adminEditExhibitionDemandApi,
};
