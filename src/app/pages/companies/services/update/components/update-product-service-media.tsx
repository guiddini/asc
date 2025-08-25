import { Control, useWatch } from "react-hook-form";
import { useQuery } from "react-query";
import { findMediaApi, uploadImageApi } from "../../../../../apis";
import { useMemo, useState } from "react";
import MediaCard from "./media-card";
import { Row } from "react-bootstrap";
import SelectedMediaList from "../../../../home/components/selected-media-list";
import { uploadMediaResponseType } from "../../../../../types/posts";
import toast from "react-hot-toast";
import { Dropzone } from "../../../../../components";

export type MediaProps = {
  id: number;
  mediable_id: string;
  mediable_type: string;
  name: string;
  path: string;
  size: string;
  type: string;
};

const UpdateProductServiceMedia = ({
  DATA,
  productID,
  control,
  errors,
  setValue,
  resetField,
}: {
  DATA: any;
  productID: string;
  control: Control;
  errors: any;
  setValue: any;
  resetField: any;
}) => {
  const { data, refetch } = useQuery({
    queryFn: () => findMediaApi(productID),
    queryKey: ["media-api", productID],
  });

  const formdata = useWatch({
    control: control,
  });

  const MEDIA: MediaProps[] = useMemo(() => data?.data, [data]);

  const productsMedia = formdata?.media || [];

  const [uploadedMedia, setUploadedMedia] = useState<string[]>([]);

  // const productsMedia = useMemo(() => formdata?.media, [uploadedMedia]);

  const selectMedia = ({ file, id }: { file: File; id: number | null }) => {
    setValue("media", [
      ...productsMedia,
      {
        file: file,
        id: id,
      },
    ]);
  };

  const onDrop = async (acceptedFiles: File[]) => {
    let mediaArray = [];
    acceptedFiles?.forEach(async (file) => {
      if (!uploadedMedia.includes(file.name)) {
        selectMedia({
          file: file,
          id: null,
        });
        await uploadImageApi(file)
          .then(({ data }: { data: uploadMediaResponseType }) => {
            setUploadedMedia((prev) => [...prev, file.name]);
            mediaArray.push({
              file: file,
              id: data.mediaTemp?.id,
            });
            setValue("media", [...productsMedia, ...mediaArray]);
          })
          .catch((error) => {});
      } else {
        toast.error("File already uploaded");
      }
    });
  };

  return (
    <>
      <div className="card mb-4">
        <div className="card-body">
          <div className="card-title fs-3">{DATA?.type} media :</div>

          {MEDIA?.length > 0 ? (
            <Row className="gap-2">
              {MEDIA?.map((media) => (
                <MediaCard file={media} refetch={refetch} />
              ))}
            </Row>
          ) : (
            <div className="d-flex h-300px align-items-center justify-content-center">
              <span>The {DATA?.type} has no image </span>
            </div>
          )}
        </div>
      </div>

      <div className="card card-flush py-4">
        <div className="card-header">
          <div className="card-title">
            <h2>Les médias</h2>
          </div>
        </div>
        <div className="card-body pt-0">
          <div className="fv-row mb-2">
            <Dropzone
              dropzone={{
                accept: {
                  "image/jpeg": [],
                  "image/png": [],
                },
                multiple: true,
                onDrop: onDrop,
                onError(err) {},
                onDropRejected(fileRejections, event) {
                  fileRejections?.forEach((file) => {
                    toast.error(`The selected file is not supported`);
                  });
                },
              }}
              description="Seules les images, les vidéos et les documents sont acceptés"
            />

            <SelectedMediaList
              // setPostMedia={setUploadedMedia}
              setUploadedMedia={setUploadedMedia}
              control={control as any}
              setValue={setValue}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateProductServiceMedia;
