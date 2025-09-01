export interface Meeting {
  id: string;
  requester_id: string;
  receiver_id: string;
  topic: string;
  location: string;
  start_time: string;
  end_time: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
  updated_at: string;
}

export interface MeetingDetail extends Meeting {
  receiver: {
    id: string;
    fname: string;
    lname: string;
    email: string;
    avatar: string | null;
    can_create_company: number;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    ticket_count: number;
    user_has_ticket_id: string | null;
  };
}
