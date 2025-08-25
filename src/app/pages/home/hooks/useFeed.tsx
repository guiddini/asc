import { useMemo } from "react";
import { useMutation, useQuery } from "react-query";
import {
  createCommentPostApi,
  deletePostApi,
  findMediaApi,
  getAllPostsApi,
  getOnePostApi,
  likePostApi,
  postReportApi,
  removeCommentPostApi,
  unlikePostApi,
  updateCommentPostApi,
} from "../../../apis";
import { PostType } from "../../../types/posts";

const useFeed = () => {
  // post functions
  const { mutateAsync: deletePostMutate } = useMutation({
    mutationKey: ["delete-post"],
    mutationFn: async (post_id: string | number) =>
      await deletePostApi(post_id),
  });

  // report post functionalities
  const { mutate: reportMutate } = useMutation({
    mutationKey: ["report-post"],
    mutationFn: (post_id: string) =>
      postReportApi({
        reportable_type: "post",
        reportable_id: post_id,
      }),
  });

  // like functionalities
  const { mutate: likeMutate } = useMutation({
    mutationKey: ["like-post"],
    mutationFn: (likable_id: string | number) =>
      likePostApi({
        likable_id,
      }),
  });

  const { mutate: unlikeMutate } = useMutation({
    mutationKey: ["like-post"],
    mutationFn: (likable_id: string | number) =>
      unlikePostApi({
        likable_id,
      }),
  });

  // comments functionalites

  const { mutate: createCommentMutate, isLoading: loadingCreateComment } =
    useMutation({
      mutationKey: ["create-comment"],
      mutationFn: (data: { content: string; id: string | number }) =>
        createCommentPostApi({
          content: data?.content,
          post_id: data?.id,
        }),
    });

  const { mutateAsync: deleteCommentMutate, isLoading: loadingDeleteComment } =
    useMutation({
      mutationKey: ["delete-comment"],
      mutationFn: async (data: { comment_id: string | number }) =>
        await removeCommentPostApi({
          comment_id: data?.comment_id,
        }),
    });

  const { mutate: updateCommentMutate, isLoading: loadingUpdateComment } =
    useMutation({
      mutationKey: ["update-comment"],
      mutationFn: (data: { content: string; id: string | number }) =>
        updateCommentPostApi({
          content: data?.content,
          comment_id: data?.id,
        }),
    });

  // post media functionalites

  const {
    mutate: getOnePostData,
    data: post,
    isLoading: loadingPost,
  } = useMutation({
    mutationFn: (post_id: string | number) => getOnePostApi(post_id),
    mutationKey: ["get-one-post"],
  });

  const {
    data,
    mutate: getPostMedia,
    isLoading: loadingMedia,
  } = useMutation({
    mutationFn: (id: string) => findMediaApi(id),
    mutationKey: ["post-media-api"],
  });

  const POST_MEDIA = useMemo(() => {
    const media: {
      id: number;
      mediable_id: string;
      mediable_type: string;
      name: string;
      path: string;
      size: string;
      type: string;
    }[] = data?.data;

    return media?.map((e) => e.path);
  }, []);

  const {
    data: posts,
    isSuccess: isPostsSuccess,
    mutate: getPosts,
  } = useMutation({
    mutationKey: ["posts"],
    mutationFn: getAllPostsApi,
  });

  const POSTS = useMemo(() => posts?.data, [posts]);
  const POST: PostType = useMemo(() => post?.data, [post]);

  return {
    likeMutate,
    unlikeMutate,
    createCommentMutate,
    loadingCreateComment,
    getPostMedia,
    POST_MEDIA,
    POSTS,
    isPostsSuccess,
    getPosts,
    loadingMedia,
    deleteCommentMutate,
    loadingDeleteComment,
    updateCommentMutate,
    loadingUpdateComment,
    getOnePostData,
    POST,
    loadingPost,
    posts,
    deletePostMutate,
    reportMutate,
  };
};

export default useFeed;
