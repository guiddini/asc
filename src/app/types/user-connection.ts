export type UserConnectionStatus = "none" | "pending" | "accepted";

export type UserConnectionUser = {
  id: string;
  fname: string;
  lname: string;
  avatar?: string | null;
  email?: string | null;
};

export type UserConnection = {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: UserConnectionStatus;
  created_at: string;
  updated_at: string;
  sender?: UserConnectionUser;
  receiver?: UserConnectionUser;
};

export type PaginatedUserConnections = {
  data: UserConnection[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type PendingConnectionsCount = {
  count: number;
};
