import type { Hotel } from "./hotel";

export type UserPreview = {
  id: string;
  fname?: string | null;
  lname?: string | null;
  email?: string | null;
  avatar?: string | null;
};

export type Accommodation = {
  id: string;
  hotel_id: string;
  guest_id: string;
  companion_id?: string | null;
  check_in: string;
  check_out: string;
  hotel?: Hotel;
  guest?: UserPreview;
  companion?: UserPreview;
};

export type AccommodationsResponse = Accommodation[];

export type CreateAccommodationRequest = {
  hotel_id: string;
  guest_id: string;
  companion_id?: string;
  check_in: string;
  check_out: string;
};

export type UpdateAccommodationRequest = {
  hotel_id?: string;
  guest_id?: string;
  companion_id?: string | null;
  check_in?: string;
  check_out?: string;
};

export type ShowAccommodationResponse = Accommodation;

export type UserAccommodationsResponse = Accommodation[];

export type CompanionAccommodationsResponse = Accommodation[];

export type ShowCompanionAccommodationResponse = Accommodation;
