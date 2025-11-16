export type Hotel = {
  id: string;
  name: string;
  logo?: string | null;
  address?: string | null;
  map?: string | null;
};

export type HotelsResponse = Hotel[];

export type CreateHotelRequest = {
  name: string;
  logo?: string;
  address?: string;
  map?: string;
};

export type UpdateHotelRequest = {
  name?: string;
  logo?: string | null;
  address?: string | null;
  map?: string | null;
};

export type ShowHotelResponse = Hotel;
