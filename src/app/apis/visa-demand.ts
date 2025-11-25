import axiosInstance from "./axios";
import {
  VisaDemandsIndexRequest,
  VisaDemandsIndexResponse,
  ShowVisaDemandRequest,
  ShowVisaDemandResponse,
  CreateVisaDemandRequest,
  CreateVisaDemandResponse,
  EditVisaDemandRequest,
  EditVisaDemandResponse,
  DeleteVisaDemandRequest,
  DeleteVisaDemandResponse,
  AcceptVisaDemandRequest,
  AcceptVisaDemandResponse,
  RefuseVisaDemandRequest,
  RefuseVisaDemandResponse,
  CancelVisaDemandRequest,
  CancelVisaDemandResponse,
  GetUserVisaDemandResponse,
} from "../types/visa-demand";

// List visa demands (optionally filter by status only admin)
export const getVisaDemands = async (
  params?: VisaDemandsIndexRequest
): Promise<VisaDemandsIndexResponse> => {
  const res = await axiosInstance.get("/visa-demands", { params });
  return res.data;
};

// Show a single demand (requires POST with demand_id)
export const showVisaDemand = async (
  payload: ShowVisaDemandRequest
): Promise<ShowVisaDemandResponse> => {
  const res = await axiosInstance.post("/visa-demands/show", payload);
  return res.data;
};

// Convenience wrapper to show by ID
export const showVisaDemandById = async (
  demand_id: string
): Promise<ShowVisaDemandResponse> => {
  const res = await axiosInstance.post("/visa-demands/show", { demand_id });
  return res.data;
};

// Create a new demand
export const createVisaDemand = async (
  payload: CreateVisaDemandRequest
): Promise<CreateVisaDemandResponse> => {
  const res = await axiosInstance.post("/visa-demands/create", payload);
  return res.data;
};

// Edit an existing demand (must be pending)
export const editVisaDemand = async (
  payload: EditVisaDemandRequest
): Promise<EditVisaDemandResponse> => {
  const res = await axiosInstance.post("/visa-demands/edit", payload);
  return res.data;
};

// Delete a demand (admin and owner)
export const deleteVisaDemand = async (
  payload: DeleteVisaDemandRequest
): Promise<DeleteVisaDemandResponse> => {
  const res = await axiosInstance.post("/visa-demands/delete", payload);
  return res.data;
};

// Accept a demand (admin/operator flow)
export const acceptVisaDemand = async (
  payload: AcceptVisaDemandRequest
): Promise<AcceptVisaDemandResponse> => {
  const res = await axiosInstance.post("/visa-demands/accept", payload);
  return res.data;
};

// Refuse a demand (admin/operator flow)
export const refuseVisaDemand = async (
  payload: RefuseVisaDemandRequest
): Promise<RefuseVisaDemandResponse> => {
  const res = await axiosInstance.post("/visa-demands/refuse", payload);
  return res.data;
};

// Cancel a demand (owner)
export const cancelVisaDemand = async (
  payload: CancelVisaDemandRequest
): Promise<CancelVisaDemandResponse> => {
  const res = await axiosInstance.post("/visa-demands/cancel", payload);
  return res.data;
};

export const getUserVisaDemand =
  async (): Promise<GetUserVisaDemandResponse> => {
    const res = await axiosInstance.get("/visa-demands/user");
    return res.data;
  };

export const downloadVisaDemand = async (demand_id: string): Promise<Blob> => {
  const res = await axiosInstance.get(`/visa-demands/downloadForVisitor`, {
    data: { demand_id },
    responseType: "blob",
  });
  return res.data;
};
