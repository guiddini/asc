import axios from "axios";
import { getAuth } from "../modules/auth";

const axiosInstance = axios.create({
  baseURL: "https://asc.api.eventili.com/api",
  responseType: "json",
  headers: {
    "Content-Type": "multipart/form-data",
    "Access-Control-Allow-Origin": "*",
    Accept: "application/json",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const userAuth = getAuth();
      if (userAuth) {
        config.headers.Authorization = `Bearer ${userAuth}`;
      }
    } catch (error) {
      console.error("Error retrieving token from cookies:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
