import axiosInstance from "./axios";

const promotProductApi = async (id: string | number, featured: boolean) => {
  const formdata = new FormData();
  formdata.append("productservice_id", String(id));
  formdata.append("featured", String(featured)); // Convert boolean to string
  return await axiosInstance.post("/productservice/makePromoted", formdata);
};

const unPromotProductApi = async (id: string | number) => {
  const formdata = new FormData();
  formdata.append("productservice_id", String(id));
  return await axiosInstance.post("/productservice/removePromoted", formdata);
};

export { promotProductApi, unPromotProductApi };
