// src/types/pitch-deck.ts
export type PitchDeckStatus = "pending" | "accepted" | "refused";

export type UserPreview = {
  id: string;
  fname?: string | null;
  lname?: string | null;
  avatar?: string | null;
};

export type CompanyLite = {
  id: string;
  name: string;
  logo?: string | null;
};

export type PitchDeck = {
  id: string;
  company_id?: string | null;
  uploaded_by: string;
  file_path: string;
  status: PitchDeckStatus;
  title?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type PitchDeckWithRelations = PitchDeck & {
  company?: CompanyLite | null;
  uploader?: UserPreview | null;
};

export type PitchDeckListResponse = PitchDeckWithRelations[];

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
