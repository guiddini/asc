import axiosInstance from "./axios";

const getAllPostsApi = async ({ offset }: { offset: string | number }) => {
  return axiosInstance.get(`/post/all/${offset}`);
};

const getOnePostApi = async (post_id: string | number) => {
  return axiosInstance.get(`/post/${post_id}`);
};

const getUserPostsApi = async (user_id: string | number) => {
  return axiosInstance.get(`/post/user/${user_id}`);
};

const getUserPostsCountApi = async (user_id: string | number) => {
  return axiosInstance.get(`/post/count/user/${user_id}`);
};

const createPostApi = async (data: FormData) => {
  return axiosInstance.post("/post/create", data);
};

const updatePostApi = async (data: {
  post_id: string | number;
  description: string;
  media: string[];
}) => {
  const formdata = new FormData();
  formdata.append("post_id", String(data.post_id));
  formdata.append("description", data.description);

  data?.media?.forEach((media, index) => {
    formdata.append(`mediaTempIds[${index}]`, String(media));
  });

  return axiosInstance.post("/post/update", formdata);
};

const deletePostApi = async (post_id: string | number) => {
  const formdata = new FormData();
  formdata.append("post_id", String(post_id));
  return axiosInstance.post("/post/delete", formdata);
};

const uploadImageApi = async (media: File) => {
  const formdata = new FormData();
  formdata.append("media", media);
  return axiosInstance.post("/media/temp/upload", formdata);
};

const deleteTempMediaApi = async (id: number | string) => {
  const formdata = new FormData();
  formdata.append("mediaTempId", String(id));

  return axiosInstance.post("/media/temp/delete", formdata);
};

// likes

const likePostApi = ({ likable_id }: { likable_id: string | number }) => {
  const formdata = new FormData();
  formdata.append("likable_id", String(likable_id));
  formdata.append("likable_type", "post");

  return axiosInstance.post("/like", formdata);
};

const unlikePostApi = ({ likable_id }: { likable_id: string | number }) => {
  const formdata = new FormData();
  formdata.append("likable_id", String(likable_id));

  return axiosInstance.post("/unlike", formdata);
};

// comments
const createCommentPostApi = ({
  post_id,
  content,
}: {
  post_id: string | number;
  content: string;
}) => {
  const formdata = new FormData();
  formdata.append("commentable_id", String(post_id));
  formdata.append("commentable_type", "post");
  formdata.append("content", content);

  return axiosInstance.post("/comment", formdata);
};

const updateCommentPostApi = ({
  comment_id,
  content,
}: {
  comment_id: string | number;
  content: string;
}) => {
  const formdata = new FormData();
  formdata.append("comment_id", String(comment_id));
  formdata.append("content", String(content));

  return axiosInstance.post("/comment/update", formdata);
};

const removeCommentPostApi = ({
  comment_id,
}: {
  comment_id: string | number;
}) => {
  const formdata = new FormData();
  formdata.append("comment_id", String(comment_id));

  return axiosInstance.post("/uncomment", formdata);
};

export {
  getAllPostsApi,
  getOnePostApi,
  getUserPostsApi,
  getUserPostsCountApi,
  createPostApi,
  uploadImageApi,
  deleteTempMediaApi,
  updatePostApi,
  deletePostApi,
  likePostApi,
  unlikePostApi,
  createCommentPostApi,
  removeCommentPostApi,
  updateCommentPostApi,
};
