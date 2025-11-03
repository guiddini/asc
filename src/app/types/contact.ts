export type ContactType = "contact" | "sponsor";

export interface ContactRequest {
  id: string;
  fname: string;
  lname: string;
  email: string;
  phone?: string | null;
  company_name?: string | null;
  position?: string | null;
  previous_sponsor?: boolean;
  message?: string | null;
  type: ContactType;
  created_at: string;
  updated_at: string;
}

export interface ContactRequestPayload {
  fname: string;
  lname: string;
  email: string;
  phone?: string;
  company_name?: string;
  position?: string;
  previous_sponsor?: boolean;
  message?: string;
  type: ContactType;
}

export interface PaginatedContactResponse {
  current_page: number;
  data: ContactRequest[];
  per_page: number;
  total: number;
  last_page: number;
}
