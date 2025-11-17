import type {
  UserPreview,
  CompanyLite,
  PitchDeckWithRelations,
} from "./pitch-deck";

export type InvestorConnection = {
  id: string;
  investor_id: string;
  startup_id?: string | null;
  pitch_deck_id?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type InvestorConnectionWithRelations = InvestorConnection & {
  investor?: UserPreview | null;
  startup?: CompanyLite | null;
  pitchDeck?: PitchDeckWithRelations | null;
};

export type InvestorConnectionsResponse = InvestorConnectionWithRelations[];

export type CreateInvestorConnectionRequest = {
  investor_id: string;
  startup_id?: string;
  pitch_deck_id?: string;
};
