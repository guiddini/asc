import axiosInstance from "./axios";

const postReportApi = async (params: {
  reportable_id: string;
  reportable_type: string;
}) => {
  const formdata = new FormData();
  formdata.append("reportable_id", params.reportable_id);
  formdata.append("reportable_type", params.reportable_type);
  return await axiosInstance.post("/report", formdata);
};

const getAllReports = async () => await axiosInstance.get("/report/all");

const getReportDataApi = async (reportable_id: string) => {
  return await axiosInstance.get(`/report/${reportable_id}`);
};

export { postReportApi, getAllReports, getReportDataApi };
