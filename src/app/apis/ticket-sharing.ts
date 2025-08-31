import axiosInstance from "./axios";

const createShareTicketApi = async (data: FormData) =>
  await axiosInstance.post("/ticket/share/create", data);

const getSharedTicketByIdApi = async (id: string) =>
  await axiosInstance.get(`/ticket/share/show/${id}`);

const getSharedTicketListApi = async () =>
  await axiosInstance.get("/ticket/share/my");

const takeSharedTicketApi = async (data: FormData) =>
  await axiosInstance.post("/ticket/share/take", data);

const switchSharedTicketStatusApi = async (ticket_sharing_link_id: string) =>
  await axiosInstance.post("/ticket/share/switch/status", {
    ticket_sharing_link_id,
  });

export {
  createShareTicketApi,
  getSharedTicketListApi,
  getSharedTicketByIdApi,
  takeSharedTicketApi,
  switchSharedTicketStatusApi,
};
