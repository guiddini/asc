export type UserTypeCount = {
  type: string;
  count: number;
};

export type ExhibitionStatus =
  | "pending"
  | "accepted"
  | "refused"
  | "paid"
  | "failed";
export type VisaStatus = "pending" | "accepted" | "refused" | "cancelled";
export type MeetingStatus = "pending" | "accepted" | "declined" | "cancelled";

export type StatusCounts<T extends string> = Record<T, number>;

export type RevenueBreakdown = {
  total: number;
  by_stand_type: Record<string, number>;
  by_payment_method: Record<string, number>;
};

export type AdminStatsResponse = {
  users: {
    total: number;
    by_type: UserTypeCount[];
  };
  expositions: {
    total: number;
    by_status: StatusCounts<ExhibitionStatus>;
    revenue: RevenueBreakdown;
  };
  visas: {
    total: number;
    by_status: StatusCounts<VisaStatus>;
  };
  meetings: {
    total: number;
    by_status: StatusCounts<MeetingStatus>;
  };
};
