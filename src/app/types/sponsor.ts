export interface Sponsor {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  type: "sponsor" | "partner";
  created_at?: string;
  updated_at?: string;
}

export type SponsorsResponse = Sponsor[];
export type SponsorResponse = Sponsor;

export interface CreateSponsorRequest {
  name: string;
  logo?: File | null;
  website?: string;
  type: "sponsor" | "partner";
}

export interface SponsorFilter {
  type?: "sponsor" | "partner";
}
