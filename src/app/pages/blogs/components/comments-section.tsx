import React from "react";
import { Row, Col, Button, Alert } from "react-bootstrap";
import { useComments } from "../hooks/use-comments";
import CommentForm from "./comment-form";
import CommentItem from "./comment-item";
import { useSelector } from "react-redux";
import { UserResponse } from "../../../types/reducers";

interface CommentsSectionProps {
  blogId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ blogId }) => {
  const {
    comments,
    isLoading,
    error,
    editingComment,
    addComment,
    updateComment,
    deleteComment,
    startEditing,
    cancelEditing,
    loadMore,
    isAddingComment,
    isUpdatingComment,
    isDeletingComment,
    hasMore,
  } = useComments({ blogId });

  const { user } = useSelector((state: UserResponse) => state.user);

  const currentUserId = user?.id;

  if (error) {
    return (
      <Alert variant="danger">
        <i className="bi bi-exclamation-triangle me-2"></i>
        Failed to load comments. Please try again later.
      </Alert>
    );
  }

  return (
    <Row>
      <Col lg={8} className="mx-auto">
        <div className="comments-section">
          <h4 className="mb-4">
            <i className="bi bi-chat-dots me-2"></i>
            Comments ({comments.length})
          </h4>

          {/* Add new comment form */}
          <div className="mb-4">
            <h6 className="mb-3">Leave a Comment</h6>
            <CommentForm onSubmit={addComment} isLoading={isAddingComment} />
          </div>

          {/* Comments list */}
          {isLoading && comments.length === 0 ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" />
              <p className="mt-2 text-muted">Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-chat-dots display-4 text-muted"></i>
              <p className="mt-3 text-muted">
                No comments yet. Be the first to comment!
              </p>
            </div>
          ) : (
            <>
              <div className="comments-list">
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    isEditing={editingComment === comment.id}
                    onEdit={startEditing}
                    onCancelEdit={cancelEditing}
                    onUpdate={updateComment}
                    onDelete={deleteComment}
                    isUpdating={isUpdatingComment}
                    isDeleting={isDeletingComment}
                    currentUserId={currentUserId}
                  />
                ))}
              </div>

              {/* Load more button */}
              {hasMore && (
                <div className="text-center mt-4">
                  <Button
                    variant="outline-primary"
                    onClick={loadMore}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Loading more...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-arrow-down me-2"></i>
                        Load More Comments
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </Col>
    </Row>
  );
};

export default CommentsSection;
