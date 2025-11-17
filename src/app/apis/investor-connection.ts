import axiosInstance from "./axios";
import {
  InvestorConnectionsResponse,
  InvestorConnectionWithRelations,
  CreateInvestorConnectionRequest,
  InvestorConnection,
} from "../types/investor-connection";

export const listInvestorConnections = async (params?: {
  investor_id?: string;
  startup_id?: string;
}): Promise<InvestorConnectionsResponse> => {
  const res = await axiosInstance.get("/investor-connections", { params });
  return res.data;
};

export const showInvestorConnection = async (
  id: string
): Promise<InvestorConnectionWithRelations> => {
  const res = await axiosInstance.get(`/investor-connections/${id}`);
  return res.data;
};

export const createInvestorConnection = async (
  payload: CreateInvestorConnectionRequest
): Promise<InvestorConnection> => {
  const res = await axiosInstance.post("/investor-connections", payload);
  return res.data;
};

export const myInvestorConnections =
  async (): Promise<InvestorConnectionsResponse> => {
    const res = await axiosInstance.get("/investor-connections/investor");
    return res.data;
  };

export const interestedForStartup =
  async (): Promise<InvestorConnectionsResponse> => {
    const res = await axiosInstance.get("/investor-connections/startup");
    return res.data;
  };
