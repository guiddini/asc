import React, { useMemo } from "react";
import { useQuery } from "react-query";
import { getAllCompaniesApi } from "../apis";

export const useCompany = (filter?: {
  search?: string;
  country_id?: string | number;
}) => {
  // get all companies with optional filters

  const {
    data: companies,
    isLoading: loadingCompanies,
    refetch: refetchCompanies,
  } = useQuery({
    queryKey: [
      "get-all-companies",
      filter?.search || "",
      filter?.country_id ?? null,
    ],
    queryFn: () => getAllCompaniesApi(filter),
  });

  const MEMORIZED_COMPANIES = useMemo(() => {
    return companies?.data;
  }, [companies]);

  return {
    //
    MEMORIZED_COMPANIES,
    loadingCompanies,
    refetchCompanies,
  };
};
