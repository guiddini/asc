import { Control, UseFormSetValue, useWatch } from "react-hook-form";
import SelectedMedia from "./selected-media";
import { Row } from "react-bootstrap";
import { useMedia } from "../../../hooks";
import React from "react";

interface SelectedMediaListProps {
  control: Control;
  setValue: UseFormSetValue<any>;
  setUploadedMedia: React.Dispatch<React.SetStateAction<string[]>>;
}

const SelectedMediaList = ({
  control,
  setValue,
  setUploadedMedia,
}: SelectedMediaListProps) => {
  const formdata = useWatch({
    control: control,
  });

  const { deleteTempMedia } = useMedia();

  const media: { file: File; id: number | null }[] = formdata?.media || [];

  const removeSelectedMedia = (file: File, id: number | string) => {
    deleteTempMedia(id, {
      onSuccess() {
        const removedSelectedMediaRes = media?.filter(
          (file) => file?.id !== id
        );

        setValue("media", removedSelectedMediaRes);
        setUploadedMedia((prev) => prev.filter((e) => e !== file.name));
      },
      onError(error, variables, context) {},
    });
  };

  return (
    <Row xs={12} md={12} className="my-3 gap-3">
      {media?.length > 0 ? (
        <>
          {media?.map(({ file, id }) => {
            if (file) {
              return (
                <SelectedMedia
                  file={file}
                  id={id}
                  remove={(e) => {
                    e?.preventDefault();
                    removeSelectedMedia(file, id);
                  }}
                />
              );
            }
          })}
        </>
      ) : (
        <></>
      )}
    </Row>
  );
};

export default SelectedMediaList;
