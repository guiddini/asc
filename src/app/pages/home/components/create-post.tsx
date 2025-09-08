import { useState } from "react";
import { useForm } from "react-hook-form";
import SelectMediaModal from "./select-media-modal";
import SelectedMediaList from "./selected-media-list";
import { useDispatch, useSelector } from "react-redux";
import { createPostType } from "../../../types/posts";
import { addPost, updatePostId } from "../../../features/postsSlice";
import { Button, Spinner } from "react-bootstrap";
import { useMutation } from "react-query";
import { createPostApi } from "../../../apis";
import getMediaUrl from "../../../helpers/getMediaUrl";
import { yupResolver } from "@hookform/resolvers/yup";
import { createPostSchema } from "../validation/postValidation";
import { errorMessage } from "../../../helpers/errorMessage";
import { UserResponse } from "../../../types/reducers";

const CreatePost = () => {
  const { user } = useSelector((state: UserResponse) => state.user);
  const {
    control,
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors },
  } = useForm<createPostType>({
    defaultValues: {
      media: [],
      description: "",
      comments: [],
      likes: [],
      saves: [],
    },
    resolver: yupResolver(createPostSchema) as any,
  });

  const dispatch = useDispatch();

  const [isSelectMediaOpen, setIsSelectMediaOpen] = useState<boolean>(false);

  const { mutate, isLoading, isSuccess } = useMutation({
    mutationKey: ["create-post"],
    mutationFn: (data: FormData) => createPostApi(data),
  });

  const createPostFn = (data: createPostType) => {
    let tempPostID = Math.random();
    const formdata = new FormData();
    formdata.append("description", data.description);
    if (data?.media !== null) {
      data?.media.forEach((media, index) => {
        formdata.append(`mediaTempIds[${index}]`, String(media?.id));
      });
    }

    const req = {
      comments: [],
      created_at: new Date(),
      updated_at: new Date(),
      description: data.description,
      likes: [],
      id: tempPostID,
      has_media: data?.media?.length > 0 ? "1" : "0",
      user: {
        avatar: user?.avatar,
        created_at: "",
        email: user?.email,
        email_verified_at: null,
        fname: user?.fname,
        id: user?.id,
        lname: user?.lname,
        ticket_count: user?.ticket_count,
        updated_at: "",
        user_has_ticket_id: user?.user_has_ticket_id,
      },
      user_id: user?.id,
    };

    dispatch(addPost(req));

    mutate(formdata, {
      onSuccess(data, variables, context) {
        const realPostId = data?.data?.success?.id;
        dispatch(
          updatePostId({
            tempPostId: tempPostID,
            realPostId: realPostId,
          })
        );
        // refetchPosts();
        reset({
          description: "",
          media: [
            {
              file: null,
              id: 0,
            },
          ],
          comments: [],
          likes: [],
          saves: [],
        });
      },
      onError(error, variables, context) {},
    });
  };

  const [uploadedMedia, setUploadedMedia] = useState<string[]>([]);

  return (
    <>
      <div className="card card-flush mb-10">
        <div className="card-header justify-content-start align-items-center pt-4">
          <div className="symbol symbol-45px me-5">
            <img
              src={getMediaUrl(user.avatar)}
              className="object-fit-cover"
              alt=""
            />
          </div>
        </div>

        <div className="card-body pt-2 pb-0">
          <textarea
            className="form-control bg-transparent border-0 px-0 mb-6"
            id="kt_social_feeds_post_input"
            name="message"
            data-kt-autosize="true"
            placeholder="What's new?!"
            {...register("description")}
          />
          {errorMessage(errors, "description")}

          {isSuccess ? (
            <></>
          ) : (
            <SelectedMediaList
              setUploadedMedia={setUploadedMedia}
              control={control as any}
              setValue={setValue}
            />
          )}
        </div>

        <div className="card-footer d-flex justify-content-end pt-0">
          <div className="">
            <button
              className="btn btn-icon btn-sm btn-color-gray-500 btn-active-color-primary w-25px p-0"
              onClick={() => {
                setIsSelectMediaOpen(true);
              }}
            >
              <i className="ki-outline ki-paper-clip fs-1"></i>
            </button>
          </div>

          <Button
            variant="custom-purple-dark text-white"
            // className="btn btn-icon btn-sm bg-primary btn-active-color-primary w-25px p-0"
            onClick={handleSubmit(createPostFn)}
            disabled={isLoading}
          >
            {isLoading ? <Spinner animation="border" size="sm" /> : "Post"}
          </Button>
        </div>
      </div>

      <SelectMediaModal
        isOpen={isSelectMediaOpen}
        setIsOpen={setIsSelectMediaOpen}
        control={control as any}
        setValue={setValue}
        setUploadedMedia={setUploadedMedia}
        uploadedMedia={uploadedMedia}
      />
    </>
  );
};

export default CreatePost;
