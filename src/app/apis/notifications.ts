import axiosInstance from "./axios";

const getAllNotifications = async ({ offset }: { offset: string | number }) => {
  return await axiosInstance.get(`/notifications/getAll/${offset}`);
};

const markNotificationAsSeen = async ({
  notificiationIDS,
}: {
  notificiationIDS: string[];
}) => {
  const formdata = new FormData();
  notificiationIDS.forEach((notificationID, index) =>
    formdata.append(`notifications[${index}]`, notificationID)
  );
  return await axiosInstance.post("/notification/seen", formdata);
};

export { getAllNotifications, markNotificationAsSeen };
