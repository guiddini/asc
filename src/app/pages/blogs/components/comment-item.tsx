import React, { useState } from "react";
import { Card, Button, Dropdown, Badge } from "react-bootstrap";
import CommentForm from "./comment-form";

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

interface CommentItemProps {
  comment: Comment;
  isEditing: boolean;
  onEdit: (commentId: number) => void;
  onCancelEdit: () => void;
  onUpdate: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  currentUserId?: string; // Add this if you have user context
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  isEditing,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
  currentUserId,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleUpdate = (content: string) => {
    onUpdate(comment.id.toString(), content);
  };

  const handleDelete = () => {
    onDelete(comment.id.toString());
    setShowDeleteConfirm(false);
  };

  const canModify = currentUserId === comment.commenter_id;

  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="d-flex align-items-center gap-2">
            <div
              className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "32px", height: "32px" }}
            >
              <i className="bi bi-person-fill text-white"></i>
            </div>
            <div>
              <small className="text-muted">
                User {comment.commenter_id.slice(0, 8)}...
              </small>
              <div>
                <small className="text-muted">
                  <i className="bi bi-clock me-1"></i>
                  {formatDate(comment.created_at)}
                  {comment.created_at !== comment.updated_at && (
                    <Badge
                      bg="primary"
                      className="ms-2"
                      style={{ fontSize: "0.7rem" }}
                    >
                      Edited
                    </Badge>
                  )}
                </small>
              </div>
            </div>
          </div>

          {canModify && !isEditing && (
            <Dropdown>
              <Dropdown.Toggle
                variant="link"
                className="p-0 border-0 text-muted"
                style={{ boxShadow: "none" }}
              >
                <i className="bi bi-three-dots"></i>
              </Dropdown.Toggle>

              <Dropdown.Menu align="end">
                <Dropdown.Item onClick={() => onEdit(comment.id)}>
                  <i className="bi bi-pencil me-2"></i>
                  Edit
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  className="text-danger"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <i className="bi bi-trash me-2"></i>
                  Delete
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>

        {isEditing ? (
          <CommentForm
            onSubmit={handleUpdate}
            isLoading={isUpdating}
            initialValue={comment.content}
            submitText="Update Comment"
            onCancel={onCancelEdit}
            showCancel={true}
          />
        ) : (
          <p className="mb-0">{comment.content}</p>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="mt-3 p-3 border rounded bg-light">
            <p className="mb-2 text-danger">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Are you sure you want to delete this comment?
            </p>
            <div className="d-flex gap-2">
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete"
                )}
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default CommentItem;
