export type CreateJobOfferProps = {
  name: string;
  work_requirements: string[];
  work_roles: string[];
  work_benefits: string[];
  work_skills: string[];
  application_terms: string[];
  emails: string[];
  workplace_address: string;
  wilaya: {
    label: string;
    value: number;
  };
  commune: {
    label: string;
    value: number;
  };
  step: number;
  work_position: {
    label: string;
    value: number;
  };
  workplace_type: {
    label: string;
    value: string;
  };
  work_type: {
    label: string;
    value: string;
  };
  desc: string;
  other_post?: string;
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
