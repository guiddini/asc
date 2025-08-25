import axiosInstance from "./axios";

const assingTicketToSelf = async (id: string | number) => {
  return axiosInstance.post(`/ticket/assign`, {
    user_has_ticket_id: id,
  });
};

const assingNewTicket = async (id: string | number) => {
  return axiosInstance.post(`/ticket/assign/new`, {
    user_has_ticket_id: id,
  });
};

const assingTicketToOtherUser = async (id: string | number, email: string) => {
  return axiosInstance.post(`/ticket/gift`, {
    user_has_ticket_id: id,
    email: email,
  });
};

const updateGiftedUserTicket = async (formdata: FormData) => {
  return axiosInstance.post(`/ticket/gift/update`, formdata);
};

const getAllTicketTypeApi = () => {
  return axiosInstance.get("/ticket/all/types");
};

const getUserTickets = (userID: string) => {
  return axiosInstance.get(`/ticket/all/${userID}`);
};

const getAllUnassignedTickets = (userID: string) => {
  return axiosInstance.get(`/ticket/unassigned/${userID}`);
};

const getAssignedTicket = (userID: string) => {
  return axiosInstance.get(`/ticket/assigned/${userID}`);
};

const getGiftedUsersTickets = () => {
  return axiosInstance.get(`/ticket/gifted/users`);
};

const deleteEmailOfGiftedUser = (email: string) => {
  return axiosInstance.post("/ticket/gift/delete", {
    email: email,
  });
};

const addNewTicketsToUser = (data: FormData) => {
  return axiosInstance.post("/user/new/tickets", data);
};

const getAdminUserTickets = (id: string | number) =>
  axiosInstance.post("admin/get/tickets/user", {
    user_id: id,
  });

const assignAdminUserTicket = ({
  id,
  ticket_id,
  fname,
  lname,
}: {
  id: string | number;
  ticket_id: string | number;
  fname: string;
  lname: string;
}) => {
  return axiosInstance.post("admin/assign/ticket/user", {
    user_id: id,
    user_has_ticket_id: ticket_id,
    lname,
    fname,
  });
};

const getAdminUserBadgeApi = (id: string | number) =>
  axiosInstance.post(
    "/admin/get/badge/user",
    {
      user_id: id,
    },
    {
      responseType: "blob",
    }
  );

const getAdminTicketTransactionsApi = async () =>
  await axiosInstance.get("/tickets/transactions/list");

// mails

const resendEmailToGiftedUser = (email: string) => {
  return axiosInstance.post("/emails/resend/gifted/ticket", {
    email: email,
  });
};

const getTicketListApi = async () => await axiosInstance.get("/list/ticket");

const buyTicketApi = async (data: FormData) =>
  await axiosInstance.post("/buy/tickets", data);

const getTicketTransactionApi = async (id: string) =>
  await axiosInstance.get(`/tickets/${id}`);

const sendTicketTransactionEmailApi = async ({
  email,
  transactionId,
}: {
  email: string;
  transactionId: string;
}) =>
  await axiosInstance.post(`/tickets/${transactionId}/send-receipt`, {
    email: email,
  });

const downloadTicketTransactionReceiptApi = async ({
  transactionId,
}: {
  transactionId: string;
}) => {
  return await axiosInstance.post(
    `/tickets/${transactionId}/download-receipt`,
    {
      responseType: "blob", // Important to handle binary data
    }
  );
};

const assignMostExpensiveTicketApi = async () =>
  await axiosInstance.post("/ticket/assign/most-expensive");

const reAssignMostExpensiveTicketApi = async () =>
  await axiosInstance.post("/ticket/reassign/most-expensive");

const adminGiftTicketToOtherUserApi = async (data: {
  user_id: string;
  user_has_ticket_id: string;
  gifter_email: string;
}) => await axiosInstance.post("/ticket/gift/assign", data);

const adjustTicketApi = async (email: string) =>
  await axiosInstance.post("/adjust/ticket", {
    email,
  });

export {
  getAllTicketTypeApi,
  assingTicketToSelf,
  getUserTickets,
  assingTicketToOtherUser,
  getAssignedTicket,
  getAllUnassignedTickets,
  getGiftedUsersTickets,
  resendEmailToGiftedUser,
  updateGiftedUserTicket,
  deleteEmailOfGiftedUser,
  assingNewTicket,
  addNewTicketsToUser,
  getAdminUserTickets,
  assignAdminUserTicket,
  getAdminUserBadgeApi,
  getTicketListApi,
  buyTicketApi,
  getTicketTransactionApi,
  sendTicketTransactionEmailApi,
  downloadTicketTransactionReceiptApi,
  getAdminTicketTransactionsApi,
  assignMostExpensiveTicketApi,
  reAssignMostExpensiveTicketApi,
  adminGiftTicketToOtherUserApi,
  adjustTicketApi,
};
