const getMediaUrl = (path: any) => {
  if (typeof path !== "string") {
    return "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
  }
  const link = `${import.meta.env.VITE_APP_STORAGE_URL}${path}`;

  return link;
};

export default getMediaUrl;
