import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import {
  getBlogComments,
  storeBlogComment,
  updateBlogComment,
  deleteBlogComment,
} from "../../../apis";

interface Comment {
  id: number;
  commenter_id: string;
  commenter_type: string;
  commentable_id: string;
  commentable_type: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface UseCommentsProps {
  blogId: string;
}

export const useComments = ({ blogId }: UseCommentsProps) => {
  const [offset, setOffset] = useState(0);
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const limit = 10;

  // Fetch comments
  const {
    data: comments = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Comment[]>({
    queryKey: ["blog-comments", blogId, offset],
    queryFn: () => getBlogComments(blogId, offset, limit),
    enabled: !!blogId,
    keepPreviousData: true,
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: (content: string) => storeBlogComment(blogId, content),
    onSuccess: () => {
      toast.success("Comment added successfully");
      queryClient.invalidateQueries(["blog-comments", blogId]);
    },
    onError: () => {
      toast.error("Failed to add comment");
    },
  });

  // Update comment mutation
  const updateCommentMutation = useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => updateBlogComment(commentId, content),
    onSuccess: () => {
      toast.success("Comment updated successfully");
      setEditingComment(null);
      queryClient.invalidateQueries(["blog-comments", blogId]);
    },
    onError: () => {
      toast.error("Failed to update comment");
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => deleteBlogComment(commentId),
    onSuccess: () => {
      toast.success("Comment deleted successfully");
      queryClient.invalidateQueries(["blog-comments", blogId]);
    },
    onError: () => {
      toast.error("Failed to delete comment");
    },
  });

  const loadMore = () => {
    setOffset((prev) => prev + limit);
  };

  const startEditing = (commentId: number) => {
    setEditingComment(commentId);
  };

  const cancelEditing = () => {
    setEditingComment(null);
  };

  // Create wrapper functions to match expected prop signatures
  const handleUpdateComment = (commentId: string, content: string) => {
    updateCommentMutation.mutate({ commentId, content });
  };

  return {
    comments,
    isLoading,
    error,
    editingComment,
    addComment: addCommentMutation.mutate,
    updateComment: handleUpdateComment, // Use wrapper function
    deleteComment: deleteCommentMutation.mutate,
    startEditing,
    cancelEditing,
    loadMore,
    isAddingComment: addCommentMutation.isLoading,
    isUpdatingComment: updateCommentMutation.isLoading,
    isDeletingComment: deleteCommentMutation.isLoading,
    hasMore: comments.length >= limit,
  };
};
