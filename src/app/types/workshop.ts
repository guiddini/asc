export type WorkshopSpeaker = {
  id: string;
  fname: string;
  lname: string;
  avatar: string;
};

export type WorkshopAttendee = {
  id: string;
  fname: string;
  lname: string;
  avatar: string;
};

export type Workshop = {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  created_by: string;
  status: string;
  created_at: string;
  updated_at: string;
  speakers: WorkshopSpeaker[];
  attendees: WorkshopAttendee[];
};

export type WorkshopsResponse = {
  data: Workshop[];
  meta: {
    total_conferences: number;
    total_speakers: number;
    total_attendees: number;
  };
};

export type ShowWorkshopResponse = {
  workshop: Workshop;
  meta: {
    speakers_count: number;
    attendees_count: number;
  };
};

export type CreateWorkshopRequest = {
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  status: string;
  side_event_id?: string;
};
