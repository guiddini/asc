import { Carousel, Modal, Spinner } from "react-bootstrap";
import Comment from "./components/comment";
import clsx from "clsx";
import useFeed from "./hooks/useFeed";
import getMediaUrl from "../../helpers/getMediaUrl";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import TimeAgo from "react-timeago";
import frenchStrings from "react-timeago/lib/language-strings/fr";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { PostsReducer, UserResponse } from "../../types/reducers";
import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  decreaseLikes,
  deleteComment,
  increaseLikes,
  updateCommentId,
} from "../../features/postsSlice";
import { CommentType } from "../../types/posts";
import { DescriptionWithLinks, MediaPostProps } from "./components/post-box";

const formatter = buildFormatter(frenchStrings);

export const PostDetails = ({
  id,
  set,
  postMedia,
}: {
  id: number | string;
  set: any;
  postMedia: MediaPostProps[];
}) => {
  const POST = useSelector((state: PostsReducer) =>
    state.posts?.posts?.find((post) => post?.id === id)
  );

  const onClose = () => set(null);
  const { user } = useSelector((state: UserResponse) => state.user);

  const {
    createCommentMutate,
    likeMutate,
    loadingCreateComment,
    unlikeMutate,
  } = useFeed();

  const dispatch = useDispatch();

  const user_liked_the_post = POST?.likes?.some(
    (like) => like.liker_id === user?.id
  );

  const { register, handleSubmit, setValue } = useForm();

  const handlePostComment = async (data: { comment: string }) => {
    let commentId = Math.random();
    dispatch(
      addComment({
        postId: id,
        content: data?.comment,
        commenter: {
          id: user?.id,
          fname: user?.fname,
          lname: user?.lname,
          avatar: user?.avatar,
        },
        commentId: commentId,
      })
    );
    createCommentMutate(
      {
        content: data.comment,
        id: id,
      },
      {
        onSuccess(data) {
          setValue("comment", "");

          const realCommentId = data?.data[1] as CommentType;

          dispatch(
            updateCommentId({
              postId: id,
              tempCommentId: commentId,
              realCommentId: realCommentId.id,
            })
          );

          commentId = null;
        },
        onError(error, variables, context) {
          dispatch(
            deleteComment({
              postId: id,
              commentId: commentId,
            })
          );
        },
      }
    );
  };

  return (
    <>
      <Modal centered show={POST !== null} onHide={onClose} backdrop={true}>
        <div className="card p-auto" id="post-detail-wrapper">
          {POST?.has_media === 1 && (
            <>
              {postMedia?.length > 0 ? (
                <Carousel id="post-imgs-carousel-wrapper" indicators={false}>
                  {postMedia?.map((media, key) => {
                    return (
                      <Carousel.Item id="carousel-item" key={key}>
                        {media?.type === "video" ? (
                          <video
                            controls
                            src={getMediaUrl(media?.path)}
                            className="w-100 h-100 object-fit-cover rounded-1"
                          ></video>
                        ) : (
                          <img
                            src={getMediaUrl(media?.path)}
                            alt=""
                            id="carousel-img"
                            className="mx-auto"
                          />
                        )}
                      </Carousel.Item>
                    );
                  })}
                </Carousel>
              ) : (
                <div
                  style={{
                    height: "100%",
                  }}
                  className="w-100 d-flex justify-content-center align-items-center bg-white"
                >
                  <Spinner animation="border" color="#000" />
                </div>
              )}
            </>
          )}

          <div id="post-details-comment-wrapper">
            <div className="d-flex align-items-center mb-4">
              <div className="symbol symbol-50px me-5 rounded-circle">
                <img
                  src={getMediaUrl(POST?.user?.avatar)}
                  className="rounded-circle"
                  alt=""
                />
              </div>

              <div className="flex-grow-1">
                <Link
                  to={`/profile/${POST?.user?.id}`}
                  className="text-gray-800 text-hover-primary fs-4 fw-bold"
                >
                  {POST?.user?.fname} {POST?.user?.lname}
                </Link>
                <TimeAgo
                  date={POST?.updated_at}
                  formatter={formatter}
                  className="text-gray-500 fw-semibold d-block fs-7"
                />
              </div>
            </div>

            <span className="fs-3 fw-normal text-gray-700 mb-5">
              <DescriptionWithLinks description={POST?.description} />
            </span>

            <ul className="nav py-1 ">
              <li className="nav-item">
                <span
                  onClick={() => {
                    if (!user_liked_the_post) {
                      dispatch(
                        increaseLikes({
                          postId: id,
                          userId: user?.id,
                        })
                      );

                      likeMutate(id, {
                        onError: () => {
                          dispatch(
                            decreaseLikes({
                              postId: id,
                              userId: user?.id,
                            })
                          );
                        },
                        onSuccess(data, variables, context) {},
                      });
                    } else {
                      dispatch(
                        decreaseLikes({
                          postId: id,
                          userId: user?.id,
                        })
                      );

                      unlikeMutate(id, {
                        onError: () => {
                          dispatch(
                            increaseLikes({
                              postId: id,
                              userId: user?.id,
                            })
                          );
                        },
                        onSuccess(data, variables, context) {},
                      });
                    }
                  }}
                  className="nav-link btn btn-sm btn-color-gray-600 btn-active-color-danger btn-active-light-danger fw-bold px-4 me-1 collapsible"
                >
                  <i
                    className={clsx("ki-heart fs-2 me-1", {
                      "ki-outline ": !user_liked_the_post,
                      "ki-solid text-danger": user_liked_the_post,
                    })}
                  ></i>
                  {POST?.likes?.length} Likes
                </span>
              </li>

              <li className="nav-item">
                <a
                  className="nav-link btn btn-sm btn-color-gray-600 btn-active-color-primary btn-active-light-primary fw-bold px-4 me-1 collapsible"
                  data-bs-toggle="collapse"
                  href="#kt_social_feeds_comments_1"
                >
                  <i className="ki-duotone ki-message-text-2 fs-2 me-1">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                  {POST?.comments?.length} Comments
                </a>
              </li>
            </ul>

            <div id="comments">
              <>
                {POST?.comments?.map((e, index) => (
                  <>
                    <Comment
                      comment={e}
                      // setShowReplyBox={() => {}}
                      // showReplyBox={false}
                      postID={POST?.id}
                      i={index}
                    />
                  </>
                ))}
              </>
            </div>

            <div className="position-relative w-100" id="textarea-comment">
              <textarea
                className="form-control form-control-solid border mt-4"
                data-kt-autosize="true"
                placeholder="Write your comment.."
                {...register("comment")}
                disabled={loadingCreateComment}
              />

              <div className="position-absolute top-0 end-0 translate-middle-x mt-4 me-n0">
                <button
                  disabled={loadingCreateComment}
                  onClick={handleSubmit(handlePostComment)}
                  className="btn btn-icon btn-sm btn-color-gray-500 btn-active-color-primary w-25px p-0"
                >
                  <i className="fa-solid fa-paper-plane fs-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
