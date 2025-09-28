import { useEffect, useState } from "react";
import { CommentType, PostType } from "../../../types/posts";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Comment from "./comment";
import { PostDetails } from "../post-details";
import { Link } from "react-router-dom";
import getMediaUrl from "../../../helpers/getMediaUrl";
import useFeed from "../hooks/useFeed";
import TimeAgo from "react-timeago";
import frenchStrings from "react-timeago/lib/language-strings/fr";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import {
  addComment,
  addPost,
  decreaseLikes,
  deleteComment,
  deletePost,
  increaseLikes,
  updateCommentId,
} from "../../../features/postsSlice";
import { KTIcon } from "../../../../_metronic/helpers";
import { Dropdown } from "react-bootstrap";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { findMediaApi } from "../../../apis";
import EditPostModal from "./edit-post/edit-post-modal";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterIcon,
  TwitterShareButton,
  LinkedinShareButton,
  LinkedinIcon,
} from "react-share";
import { errorMessage } from "../../../helpers/errorMessage";
import { yupResolver } from "@hookform/resolvers/yup";
import { createCommentSchema } from "../validation/postValidation";
import { errorResponse } from "../../../types/responses";
import { UserResponse } from "../../../types/reducers";

const MySwal = withReactContent(Swal);

const formatter = buildFormatter(frenchStrings);

export function DescriptionWithLinks({ description }) {
  if (!description) {
    return null; // Or display a placeholder message
  }
  const regex = /(https?:\/\/[^\s]+)/gi;
  const parts = description.split(regex);

  const elements = parts.map((part, index) => {
    if (part.match(regex)) {
      return (
        <a key={index} href={part} target="_blank" rel="noopener noreferrer">
          {part}
        </a>
      );
    } else {
      return <span key={index}>{part}</span>;
    }
  });

  return <div className="fs-6 fw-normal text-gray-700 mb-5">{elements}</div>;
}

export type MediaPostProps = {
  id: number;
  mediable_id: string;
  mediable_type: string;
  name: string;
  path: string;
  size: string;
  type: string;
};

