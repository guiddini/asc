export type ConferenceSpeaker = {
  id: string;
  fname: string;
  lname: string;
  avatar: string;
};

export type ConferenceAttendee = {
  id: string;
  fname: string;
  lname: string;
  avatar: string;
};

export type Conference = {
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
  speakers: ConferenceSpeaker[];
  attendees: ConferenceAttendee[];
};

export type ConferencesResponse = {
  data: Conference[];
  meta: {
    total_conferences: number;
    total_speakers: number;
    total_attendees: number;
  };
};

export type ShowConferenceResponse = {
  conference: Conference;
  meta: {
    speakers_count: number;
    attendees_count: number;
  };
};

export type CreateConferenceRequest = {
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  status: string;
  side_event_id?: string;
};
