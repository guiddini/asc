export interface Company {
  id: string;
  name: string;
  phone_1: string | null;
  revenue_2024: number | null;
  revenue_2025: number | null;
  total_funds_raised: number | null;
  country_id: number;
  founded_date: string;
  logo: string;
  label_number: string;
  country: {
    id: number;
    name_en: string;
  };
}

export interface ExhibitionDemand {
  id: string;
  exhibition_demand_transaction_id: string | undefined;
  company_id: string;
  user_id: string;
  status:
    | "pending"
    | "accepted"
    | "refused"
    | "failed"
    | "Pending transfer confirmation"
    | "paid"
    | "unpaid";
  created_at: string;
  updated_at: string;
  exhibition_type: string;
  payment_method: string | undefined;
  order_id: string | undefined;
  transfer_document: string | undefined;
  company: Company;
  transaction: Transaction;
}

export interface ExhibitionDemandsResponse {
  status: string;
  demands: ExhibitionDemand[];
}

export interface Transaction {
  id: string;
  order_id: string;
  gateway_order_id: string;
  gateway_bool: string;
  gateway_response_message: string;
  gateway_error_code: string;
  gateway_code: string;
  stand_type: string;
  stand_size: string;
  registration_fee: number;
  cleaning_fee: number;
  advertising_fee: number;
  electricity_fee: number;
  stand_cost: number;
  total_excluding_tax: number;
  discount_percentage: number | null;
  discount_value: number | null;
  total_after_discount: number | null;
  tax_value: number;
  total_after_tax: number;
  company_id: string;
  user_id: string;
  payment_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  exhibition_demand_id: string;
}
