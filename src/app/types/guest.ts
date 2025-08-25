export type Guest = {
  id: string;
  code: string;
  fname: string;
  lname: string;
  is_delegated: null | boolean; // You can replace `null` with `boolean` if it should always be a boolean
  status: string;
  created_at: string;
  updated_at: string;
  ticket_name: string;
  user_id: null | string;
  email: string | null;
};
