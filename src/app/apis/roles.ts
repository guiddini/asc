import axiosInstance from "./axios";

const getAllRolesApi = async () => {
  return await axiosInstance.get("/role/all");
};

const getAllPermissionsApi = async () => {
  return await axiosInstance.get("/permission/all");
};

const getRolePermissionsApi = async (role_id: string) => {
  return await axiosInstance.get(`/role/permissions/${role_id}`);
};

const getAllTicketRolesApi = async () => {
  return await axiosInstance.get("/role/ticket/all");
};

const getPermissionsPrvApi = async () => {
  return await axiosInstance.get("/permission/prv");
};

const checkPermissionApi = async (permissionID: string, userID: string) => {
  return await axiosInstance.get(`/permission/check/${permissionID}/${userID}`);
};

const assignPermissionToUserApi = async ({
  user_id,
  permissions,
}: {
  user_id: string;
  permissions: number[];
}) => {
  const formdata = new FormData();
  formdata.append("user_id", String(user_id));
  permissions.forEach((permission, index) => {
    formdata.append(`permissions[${index}]`, String(permission));
  });
  return await axiosInstance.post(`/permission/assign/user`, formdata);
};

const assignPermissionToTicketApi = async ({
  role_id,
  permissions,
}: {
  role_id: string;
  permissions: number[];
}) => {
  return await axiosInstance.post(`/permission/role/assign`, {
    role_id,
    permissions,
  });
};

const assignPermissionsToRole = async (data: {
  role_id: string | number;
  permissions: string[];
}) => {
  const formdata = new FormData();
  formdata.append("role_id", String(data.role_id));
  data?.permissions?.forEach((permission, index) => {
    formdata.append(`permissions[${index}]`, permission);
  });
  return await axiosInstance.post(`/permission/assign/role`, formdata);
};

const getUserPermissionsApi = async (user_id: string | number) => {
  return await axiosInstance.get(`/permission/all/${user_id}`);
};

const addUserToStaffApi = async (user_id: string | number) =>
  await axiosInstance.post("/role/staff", {
    user_id,
  });

const assignRoleToUserApi = async (
  user_id: string | number,
  role_id: string | number
) => {
  return await axiosInstance.post("/role/assign", {
    user_id,
    role_id,
  });
};

const removeRoleFromUserApi = async (
  user_id: string | number,
  role_id: string | number
) => {
  return await axiosInstance.post("/role/remove", {
    user_id,
    role_id,
  });
};

export {
  getAllRolesApi,
  getAllPermissionsApi,
  getAllTicketRolesApi,
  getPermissionsPrvApi,
  checkPermissionApi,
  assignPermissionToUserApi,
  assignPermissionToTicketApi,
  assignPermissionsToRole,
  getUserPermissionsApi,
  getRolePermissionsApi,
  addUserToStaffApi,
  assignRoleToUserApi,
  removeRoleFromUserApi,
};
