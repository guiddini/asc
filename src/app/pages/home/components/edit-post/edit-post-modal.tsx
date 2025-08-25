import React, { useState } from "react";
import { MediaPostProps } from "../post-box";
import { Button, Modal, Row, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { updatePostApi, uploadImageApi } from "../../../../apis";
import { uploadMediaResponseType } from "../../../../types/posts";
import toast from "react-hot-toast";
import { Dropzone } from "../../../../components";
import SelectedMediaList from "../selected-media-list";
import { useDispatch, useSelector } from "react-redux";
import { PostsReducer } from "../../../../types/reducers";
import MediaCard from "../../../companies/services/update/components/media-card";
import PostMediaCard from "./post-media-card";
import { useMutation } from "react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { createPostSchema } from "../../validation/postValidation";
import { errorMessage } from "../../../../helpers/errorMessage";
import { updatePost } from "../../../../features/postsSlice";

interface EditPostModalProps {
  postId: string | number | null;
  setPostId: (e: string | null) => void;
  postMedia: MediaPostProps[];
  setPostMedia: any;
  isOpen: boolean;
}

interface EditPostDataProps {
  media: {
    file: File;
    id: string | number;
  }[];
  description: string;
}

const EditPostModal: React.FC<EditPostModalProps> = ({
  postId,
  postMedia,
  setPostId,
  setPostMedia,
  isOpen,
}) => {
  const dispatch = useDispatch();

  const POST = useSelector((state: PostsReducer) =>
    state.posts?.posts?.find((post) => post?.id === postId)
  );

  const { mutate, isLoading } = useMutation({
    mutationKey: ["update-post", postId],
    mutationFn: async (data: {
      post_id: string | number;
      description: string;
      media: string[];
    }) => {
      await updatePostApi(data);
    },
  });

  const closeModal = () => {
    setPostId(null);
  };

  const {
    control,
    watch,
    formState: { errors },
    setValue,
    register,
    handleSubmit,
  } = useForm<EditPostDataProps>({
    defaultValues: {
      description: POST?.description,
      media: [],
    },
    resolver: yupResolver(createPostSchema) as any,
  });

  const [uploadedMedia, setUploadedMedia] = useState<string[]>([]);

  const media = watch("media") || [];

  const selectMedia = ({ file, id }: { file: File; id: number | null }) => {
    setValue("media", [
      ...media,
      {
        file: file,
        id: id,
      },
    ]);
  };

  const onDrop = async (acceptedFiles: File[]) => {
    let mediaArray = [];
    acceptedFiles?.forEach(async (file) => {
      selectMedia({
        file: file,
        id: null,
      });
      if (!uploadedMedia.includes(file.name)) {
        await uploadImageApi(file)
          .then(({ data }: { data: uploadMediaResponseType }) => {
            setUploadedMedia((prev) => [...prev, file.name]);
            mediaArray.push({
              file: file,
              id: data.mediaTemp?.id,
            });
            setValue("media", [...media, ...mediaArray]);
          })
          .catch((error) => {});
      } else {
      }
    });
  };

  const handleUpdatePost = (data: EditPostDataProps) => {
    const req = {
      post_id: postId,
      description: data?.description,
      media: data?.media?.map((e) => e.id) as string[],
    };

    mutate(req, {
      onSuccess(res, variables, context) {
        toast.success("La publication a été mise à jour avec succès");
        dispatch(
          updatePost({
            postId: postId,
            newPost: {
              ...POST,
              description: data?.description,
            },
          })
        );
      },
      onError(error, variables, context) {
        toast.error("Erreur lors de la mise à jour du post");
      },
    });
  };

  return (
    <Modal
      show={isOpen}
      onHide={() => {
        setPostId(null);
      }}
      backdrop={true}
      id="kt_modal_create_app"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-900px"
    >
      <Modal.Header>
        <Modal.Title>Editer la publication :</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <textarea
          className="form-control bg-transparent px-0 mb-6 px-4"
          id="kt_social_feeds_post_input"
          name="message"
          data-kt-autosize="true"
          placeholder="Quoi de neuf ?!"
          {...register("description")}
        />
        {errorMessage(errors, "description")}

        {postMedia?.length > 0 ? (
          <Row className="my-4">
            <h2>Images de publication</h2>
            <Row className="gap-2">
              {postMedia?.map((media, index) => (
                <PostMediaCard
                  file={media}
                  setPostMedia={setPostMedia}
                  postMedia={postMedia}
                  key={index}
                />
              ))}
            </Row>
          </Row>
        ) : (
          <></>
        )}

        <Row className="mt-8">
          <h2>Ajouter de nouvelles images</h2>
          <Dropzone
            description="Sélectionner des fichiers (images)"
            dropzone={{
              accept: {
                "image/jpeg": [],
                "image/png": [],
                "image/jpg": [],
              },
              multiple: true,
              onDrop: onDrop,
              onError(err) {},
              onDropRejected(fileRejections, event) {
                fileRejections?.forEach((file) => {
                  toast.error(`Le fichier sélectionné n'est pas supporté`);
                });
              },
            }}
          />
        </Row>

        <SelectedMediaList
          control={control as any}
          setValue={setValue}
          setUploadedMedia={setUploadedMedia}
        />
      </Modal.Body>

      <Modal.Footer className="d-flex flex-row align-items-center justify-content-between">
        <Button className="" onClick={closeModal}>
          Fermer
        </Button>
        <Button
          variant="success"
          onClick={handleSubmit(handleUpdatePost)}
          disabled={isLoading}
        >
          {isLoading ? <Spinner animation="border" size="sm" /> : "Soumettre"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditPostModal;
