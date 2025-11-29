import {
  MyLogsResponse,
  CompanyVisitorsResponse,
  UserLogsResponse,
  AllLogsParams,
  AllLogsResponse,
  MyScannedLogsResponse,
  WhoScannedMeResponse,
} from "../types/qr-code";
import axiosInstance from "./axios";

// Me: combined networking & exhibition logs (arrays, latest first)
export const getMyQrLogsApi = async (): Promise<MyLogsResponse> => {
  const { data } = await axiosInstance.get<MyLogsResponse>("/me/qr-logs");
  return data;
};

// Me: my company visitors (staff only, paginated)
export const getMyCompanyVisitorsApi = async (params?: {
  page?: number;
  per_page?: number;
}): Promise<CompanyVisitorsResponse> => {
  const { data } = await axiosInstance.get<CompanyVisitorsResponse>(
    "/me/company/visitors",
    { params }
  );
  return data;
};

// Admin: user logs (who scanned him + who he scanned), paginated
export const getUserQrLogsApi = async (
  userId: string,
  params?: { page?: number; per_page?: number }
): Promise<UserLogsResponse> => {
  const { data } = await axiosInstance.get<UserLogsResponse>(
    `/qr-logs/user/${userId}`,
    { params }
  );
  return data;
};

// Admin: company visitors, paginated
export const getCompanyVisitorsApi = async (
  companyId: string,
  params?: { page?: number; per_page?: number }
): Promise<CompanyVisitorsResponse> => {
  const { data } = await axiosInstance.get<CompanyVisitorsResponse>(
    `/qr-logs/company/${companyId}`,
    { params }
  );
  return data;
};

// Admin: all logs with filters, paginated
export const getAllQrLogsApi = async (
  params?: AllLogsParams
): Promise<AllLogsResponse> => {
  const { data } = await axiosInstance.get<AllLogsResponse>("/qr-logs", {
    params,
  });
  return data;
};

// NEW: Who I scanned — networking users only (paginated)
export const getMyScannedLogsApi = async (params?: {
  page?: number;
  per_page?: number;
}): Promise<MyScannedLogsResponse> => {
  const { data } = await axiosInstance.get<MyScannedLogsResponse>(
    "/me/scans/i-did",
    { params }
  );
  return data;
};

// NEW: Who scanned me — networking users only (paginated)
export const getWhoScannedMeApi = async (params?: {
  page?: number;
  per_page?: number;
}): Promise<WhoScannedMeResponse> => {
  const { data } = await axiosInstance.get<WhoScannedMeResponse>(
    "/me/scans/received",
    { params }
  );
  return data;
};
