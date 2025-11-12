export type createCompanyProps = {
  name: string;
  legal_status: string;
  country: SelectProps;
  wilaya: SelectProps;
  commune: SelectProps;
  address: string;
  phone_1: string;
  phone_2: string;
  phone_3: string;
  email: string;
  user_id: string;
  logo: File;
};

export type SelectProps = {
  label: string;
  value: string | number;
};

export type companyType = {
  created_at: string;
  id: string;
  updated_at: string;
  name: string;
  legal_status: string;
  country: string;
  wilaya: string;
  city: string;
  address: string;
  phone_1: string;
  phone_2: string;
  phone_3: string;
  email: string;
  description: string;
  user_id: string;
  logo: string | null;
};

export type CompanyDetailProps = {
  address: string;
  commune_id: string;
  country_id: string;
  created_at: string;
  description: null | string;
  desc: null | string;
  email: string;
  header_image: File | string | null;
  header_text: null | string;
  id: string;
  legal_status: string;
  logo: File | string;
  name: string;
  phone_1: string;
  quote_author: null | string;
  quote_text: null | string;
  team_text: null | string;
  updated_at: string;
  user_id: string;
  wilaya_id: string;
};

export interface JobOffer {
  id: number;
  name: string;
  company_id: string;
  description: string;
  workplace_type: string;
  workplace_wilaya_id: string;
  workplace_commune_id: string;
  workplace_address: string;
  work_position: string;
  work_type: string;
  work_requirements: string[];
  work_roles: string[];
  work_benefits: string[];
  work_skills: string[];
  application_terms: string[];
  application_receipts_emails: string[];
  job_offer_status: string;
  created_at: string;
  updated_at: string;
}

export type PublicCompany = {
  name: string;
  logo: string | null;
  id: string;
};
