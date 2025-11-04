// types/side-event.ts

export type SideEvent = {
  id: string;
  slug: string;
  logo: string | null;
  cover: string | null;
  date: string | null;
  gallery: string[];
  name: string;
  description: string | null;
  location: string | null;
  website: string | null;
  email: string | null;
  categories: string[];
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
};

export type SideEventsResponse = SideEvent[];

export type ShowSideEventResponse = SideEvent;

export type CreateSideEventRequest = {
  name: string;
  description?: string;
  location?: string;
  website?: string;
  email?: string;
  date?: string;
  categories?: string[];
  status?: "draft" | "published";
  logo?: File;
  cover?: File;
  gallery?: File[];
};

// Program Event
export type ProgramEvent = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_time: string;
  end_time: string;
  status: string;
  side_event_id: string;
  created_at: string;
  updated_at: string;
};

// Workshop
export type Workshop = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_time: string;
  end_time: string;
  status: string;
  side_event_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

// Conference
export type Conference = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_time: string;
  end_time: string;
  status: string;
  side_event_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

// Public Schedule Item
export type PublicScheduleItem = {
  id: string;
  type: "conference" | "workshop" | "general_event";
  title: string | null;
  location: string | null;
  start_time: string;
  end_time: string;
  speakers?: {
    id: string;
    name: string;
    position: string | null;
    avatar: string | null;
  }[];
};
