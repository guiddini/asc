export type Willaya = {
  arabic_name: string;
  created_at: string;
  id: number;
  latitude: string;
  longitude: string;
  name: string;
  updated_at: string | null; // Assuming updated_at can be null
};

export type Permission = {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  display_name: string;
};
