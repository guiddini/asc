import axiosInstance from "./axios";

const getAllProductServiceApi = () => {
  return axiosInstance.get("/productservice/all");
};

const getAllPublishedProductServiceApi = (params?: {
  search?: string;
  country_id?: number;
  category_id?: number;
}) => {
  return axiosInstance.get("/productservice/all/published", { params });
};

const getCompanyProductServiceApi = (company_id: string) => {
  return axiosInstance.get(`/productservice/all/${company_id}`);
};

const getOneProductServiceApi = (id: string | number) => {
  return axiosInstance.get(`/productservice/${id}`);
};

const createProductServiceApi = (data) => {
  return axiosInstance.post("/productservice/create", data);
};

const updateProductServiceApi = (data) => {
  return axiosInstance.post("/productservice/update", data);
};

const deleteProductServiceApi = ({
  productservice_id,
}: {
  productservice_id: string | number;
}) => {
  const formdata = new FormData();
  formdata.append("productservice_id", String(productservice_id));
  return axiosInstance.post("/productservice/delete", formdata);
};

const publishProductServiceApi = (id: string | number) => {
  const formdata = new FormData();
  formdata.append("productservice_id", String(id));
  return axiosInstance.post("/productservice/publish", formdata);
};

const refuseProductServiceApi = (
  id: string | number,
  status_reason: string
) => {
  const formdata = new FormData();
  formdata.append("productservice_id", String(id));
  formdata.append("status_reason", status_reason);
  return axiosInstance.post("/productservice/refuse", formdata);
};

const getAllPromotedProductServiceApi = () => {
  return axiosInstance.get("/productservice/promotion/promoted");
};

const getAllNotPromotedProductServiceApi = () => {
  return axiosInstance.get("/productservice/promotion/notpromoted");
};

const getAllPendingPromotedProductServiceApi = () => {
  return axiosInstance.get("/productservice/promotion/pending");
};

export {
  getAllProductServiceApi,
  createProductServiceApi,
  updateProductServiceApi,
  deleteProductServiceApi,
  getOneProductServiceApi,
  getCompanyProductServiceApi,
  publishProductServiceApi,
  refuseProductServiceApi,
  getAllPromotedProductServiceApi,
  getAllNotPromotedProductServiceApi,
  getAllPendingPromotedProductServiceApi,
  getAllPublishedProductServiceApi,
};
