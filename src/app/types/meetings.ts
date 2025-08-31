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
