import React, { useEffect, useRef, useState } from "react";
import { CommentType } from "../../../types/posts";
import { KTIcon } from "../../../../_metronic/helpers";
import { useDispatch, useSelector } from "react-redux";
import {
  addCommentAtIndex,
  deleteComment,
  editComment,
} from "../../../features/postsSlice";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import getMediaUrl from "../../../helpers/getMediaUrl";
import TimeAgo from "react-timeago";
import frenchStrings from "react-timeago/lib/language-strings/fr";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { Link } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useFeed from "../hooks/useFeed";
import { DescriptionWithLinks } from "./post-box";
import { UserResponse } from "../../../types/reducers";

const MySwal = withReactContent(Swal);

const formatter = buildFormatter(frenchStrings);

interface CommentProps {
  comment: CommentType;
  // setShowReplyBox: Dispatch<SetStateAction<boolean>>;
  // showReplyBox: boolean;
  postID: string | number;
  i: number;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  // setShowReplyBox,
  // showReplyBox,
  postID,
  i,
}) => {
  const { user } = useSelector((state: UserResponse) => state.user);
  const { deleteCommentMutate, loadingDeleteComment, updateCommentMutate } =
    useFeed();
  const { handleSubmit, setValue } = useForm<{ comment: string }>();

  const dispatch = useDispatch();
  const [commentEditable, setCommentEditable] = useState<boolean>(false);

  const commentTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (commentEditable && commentTextRef.current) {
      commentTextRef.current.focus();
    }
  }, [commentEditable]);

  const editCommentFunction = (data: { comment: string }) => {
    updateCommentMutate(
      {
        content: data.comment,
        id: comment.id,
      },
      {
        onSuccess() {
          dispatch(
            editComment({
              commentId: comment.id,
              postId: postID,
              newDescription: data.comment,
            })
          );
        },
        onError(error) {},
      }
    );
  };

  const handleContentEditableChange = () => {
    if (commentTextRef.current) {
      setValue("comment", commentTextRef.current.innerText);
    }
  };

  const handleDeleteComment = async () => {
    MySwal.fire({
      title: "Êtes-vous sûr de vouloir supprimer ?",
      icon: "error",
      heightAuto: false,
      cancelButtonText: "Annuler",
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      backdrop: true,
      showLoaderOnConfirm: loadingDeleteComment,
      showConfirmButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        let deletedComment = comment;
        dispatch(
          deleteComment({
            postId: postID,
            commentId: comment?.id,
          })
        );
        MySwal.showLoading();

        deleteCommentMutate(
          {
            comment_id: comment?.id,
          },
          {
            onError(error) {
              toast.error("Error while removing comment");
              dispatch(
                addCommentAtIndex({
                  postId: deletedComment?.commentable_id,
                  comment: deletedComment,
                  index: i,
                })
              );
            },
            onSuccess() {
              MySwal.hideLoading();
              toast.success("Le comment a été supprimé avec succès !");
              deletedComment = null;
            },
          }
        );
      }
    });
  };

  return (
    <>
      <div className="d-flex pt-6">
        <div className="symbol symbol-45px me-5">
          <img src={getMediaUrl(comment?.commenter?.avatar)} alt="" />
        </div>

        <div className="d-flex flex-column flex-row-fluid">
          <div className="d-flex align-items-center flex-wrap mb-0">
            <div className="d-flex flex-column flex-row-fluid">
              <Link
                to={`/profile/${comment?.commenter?.id}`}
                className="text-gray-800 text-hover-primary fw-bold me-6"
              >
                {comment?.commenter?.fname} {comment?.commenter?.lname}
              </Link>

              <TimeAgo
                date={comment?.updated_at}
                formatter={formatter}
                className="text-gray-500 fw-semibold fs-9 me-5"
                live
              />
            </div>

            {comment?.commenter_id === user?.id && (
              <div className="ms-auto d-flex flex-row align-items-center gap-1">
                {/* {!commentEditable && (
                <span
                  onClick={() => setShowReplyBox(!showReplyBox)}
                  className="text-gray-500 text-hover-primary fw-semibold fs-7 cursor-pointer"
                >
                  {!showReplyBox ? "Reply" : "Cancel"}
                </span>
              )} */}

                <div
                  className="cursor-pointer"
                  onClick={() => setCommentEditable(!commentEditable)}
                >
                  {commentEditable ? (
                    <span onClick={handleSubmit(editCommentFunction)}>
                      <KTIcon
                        iconName="check"
                        className="fs-1 cursor-pointer m-0 text-white bg-success rounded-3"
                      />
                    </span>
                  ) : (
                    <KTIcon
                      iconName="pencil"
                      className="fs-1 cursor-pointer m-0 text-primary"
                    />
                  )}
                </div>

                {!commentEditable && (
                  <div
                    className="cursor-pointer"
                    onClick={handleDeleteComment}
                    key={comment?.id}
                  >
                    <KTIcon
                      iconName="trash"
                      className="fs-1 cursor-pointer m-0 text-danger"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <span
            ref={commentTextRef}
            className={clsx("text-gray-800 fs-7 fw-normal pt-1", {
              "p-2 outline-0 border rounded-2 my-2": commentEditable,
            })}
            contentEditable={commentEditable}
            suppressContentEditableWarning={true}
            onBlur={handleContentEditableChange}
          >
            <DescriptionWithLinks description={comment.content} />
          </span>
        </div>
      </div>
      {/* replies */}
      {/* {comment?.replies?.map((reply) => (
        <div
          className="d-flex pt-6"
          style={{
            marginLeft: "auto",
            width: "90%",
          }}
        >
          <div className="symbol symbol-45px me-5">
            <img src={toAbsoluteUrl("media/avatars/300-15.jpg")} alt="" />
          </div>

          <div className="d-flex flex-column flex-row-fluid">
            <div className="d-flex align-items-center  flex-wrap mb-0">
              <a
                href="#"
                className="text-gray-800 text-hover-primary fw-bold me-6"
              >
                {reply.user.fname} {reply.user.lname}
              </a>

              <span className="text-gray-500 fw-semibold fs-7 ms-auto me-3">
                {moment(reply.created_at).utc().format("DD MMMM YYYY HH:mm")}
              </span>

              <div
                className="cursor-pointer"
                onClick={() => {
                  dispatch(
                    deleteReply({
                      commentId: comment.id,
                      postId: postID,
                      replyId: reply.id,
                    })
                  );
                }}
              >
                <KTIcon
                  iconName="trash"
                  className="fs-1 cursor-pointer m-0 text-danger"
                />
              </div>
            </div>

            <span className="text-gray-800 fs-7 fw-normal pt-1">
              {reply.description}
            </span>
          </div>
        </div>
      ))} */}
    </>
  );
};

export default Comment;
