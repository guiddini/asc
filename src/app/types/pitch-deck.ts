export type PitchDeckStatus = "pending" | "accepted" | "refused";

export type CountryMinimal = {
  id: number;
  name_en: string;
  code: string;
};

export type UserInfoLite = {
  phone?: string | null;
  linkedin_url?: string | null;
};

export type UserPreview = {
  id: string;
  fname?: string | null;
  lname?: string | null;
  avatar?: string | null;
  info?: UserInfoLite | null;
};

export type CompanyLite = {
  id: string;
  name: string;
  logo?: string | null;
  country_id?: number | null;
  country?: CountryMinimal | null;
};

export type PitchDeck = {
  id: string;
  uploaded_by: string;
  file_path: string;
  status: PitchDeckStatus;
  title: string | null;
  year_of_creation: number | null;
  website_links: string[] | null;
  activity_sectors: string[] | null;
  project_description: string | null;
  maturity_level: string | null;
  revenue_2024: number | null;
  users_count: number | null;
  employees_count: number | null;
  investment_category: string | null;
  requested_amount_usd: number | null;
  country_id: number | null;
  is_favorite?: boolean | null;
  created_at?: string;
  updated_at?: string;
};

export type PitchDeckWithRelations = PitchDeck & {
  company?: CompanyLite | null;
  uploader?: UserPreview | null;
};

export type Paginated<T> = {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
};

export type PitchDeckListResponse = Paginated<PitchDeckWithRelations>;

export type ShowPitchDeckResponse = {
  pitch_deck: PitchDeckWithRelations;
  file_url: string;
};

export type PitchDeckStatusResponse = {
  status: PitchDeckStatus | null;
};

export type MyPitchDeckResponse = {
  pitch_deck: PitchDeckWithRelations | null;
  file_url: string | null;
};

export type UploadPitchDeckPayload = {
  title: string;
  phone: string;
  country: number;
  founder_linkedin: string;
  year_of_creation: number;
  website_links: string[];
  activity_sectors: string[];
  project_description: string;
  maturity_level: string;
  revenue_2024: number;
  users_count: number;
  employees_count: number;
  investment_category: string;
  requested_amount_usd: number;
};

export type AcceptedPitchDeckFilters = {
  search?: string;
  year_of_creation?: number;
  maturity_level?: string;
  revenue_2024?: number;
  users_count?: number;
  employees_count?: number;
  investment_category?: string;
  requested_amount_usd?: number;
  country_id?: number;
  activity_sectors?: string | string[];
};

export type ListPitchDeckFilters = AcceptedPitchDeckFilters & {
  status?: PitchDeckStatus;
  page?: number;
  per_page?: number;
};
