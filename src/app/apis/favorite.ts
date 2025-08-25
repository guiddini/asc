import axiosInstance from "./axios";

const getAllFavoriteProducts = async (user_id: string) => {
  return axiosInstance.get(`/favorite/products/${user_id}`);
};

const getAllFavoriteUsers = async (user_id: string) => {
  return axiosInstance.get(`/favorite/users/${user_id}`);
};

const getAllFavoritePosts = async (user_id: string) => {
  return axiosInstance.get(`/favorite/posts/${user_id}`);
};

export { getAllFavoritePosts, getAllFavoriteProducts, getAllFavoriteUsers };
