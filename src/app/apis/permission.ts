import {
  Day,
  UserRolesResponse,
  HighestRoleResponse,
  UserPermissionsResponse,
  AllPermissionsResponse,
  GrantDayAccessResponse,
  RevokeDayAccessResponse,
  ListUserDaysResponse,
} from "../types/permission";
import axiosInstance from "./axios";

export const getUserRoles = async (
  userId: string
): Promise<UserRolesResponse> => {
  const { data } = await axiosInstance.get<UserRolesResponse>(
    `/asc/user-roles/${userId}`
  );
  return data;
};

export const getHighestRole = async (
  userId: string
): Promise<HighestRoleResponse> => {
  const { data } = await axiosInstance.get<HighestRoleResponse>(
    `/asc/user-role/${userId}/highest`
  );
  return data;
};

export const getUserPermissions = async (
  userId: string
): Promise<UserPermissionsResponse> => {
  const { data } = await axiosInstance.get<UserPermissionsResponse>(
    `/asc/user-permissions/${userId}`
  );
  return data;
};

export const getAllPermissions = async (): Promise<AllPermissionsResponse> => {
  const { data } = await axiosInstance.get<AllPermissionsResponse>(
    "/asc/all-permissions"
  );
  return data;
};

export const grantDayAccess = async (
  userId: string,
  day: Day
): Promise<GrantDayAccessResponse> => {
  const { data } = await axiosInstance.post<GrantDayAccessResponse>(
    `/asc/day-access/${userId}/${day}`
  );
  return data;
};

export const revokeDayAccess = async (
  userId: string,
  day: Day
): Promise<RevokeDayAccessResponse> => {
  const { data } = await axiosInstance.delete<RevokeDayAccessResponse>(
    `/asc/day-access/${userId}/${day}`
  );
  return data;
};

export const listUserDays = async (
  userId: string
): Promise<ListUserDaysResponse> => {
  const { data } = await axiosInstance.get<ListUserDaysResponse>(
    `/asc/day-access/${userId}`
  );
  return data;
};
