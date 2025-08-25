import { useMutation } from "react-query";
import { deleteTempMediaApi, uploadImageApi } from "../apis";
import { useCallback } from "react";

export const useMedia = () => {
  const { mutate: uploadMedia, isLoading: isUploadingMedia } = useMutation({
    mutationKey: ["upload-temp-media"],
    mutationFn: useCallback(
      async (media: File) => await uploadImageApi(media),
      []
    ),
  });

  const { mutate: deleteTempMedia, isLoading: isDeletingTempMedia } =
    useMutation({
      mutationKey: ["delete-temp-media"],
      mutationFn: (mediaTempId: number | string) =>
        deleteTempMediaApi(mediaTempId),
    });

  return {
    uploadMedia,
    isUploadingMedia,
    deleteTempMedia,
    isDeletingTempMedia,
  };
};
