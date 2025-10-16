import React, { useMemo } from "react";
import { useQuery } from "react-query";
import { getAllCompaniesApi } from "../apis";

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
