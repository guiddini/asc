export type ProgramEvent = {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  start_time: string;
  end_time: string;
  created_at?: string;
  updated_at?: string;
};

export type ProgramEventRequest = {
  title: string;
  description?: string | null;
  location?: string | null;
  start_time: string;
  end_time: string;
};
