import axiosInstance from "./axios";

export type KycStatus = "pending" | "accepted" | "refused";
export type KycDecision = "accepted" | "refused";

export type KycInfoResponse = {
  identity_number: string | null;
  identity_path: string | null;
  identity_url: string | null;
  passport_number: string | null;
  passport_path: string | null;
  passport_url: string | null;
  kyc_status?: KycStatus | null;
};

export const showUserKyc = async (
  userId: string | number
): Promise<KycInfoResponse> => {
  const res = await axiosInstance.get(`/users/${userId}/kyc`);
  return res.data;
};

export const serveKycFile = async (url: string): Promise<Blob> => {
  const res = await axiosInstance.get(url, {
    responseType: "blob",
  });
  return res.data;
};

export const setKycStatus = async (
  userId: string | number,
  status: KycDecision
): Promise<{ kyc_status: KycStatus }> => {
  const res = await axiosInstance.post(`/users/${userId}/kyc/status`, {
    status,
  });
  return res.data;
};

export const exportUsersCsv = async (
  onlyKyc: boolean = false
): Promise<Blob> => {
  const res = await axiosInstance.post(
    "/user/export",
    { only_kyc: onlyKyc },
    { responseType: "blob" }
  );
  return res.data;
};

export const downloadUsersCsv = async (
  onlyKyc: boolean = false,
  filename: string = "users_export.csv"
): Promise<void> => {
  const blob = await exportUsersCsv(onlyKyc);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};
