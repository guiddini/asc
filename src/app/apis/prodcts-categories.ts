import {
  UpdateProductsServicesCategoryProps,
  CreateProductsServicesCategoryProps,
} from "../pages/configurations/company-product-service-categories/hooks";
import axiosInstance from "./axios";

const getAllProductsServicesCategoriesApi = async () => {
  return await axiosInstance.get(`/productservice/category/all`);
};

const createProductsServicesCategoryApi = async (
  data: CreateProductsServicesCategoryProps
) => {
  return await axiosInstance.post("/productservice/category/create", data);
};

const updateProductsServicesCategoryApi = async (
  data: UpdateProductsServicesCategoryProps
) => {
  return await axiosInstance.post(`/productservice/category/update`, data);
};

export {
  getAllProductsServicesCategoriesApi,
  createProductsServicesCategoryApi,
  updateProductsServicesCategoryApi,
};
