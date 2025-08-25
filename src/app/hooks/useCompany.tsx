import React, { useMemo } from "react";
import { useMutation, useQuery } from "react-query";
import { companyType, createCompanyProps } from "../types/company";
import { createCompanyApi, getAllCompaniesApi } from "../apis";

export const useCompany = () => {
  // get all companies

  const {
    data: companies,
    isLoading: loadingCompanies,
    refetch: refetchCompanies,
  } = useQuery({
    queryKey: ["get-all-companies"],
    queryFn: getAllCompaniesApi,
  });

  // create company
  const { mutate: createCompanyMutate, isLoading: isCreatingCompany } =
    useMutation({
      mutationKey: ["create-company"],
      mutationFn: async (data: any) => {
        return await createCompanyApi(data);
      },
    });

  // memo companies (to reduce unecessary re-renders)

  const MEMORIZED_COMPANIES = useMemo(() => {
    return companies?.data;
  }, [companies]);

  return {
    //
    MEMORIZED_COMPANIES,
    loadingCompanies,
    refetchCompanies,

    //
    createCompanyMutate,
    isCreatingCompany,
  };
};
