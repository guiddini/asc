export type ProgramEvent = {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  start_time: string;
  end_time: string;
  side_event_id?: string;
  status?: "published" | "completed" | "cancelled";
  created_at?: string;
  updated_at?: string;
};

export type ProgramEventRequest = {
  title: string;
  description?: string | null;
  location?: string | null;
  start_time: string;
  end_time: string;
  side_event_id?: string;
  status?: "published" | "completed" | "cancelled";
};
