import React, { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addReply } from "../../../features/postsSlice";
import { UserResponse } from "../../../types/reducers";

interface CommentReplyProps {
  postID: number;
  commentID: number;
  setShowReplyBox: Dispatch<SetStateAction<boolean>>;
}

const CommentReplyBox: React.FC<CommentReplyProps> = ({
  commentID,
  postID,
  setShowReplyBox,
}) => {
  const { user } = useSelector((state: UserResponse) => state.user);

  const { register, handleSubmit, reset, watch } = useForm<{
    reply: string;
  }>({
    defaultValues: {
      reply: "",
    },
  });

  const dispatch = useDispatch();

  const postReply = (data: { reply: string }) => {
    dispatch(
      addReply({
        postId: postID,
        commentId: commentID,
        description: data.reply,
        user: user,
      })
    );
    setShowReplyBox(false);
  };

  return (
    <div
      className="d-flex align-items-center my-6"
      style={{
        marginLeft: "auto",
        width: "90%",
      }}
    >
      <div className="symbol symbol-35px me-3">
        <img src="public/media/avatars/300-3.jpg" alt="" />
      </div>

      <div className="position-relative w-100">
        <textarea
          className="form-control form-control-solid border ps-5"
          data-kt-autosize="true"
          placeholder="Write your reply"
          {...register("reply")}
        />

        <div className="position-absolute top-0 end-0 translate-middle-x mt-1 me-n0">
          <button
            // disabled={
            //   watch("comment")?.length === 0 ||
            //   watch("comment") === undefined
            // }
            onClick={handleSubmit(postReply)}
            className="btn btn-icon btn-sm btn-color-gray-500 btn-active-color-primary w-25px p-0"
          >
            <i className="fa-solid fa-paper-plane fs-2"></i>
          </button>

          {/* <button className="btn btn-icon btn-sm btn-color-gray-500 btn-active-color-primary w-25px p-0">
                <i className="ki-outline ki-paper-clip fs-2"></i>
              </button>

              <button className="btn btn-icon btn-sm btn-color-gray-500 btn-active-color-primary w-25px p-0">
                <i className="ki-outline ki-like fs-2"></i>
              </button>

              <button className="btn btn-icon btn-sm btn-color-gray-500 btn-active-color-primary w-25px p-0">
                <i className="ki-outline ki-badge fs-2"></i>
              </button>

              <button className="btn btn-icon btn-sm btn-color-gray-500 btn-active-color-primary w-25px p-0">
                <i className="ki-outline ki-geolocation fs-2"></i>
              </button> */}
        </div>
      </div>
    </div>
  );
};

export default CommentReplyBox;