const PostBox = ({
  comments,
  created_at,
  description,
  has_media,
  id,
  likes,
  updated_at,
  user,
  user_id,
}: PostType) => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector(
    (state: UserResponse) => state.user
  );

  const [showPostDetail, setShowPostDetailID] = useState<
    number | string | null
  >(null);
  const [showPostEdit, setShowPostEditID] = useState<number | string | null>(
    null
  );
  const [postMedia, setPostMedia] = useState<MediaPostProps[] | []>([]);

  const {
    createCommentMutate,
    likeMutate,
    unlikeMutate,
    deletePostMutate,
    reportMutate,
  } = useFeed();

  const {
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<{
    comment: string;
  }>({
    defaultValues: {
      comment: "",
    },
    resolver: yupResolver(createCommentSchema) as any,
  });

  const postComment = (data: { comment: string }) => {
    let commentId = Math.random();
    dispatch(
      addComment({
        postId: id,
        content: data?.comment,
        commenter: {
          id: currentUser?.id,
          fname: currentUser?.fname,
          lname: currentUser?.lname,
          avatar: currentUser?.avatar,
        },
        commentId: commentId,
      })
    );
    reset();
    setValue("comment", "");
    createCommentMutate(
      {
        content: data.comment,
        id: id,
      },
      {
        onSuccess(data) {
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

  const user_liked_the_post = likes?.some(
    (like) => like.liker_id === currentUser?.id
  );

  useEffect(() => {
    const getPostMedia = async (id: string) => {
      try {
        const data = await findMediaApi(id);

        const media: MediaPostProps[] = data?.data;

        setPostMedia(media);
      } catch (error) {}
    };

    if (has_media === 1) {
      getPostMedia(id);
    }
  }, [has_media]);

  const renderPostMedia = () => {
    const mediaCount = postMedia.length;
    const media_path = postMedia?.map((e) => ({
      path: e?.path,
      type: e?.type,
    }));

    const videoClass = "w-100 rounded-1";

    switch (true) {
      case mediaCount === 1:
        return (
          <div className="col-12">
            {media_path[0]?.type === "video" ? (
              <div className="card-rounded">
                <video
                  controls
                  src={getMediaUrl(media_path[0]?.path)}
                  className={videoClass}
                  style={{
                    maxHeight: "400px",
                    objectFit: "contain",
                  }}
                ></video>
              </div>
            ) : (
              <a
                className="d-block card-rounded overlay h-100"
                data-fslightbox="lightbox-projects"
              >
                <div
                  className="overlay-wrapper bgi-no-repeat bgi-position-center bgi-size-cover card-rounded h-100"
                  style={{
                    backgroundImage: `url(${getMediaUrl(media_path[0]?.path)})`,
                  }}
                ></div>
                <div className="overlay-layer card-rounded bg-dark bg-opacity-25">
                  <i className="ki-outline ki-eye fs-3x text-white"></i>
                </div>
              </a>
            )}
          </div>
        );

      case mediaCount === 2:
        return (
          <>
            <div className="col-6">
              <div
                className="position-relative h-100"
                style={{ minHeight: "300px" }}
              >
                {media_path[0]?.type === "video" ? (
                  <video
                    controls
                    src={getMediaUrl(media_path[0]?.path)}
                    className="w-100 h-100 rounded-3 shadow-sm"
                    style={{
                      objectFit: "cover",
                      minHeight: "300px",
                    }}
                  ></video>
                ) : (
                  <a
                    className="d-block position-relative overflow-hidden rounded-3 shadow-sm h-100 text-decoration-none"
                    data-fslightbox={`lightbox-projects-0`}
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      className="w-100 h-100 bg-light d-flex align-items-center justify-content-center"
                      style={{
                        backgroundImage: `url(${getMediaUrl(
                          media_path[0]?.path
                        )})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        minHeight: "300px",
                        transition: "transform 0.3s ease",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    >
                      <div
                        className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-0 d-flex align-items-center justify-content-center opacity-0 hover-opacity-100"
                        style={{ transition: "opacity 0.3s ease" }}
                      >
                        <div className="bg-white bg-opacity-90 rounded-circle p-3">
                          <svg
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </a>
                )}
              </div>
            </div>
            <div className="col-6">
              <div
                className="position-relative h-100"
                style={{ minHeight: "300px" }}
              >
                {media_path[1]?.type === "video" ? (
                  <video
                    controls
                    src={getMediaUrl(media_path[1]?.path)}
                    className="w-100 h-100 rounded-3 shadow-sm"
                    style={{
                      objectFit: "cover",
                      minHeight: "300px",
                    }}
                  ></video>
                ) : (
                  <a
                    className="d-block position-relative overflow-hidden rounded-3 shadow-sm h-100 text-decoration-none"
                    data-fslightbox={`lightbox-projects-1`}
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      className="w-100 h-100 bg-light d-flex align-items-center justify-content-center"
                      style={{
                        backgroundImage: `url(${getMediaUrl(
                          media_path[1]?.path
                        )})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        minHeight: "300px",
                        transition: "transform 0.3s ease",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    >
                      <div
                        className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-0 d-flex align-items-center justify-content-center opacity-0 hover-opacity-100"
                        style={{ transition: "opacity 0.3s ease" }}
                      >
                        <div className="bg-white bg-opacity-90 rounded-circle p-3">
                          <svg
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </>
        );

      case mediaCount >= 3:
        return (
          <>
            {/* Main/Featured Media - Takes up left side */}
            <div className="col-md-8 col-12">
              <div
                className="position-relative h-100"
                style={{ minHeight: "400px" }}
              >
                {media_path[0]?.type === "video" ? (
                  <video
                    controls
                    src={getMediaUrl(media_path[0]?.path)}
                    className="w-100 h-100 rounded-3 shadow-sm"
                    style={{
                      objectFit: "cover",
                      minHeight: "400px",
                    }}
                  ></video>
                ) : (
                  <a
                    className="d-block position-relative overflow-hidden rounded-3 shadow-sm h-100 text-decoration-none"
                    data-fslightbox={`lightbox-projects-0`}
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      className="w-100 h-100 bg-light"
                      style={{
                        backgroundImage: `url(${getMediaUrl(
                          media_path[0]?.path
                        )})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        minHeight: "400px",
                        transition: "transform 0.3s ease",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "scale(1.02)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    >
                      <div
                        className="position-absolute top-50 start-50 translate-middle opacity-0 hover-opacity-100"
                        style={{ transition: "opacity 0.3s ease" }}
                      >
                        <div className="bg-white bg-opacity-90 rounded-circle p-3 shadow">
                          <svg
                            width="28"
                            height="28"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* Secondary Media Grid - Right side */}
            <div className="col-md-4 col-12">
              <div
                className="d-flex flex-column h-100"
                style={{ gap: "8px", minHeight: "400px" }}
              >
                {/* Second Media Item */}
                <div
                  className="flex-fill position-relative"
                  style={{ minHeight: "190px" }}
                >
                  {media_path[1]?.type === "video" ? (
                    <video
                      controls
                      src={getMediaUrl(media_path[1]?.path)}
                      className="w-100 h-100 rounded-3 shadow-sm"
                      style={{
                        objectFit: "cover",
                        minHeight: "190px",
                      }}
                    ></video>
                  ) : (
                    <a
                      className="d-block position-relative overflow-hidden rounded-3 shadow-sm h-100 text-decoration-none"
                      data-fslightbox={`lightbox-projects-1`}
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        className="w-100 h-100 bg-light"
                        style={{
                          backgroundImage: `url(${getMediaUrl(
                            media_path[1]?.path
                          )})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          minHeight: "190px",
                          transition: "transform 0.3s ease",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.transform = "scale(1.05)")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      >
                        <div
                          className="position-absolute top-50 start-50 translate-middle opacity-0 hover-opacity-100"
                          style={{ transition: "opacity 0.3s ease" }}
                        >
                          <div className="bg-white bg-opacity-90 rounded-circle p-2">
                            <svg
                              width="20"
                              height="20"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </a>
                  )}
                </div>

                {/* Third Media Item with "+X more" overlay */}
                <div
                  className="flex-fill position-relative"
                  style={{ minHeight: "190px" }}
                >
                  {media_path[2]?.type === "video" ? (
                    <div className="position-relative h-100">
                      <video
                        controls
                        src={getMediaUrl(media_path[2]?.path)}
                        className="w-100 h-100 rounded-3 shadow-sm"
                        style={{
                          objectFit: "cover",
                          minHeight: "190px",
                        }}
                      ></video>
                      {mediaCount > 3 && (
                        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-60 rounded-3 d-flex align-items-center justify-content-center">
                          <div className="text-center text-white">
                            <div
                              className="fw-bold"
                              style={{ fontSize: "24px" }}
                            >
                              +{mediaCount - 2}
                            </div>
                            <div className="small">more</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <a
                      className="d-block position-relative overflow-hidden rounded-3 shadow-sm h-100 text-decoration-none"
                      data-fslightbox={`lightbox-projects-2`}
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        className="w-100 h-100 bg-light"
                        style={{
                          backgroundImage: `url(${getMediaUrl(
                            media_path[2]?.path
                          )})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          minHeight: "190px",
                          transition: "transform 0.3s ease",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.transform = "scale(1.05)")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      >
                        {/* "+X more" overlay for 3+ images */}
                        {mediaCount > 3 && (
                          <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-70 d-flex align-items-center justify-content-center">
                            <div className="text-center text-white">
                              <div
                                className="fw-bold"
                                style={{ fontSize: "28px" }}
                              >
                                +{mediaCount - 2}
                              </div>
                              <div className="small opacity-90">more</div>
                            </div>
                          </div>
                        )}

                        {/* Eye icon for single third image */}
                        {mediaCount === 3 && (
                          <div
                            className="position-absolute top-50 start-50 translate-middle opacity-0 hover-opacity-100"
                            style={{ transition: "opacity 0.3s ease" }}
                          >
                            <div className="bg-white bg-opacity-90 rounded-circle p-2">
                              <svg
                                width="20"
                                height="20"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const handleOpenPostDetail = () => {
    setShowPostDetailID(id);
  };

  const handleDeletePost = () => {
    let deletedPost = {
      comments,
      created_at,
      description,
      has_media,
      id,
      likes,
      updated_at,
      user,
      user_id,
    };

    MySwal.fire({
      title: "Are you sure you want to delete the post ?",
      icon: "error",
      heightAuto: false,
      cancelButtonText: "Cancel",
      showCancelButton: true,
      confirmButtonText: "Delete",
      backdrop: true,
      showConfirmButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        dispatch(deletePost(id));
        MySwal.showLoading();
        deletePostMutate(id, {
          onSuccess(data, variables, context) {
            toast.success("Post has been deleted !");
            deletedPost = null;
            MySwal.hideLoading();
          },
          onError(error, variables, context) {
            dispatch(addPost(deletedPost));
          },
        });
      }
    });
  };

  const handleReportPost = () => {
    MySwal.fire({
      title: "Are you sure you want to report the post?",
      icon: "warning",
      heightAuto: false,
      cancelButtonText: "Cancel",
      showCancelButton: true,
      confirmButtonText: "Report",
      backdrop: true,
      showConfirmButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        MySwal.showLoading();
        reportMutate(id, {
          onSuccess() {
            toast.success("The post has been reported!");
            MySwal.hideLoading();
          },
          onError(error: errorResponse) {
            toast?.error(
              `Error reporting post: ${error.response?.data?.message}`
            );
          },
        });
      }
    });
  };

  return (
    <div className="card card-flush mb-10" id={`afes-post-${id}`}>
      <div className="card-header pt-9">
        <div className="d-flex align-items-center">
          <div className="symbol symbol-50px me-5">
            <img
              src={getMediaUrl(user?.avatar)}
              className="object-fit-cover"
              alt=""
            />
          </div>

          <div className="flex-grow-1">
            <Link
              to={`/profile/${user?.id}`}
              className="text-gray-800 text-hover-primary fs-4 fw-bold"
            >
              {user?.fname} {user?.lname}
            </Link>

            <TimeAgo
              date={updated_at}
              formatter={formatter}
              className="text-gray-500 fw-semibold d-block"
            />
          </div>
        </div>

        <div className="card-toolbar" key={id}>
          {/* begin::Menu */}
          <Dropdown>
            <Dropdown.Toggle
              variant="transparent"
              color="#fff"
              id="post-dropdown"
              // className="btn btn-sm btn-icon btn-custom-purple-dark btn-active-custom-purple-dark"
            >
              <i className="fa-solid fa-ellipsis-vertical text-black fs-3"></i>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {currentUser?.id === user_id ? (
                <div className="p-2">
                  <Dropdown.Item
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPostEditID(id);
                    }}
                    className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-primary btn-active-light-primary fw-bold collapsible m-0 px-5 py-3"
                  >
                    {" "}
                    <KTIcon
                      iconName="pencil"
                      className="fs-2 cursor-pointer m-0 text-primary"
                    />{" "}
                    <span className="text-muted mt-1 ms-2">Update</span>
                  </Dropdown.Item>

                  {/* delete post  */}

                  <Dropdown.Item
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeletePost();
                    }}
                    className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-danger btn-active-light-danger fw-bold collapsible m-0 px-5 py-3"
                  >
                    {" "}
                    <KTIcon
                      iconName="trash"
                      className="fs-2 cursor-pointer m-0 text-danger"
                    />{" "}
                    <span className="text-muted mt-1 ms-2">Delete</span>
                  </Dropdown.Item>
                </div>
              ) : (
                <div className="p-2">
                  {/* edit post */}

                  <Dropdown.Item
                    onClick={(e) => {
                      e.preventDefault();
                      handleReportPost();
                    }}
                    className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-warning btn-active-light-warning fw-bold collapsible m-0 px-5 py-3"
                  >
                    {" "}
                    <KTIcon
                      iconName="flag"
                      className="fs-2 cursor-pointer m-0 text-warning"
                    />{" "}
                    <span className="text-muted mt-1 ms-2">
                      Report the post
                    </span>
                  </Dropdown.Item>
                </div>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <div className="card-body cursor-pointer">
        <div
          className="fs-6 fw-normal text-gray-700 mb-5"
          onClick={() => handleOpenPostDetail()}
        >
          <DescriptionWithLinks description={description} />
          {/* {description?.length > 200 ? (
            <>
              {description.slice(0, 200)}
              <span
                className="link text-primary"
                onClick={() => handleOpenPostDetail()}
              >
                Afficher plus
              </span>
            </>
          ) : (
            description
          )} */}
        </div>
        {/* Media Section */}
        {postMedia?.length > 0 && (
          <div className="row g-2 mb-3" style={{ minHeight: "250px" }}>
            {renderPostMedia()}
          </div>
        )}
      </div>

      <div className="card-footer pt-0">
        <div className="mb-6">
          <div className="separator separator-solid"></div>

          <ul className="nav py-3">
            <li className="nav-item">
              <span
                className="nav-link btn btn-sm btn-color-gray-600 btn-active-color-danger btn-active-light-danger fw-bold px-4 me-1 collapsible"
                onClick={() => {
                  if (!user_liked_the_post) {
                    dispatch(
                      increaseLikes({
                        postId: id,
                        userId: currentUser?.id,
                      })
                    );

                    likeMutate(id, {
                      onError: () => {
                        dispatch(
                          decreaseLikes({
                            postId: id,
                            userId: currentUser?.id,
                          })
                        );
                      },
                      onSuccess(data, variables, context) {},
                    });
                  } else {
                    dispatch(
                      decreaseLikes({
                        postId: id,
                        userId: currentUser?.id,
                      })
                    );

                    unlikeMutate(id, {
                      onError: () => {
                        dispatch(
                          increaseLikes({
                            postId: id,
                            userId: currentUser?.id,
                          })
                        );
                      },
                      onSuccess(data, variables, context) {},
                    });
                  }
                }}
              >
                <i
                  className={clsx("ki-heart fs-2 me-1", {
                    "ki-outline ": !user_liked_the_post,
                    "ki-solid text-danger": user_liked_the_post,
                  })}
                ></i>
                {likes?.length} Like
              </span>
            </li>
            <li className="nav-item d-none d-md-block">
              <span className="nav-link btn btn-sm btn-color-gray-600 btn-active-color-primary btn-active-light-primary fw-bold px-4 me-1 collapsible">
                <i className="ki-duotone ki-message-text-2 fs-2 me-1">
                  <span className="path1"></span>
                  <span className="path2"></span>
                  <span className="path3"></span>
                </i>
                {comments?.length} comments
              </span>
            </li>
            <Dropdown className="nav-item">
              <Dropdown.Toggle
                variant="transparent"
                className="nav-link btn btn-sm btn-color-gray-600 btn-active-color-primary btn-active-light-primary fw-bold px-4 me-1 collapsible"
              >
                <i className="fa-solid fa-share"></i>
                {comments?.length} Share
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {/* Share on linkedIn */}
                <Dropdown.Item
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0"
                >
                  <LinkedinShareButton
                    url={`https://asc.eventili.com/home#afes-post-${id}`}
                    title="Je participe à l'événement 'Algeria Fintech & E-commerce Summit' organisé par 'Guiddini'. 🚀 Rejoignez-moi pour explorer les dernières tendances et innovations dans le domaine de la fintech et du commerce électronique en consultant le site web : https://algeriafintech.com/💻🌐 #AFES2024 #Guiddini #groupetelecomalgérie #icosnet #saa #caat #bea #Saticom
#allianceassrances"
                  >
                    <LinkedinIcon size={32} round />
                    <span className="text-muted ms-2">LinkedIn</span>
                  </LinkedinShareButton>
                </Dropdown.Item>
                {/*  */}
                {/* Share on Facebook */}
                <Dropdown.Item
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0"
                >
                  <FacebookShareButton
                    url={`https://asc.eventili.com/home#afes-post-${id}`}
                    title="Je participe à l'événement 'Algeria Fintech & E-commerce Summit' organisé par 'Guiddini'. 🚀 Rejoignez-moi pour explorer les dernières tendances et innovations dans le domaine de la fintech et du commerce électronique en consultant le site web : https://algeriafintech.com/💻🌐 #AFES2024 #Guiddini #groupetelecomalgérie #icosnet #saa #caat #bea #Saticom
#allianceassrances"
                  >
                    <FacebookIcon size={32} round />
                    <span className="text-muted ms-2">Facebook</span>
                  </FacebookShareButton>
                </Dropdown.Item>
                {/*  */}
                {/* Share on Twitter */}
                <Dropdown.Item
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0"
                >
                  <TwitterShareButton
                    url={`https://asc.eventili.com/home#afes-post-${id}`}
                    title="Je participe à l'événement 'Algeria Fintech & E-commerce Summit' organisé par 'Guiddini'. 🚀 Rejoignez-moi pour explorer les dernières tendances et innovations dans le domaine de la fintech et du commerce électronique en consultant le site web :"
                  >
                    <TwitterIcon size={32} round />
                    <span className="text-muted ms-2">Twitter</span>
                  </TwitterShareButton>
                </Dropdown.Item>
                {/*  */}
              </Dropdown.Menu>
            </Dropdown>
            {/* <li className="nav-item">
           
            </li> */}
          </ul>

          <div className="separator separator-solid mb-1"></div>

          <div className="collapse show">
            {comments?.length > 0 ? (
              <>
                {comments?.map((comment, index) => (
                  <>
                    <Comment
                      key={comment?.id}
                      i={index}
                      comment={comment}
                      // setShowReplyBox={setShowReplyBox}
                      // showReplyBox={showReplyBox}
                      postID={id}
                    />
                  </>
                ))}
              </>
            ) : (
              <></>
            )}
          </div>
        </div>

        <div className="d-flex align-items-start">
          <div className="symbol symbol-35px me-3">
            <img src={getMediaUrl(currentUser.avatar)} alt="" />
          </div>

          <div className="position-relative w-100">
            <textarea
              className="form-control form-control-solid border ps-5"
              data-kt-autosize="true"
              placeholder="Your comment.."
              onChange={(e) => {
                setValue("comment", e.target.value);
              }}
              // disabled={loadingCreateComment}
            />
            {errorMessage(errors, "comment")}
            <div className="position-absolute top-0 end-0 translate-middle-x mt-1 me-n0">
              <button
                // disabled={loadingCreateComment}
                onClick={handleSubmit(postComment)}
                className="btn btn-icon btn-sm btn-color-gray-500 btn-active-color-primary w-25px p-0"
              >
                <i className="fa-solid fa-paper-plane fs-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      {showPostDetail !== null ? (
        <PostDetails
          id={showPostDetail}
          set={setShowPostDetailID}
          postMedia={postMedia}
        />
      ) : null}

      {showPostEdit !== null ? (
        <EditPostModal
          postId={showPostEdit}
          setPostId={setShowPostEditID}
          postMedia={postMedia}
          setPostMedia={setPostMedia}
          isOpen={showPostEdit === null ? false : true}
        />
      ) : null}
    </div>
  );
};

export default PostBox;
