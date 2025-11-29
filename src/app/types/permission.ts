export type Day = 1 | 2 | 3;
export type NotGrantedDay = `not_granted_day_${Day}`;
export type AccessStatus = "not_granted" | NotGrantedDay | string;

export interface AscUserInfo {
  fname: string;
  lname: string;
  avatar: string | null;
  email: string;
}

export interface CheckPermissionResponse {
  access: AccessStatus;
  user: AscUserInfo;
  event?: { id: string; title: string };
}

export interface UserRolesResponse {
  roles: string[];
}

export interface HighestRoleResponse {
  highest_role: string | null;
}

export interface UserPermissionsResponse {
  permissions: Record<string, string>;
}

export interface AllPermissionsResponse {
  permissions: string[];
}

export interface GrantDayAccessResponse {
  message: string;
}

export interface RevokeDayAccessResponse {
  message: string;
}

export interface ListUserDaysResponse {
  days: number[];
}
