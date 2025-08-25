import axiosInstance from "./axios";

const registerOnPressConferenceApi = async (data: FormData) =>
  await axiosInstance.post("/press/register", data);

const listAllPressConferenceRegistrationsApi = async () =>
  await axiosInstance.get(`/press/list`);

const acceptPressConferenceRegistration = async (registration_id: string) =>
  await axiosInstance.post("/press/accept", {
    registration_id,
  });

const rejectPressConferenceRegistration = async (registration_id: string) =>
  await axiosInstance.post("/press/refuse", {
    registration_id,
  });

const downloadPressConferenceInvitation = async (registration_id: string) => {
  return await axiosInstance.post(
    `/press/download`,
    {
      registration_id,
    },
    {
      responseType: "blob",
    }
  );
};

export {
  registerOnPressConferenceApi,
  listAllPressConferenceRegistrationsApi,
  acceptPressConferenceRegistration,
  rejectPressConferenceRegistration,
  downloadPressConferenceInvitation,
};
