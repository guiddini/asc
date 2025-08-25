import { useMemo } from "react";
import { getAllPermissionsApi, getRolePermissionsApi } from "../apis";
import { useMutation, useQuery } from "react-query";
import { Permission } from "../types/resources";
import { useAuth } from "../modules/auth";

export const usePermissions = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["permissions"],
    queryFn: getAllPermissionsApi,
  });

  const {
    data: permissions,
    isLoading: loadingUserPermission,
    mutate: getUserPermissions,
  } = useMutation({
    mutationKey: ["user-permissions"],
    mutationFn: async (id: string) => getRolePermissionsApi(id),
  });

  const PERMISIONS: Permission[] = useMemo(() => data?.data, [data]);

  const USER_PERMISIONS: Permission[] = useMemo(() => permissions?.data, []);

  return {
    PERMISIONS,
    isLoading,
    refetch,

    // user permissions
    USER_PERMISIONS,
    loadingUserPermission,
    getUserPermissions,
  };
};
