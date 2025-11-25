export type VisaDemandStatus = "pending" | "accepted" | "refused" | "cancelled";

export interface UserSummary {
  id: string;
  fname: string;
  lname: string;
  avatar: string | null;
  email?: string;
}

export interface VisaDemand {
  id: string;
  first_name: string;
  last_name: string;
  profession?: string | null;
  company_name?: string | null;
  passport_number: string;
  passport_issue_date?: string | null; // "YYYY-MM-DD"
  passport_expiration_date?: string | null; // "YYYY-MM-DD"
  authorities_password?: string | null;
  status: VisaDemandStatus;
  user_id: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  user: UserSummary;
}

/* Requests */
export interface VisaDemandsIndexRequest {
  status?: VisaDemandStatus;
  page?: number;
  per_page?: number;
}

export interface CreateVisaDemandRequest {
  first_name: string;
  last_name: string;
  profession?: string | null;
  company_name?: string | null;
  passport_number: string;
  passport_issue_date?: string | null; // "YYYY-MM-DD"
  passport_expiration_date?: string | null; // "YYYY-MM-DD"
  authorities_password?: string | null;
}

export interface EditVisaDemandRequest {
  demand_id: string;
  first_name?: string;
  last_name?: string;
  profession?: string | null;
  company_name?: string | null;
  passport_number?: string;
  passport_issue_date?: string | null; // "YYYY-MM-DD"
  passport_expiration_date?: string | null; // "YYYY-MM-DD"
  authorities_password?: string | null;
}

export interface DeleteVisaDemandRequest {
  demand_id: string;
}

export interface ShowVisaDemandRequest {
  demand_id: string;
}

export interface AcceptVisaDemandRequest {
  demand_id: string;
}

export interface RefuseVisaDemandRequest {
  demand_id: string;
}

export interface CancelVisaDemandRequest {
  demand_id: string;
}

/* Responses */
export interface ApiError {
  message: string;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface Paginated<T> {
  current_page: number;
  data: T[];
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
}

export type VisaDemandsIndexResponse = Paginated<VisaDemand>;
export type CreateVisaDemandResponse = VisaDemand;
export type EditVisaDemandResponse = VisaDemand;
export interface DeleteVisaDemandResponse {
  message: string;
  demand: VisaDemand;
}
export type ShowVisaDemandResponse = VisaDemand | ApiError;
export type AcceptVisaDemandResponse = VisaDemand;
export type RefuseVisaDemandResponse = VisaDemand;
export type CancelVisaDemandResponse = VisaDemand;

export interface GetUserVisaDemandResponse {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  profession?: string | null;
  company_name?: string | null;
  passport_number: string;
  passport_issue_date?: string | null;
  passport_expiration_date?: string | null;
  authorities_password?: string | null;
  status: "pending" | "accepted" | "refused" | "cancelled";
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
