import { useMutation, useQuery } from "react-query";
import {
  createProductsServicesCategoryApi,
  getAllProductsServicesCategoriesApi,
  updateProductsServicesCategoryApi,
} from "../../../../apis";
import { useMemo } from "react";

export type ProductsServicesCategoryProps = {
  name_ar: string;
  name_fr: string;
  name_en: string;
};

export type CreateProductsServicesCategoryProps = ProductsServicesCategoryProps;

export type UpdateProductsServicesCategoryProps =
  ProductsServicesCategoryProps & {
    category_id: string | number;
  };

const useProductsCategories = () => {
  const { mutate: createCategory, isLoading: isCreating } = useMutation({
    mutationKey: ["create-product-category"],
    mutationFn: (data: CreateProductsServicesCategoryProps) =>
      createProductsServicesCategoryApi(data),
  });

  const {
    data,
    isLoading: loadingCategories,
    refetch,
  } = useQuery({
    queryFn: getAllProductsServicesCategoriesApi,
    queryKey: ["get-all-products-services-categories"],
  });

  const { mutate: updateCategory, isLoading: isUpdating } = useMutation({
    mutationKey: ["update-product-category"],
    mutationFn: (data: UpdateProductsServicesCategoryProps) =>
      updateProductsServicesCategoryApi(data),
  });

  const PRODUCTS_CATEGORIES = useMemo(() => data?.data, [data]);

  return {
    data,
    loadingCategories,
    refetch,
    createCategory,
    isCreating,
    updateCategory,
    isUpdating,
    PRODUCTS_CATEGORIES,
  };
};
export default useProductsCategories;
