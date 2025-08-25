export type Notification = {
  id: string;
  fname: string;
  lname: string;
  sender_id: string;
  receiver_id: string;
  model_id: string;
  seen: string;
  message: string;
  created_at: string; // You might want to use Date type here if it's a date
  updated_at: string; // You
};
