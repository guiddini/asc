export type Permission = {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  display_name: string;
  pivot: {
    role_id: string;
    permission_id: string;
  };
};

export type Role = {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  display_name: string;
  uuid: string;
  permissions: Permission[];
};
