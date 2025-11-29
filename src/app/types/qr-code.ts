export interface Paginated<T> {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface UserLite {
  id: string;
  fname: string;
  lname: string;
  avatar?: string | null;
  email?: string | null;
}

export interface CompanyLite {
  id: string;
  name?: string;
  company_name?: string;
  logo?: string | null;
}

export type QrScanType = "networking" | "exhibition" | string;

export interface QrScanBase {
  id: number;
  type: QrScanType;
  context?: Record<string, any> | null;
  scanned_at: string;
}

export interface QrScanReceivedItem extends QrScanBase {
  scanner_id: string;
  scanner?: UserLite;
  // Optional if backend includes it
  scanner_type?: string;
}

export interface QrScanDoneItem extends QrScanBase {
  scannable_id: string;
  scannable_type?: string;
  scannable?: UserLite | CompanyLite;
}

/* /me/qr-logs */
export interface MyLogsResponse {
  user: { id: string; name: string; avatar?: string | null };
  i_scanned: QrScanDoneItem[];
  scanned_me: QrScanReceivedItem[];
  total_connections: number;
}

/* /me/company/visitors */
export interface CompanyVisitorsResponse {
  company: { id: string; name: string; logo?: string | null };
  total_visitors: number;
  visitors: Paginated<QrScanReceivedItem>;
}

/* /qr-logs/user/{user} */
export interface UserLogsResponse {
  user: { id: string; name: string; avatar?: string | null };
  scanned_by_others: Paginated<QrScanReceivedItem>;
  scanned_others: Paginated<QrScanDoneItem>;
}

/* /qr-logs/company/{company} and /qr-logs */
export interface AllLogsItem extends QrScanBase {
  scanner?: UserLite;
  scannable?: UserLite | CompanyLite;
}
export type AllLogsResponse = Paginated<AllLogsItem>;
export interface AllLogsParams {
  type?: QrScanType;
  date_from?: string; // YYYY-MM-DD
  date_to?: string; // YYYY-MM-DD
  user_id?: string;
  page?: number;
  per_page?: number;
}

/* /me/scans/i-did */
export interface MyScannedLogsResponse {
  i_scanned: Paginated<QrScanDoneItem>;
  total: number;
}

/* /me/scans/received */
export interface WhoScannedMeResponse {
  scanned_me: Paginated<QrScanReceivedItem>;
  total: number;
}
