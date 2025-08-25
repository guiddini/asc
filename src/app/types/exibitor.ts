import { Company, Ticket } from "./user";

export type ExibitorType = {
  id: string;
  fname: string;
  lname: string;
  email: string;
  ticket_id: string | null;
  ticket_count: string;
  info: {
    phone: string | null;
    address: string | null;
    country: string | null;
    is_registered: string;
    type: string | null;
    wilaya: string | null;
    city: string | null;
    wilaya_id: string | null;
    commune_id: string | null;
    foreign_university: string | null;
    university_id: string | null;
    occupation: string | null;
    occupation_id: string | null;
    institution_type: string | null;
    institution_name: string | null;
  };
  ticket: Ticket[];
  qrcode: {
    id: number;
    created_at: string;
    updated_at: string;
    value: string;
    path: string;
    file_name: string;
    user_id: string;
  };
  role: string;
  permissions: string[];
  company: Company;
};
