export type FcmUserSummary = {
  id: string;
  fname: string | null;
  lname: string | null;
  email: string;
  avatar: string | null;
  roles?: {
    id: number;
    name: string;
    display_name: string;
  }[];
};

export type PaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

export type FcmUsersWithTokensResponse = {
  current_page: number;
  data: FcmUserSummary[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
};

export type SendFcmRequest = {
  title: string;
  body: string;
  user_id?: string;
  user_ids?: string[];
  roles?: string[];
  role_id?: number;
  role_ids?: number[];
};

export type SendFcmResponse = {
  requested_users: number;
  tokens: number;
  sent: number;
};
