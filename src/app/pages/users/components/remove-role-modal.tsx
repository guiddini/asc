import React, { useState } from "react";
import { Modal, Button, Alert, Card, Badge, Stack } from "react-bootstrap";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { removeRoleFromUserApi } from "../../../apis";
import { Role } from "../../../types/roles";

interface RemoveRoleModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  userId: string | number;
  userName: string;
  userRoles: Role[];
}

const RemoveRoleModal: React.FC<RemoveRoleModalProps> = ({
  isOpen,
  setIsOpen,
  userId,
  userName,
  userRoles = [],
}) => {
  const queryClient = useQueryClient();
  const [confirmingRole, setConfirmingRole] = useState<Role | null>(null);

  const removeRoleMutation = useMutation({
    mutationFn: ({
      user_id,
      role_id,
    }: {
      user_id: string | number;
      role_id: string | number;
    }) => removeRoleFromUserApi(user_id, role_id),
    onSuccess: () => {
      toast.success("✅ Role removed successfully!");
      queryClient.invalidateQueries(["users"]);
      setConfirmingRole(null);
    },
    onError: () => {
      toast.error("❌ Failed to remove role. Please try again.");
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    setConfirmingRole(null);
  };

  const confirmRemoveRole = () => {
    if (confirmingRole) {
      removeRoleMutation.mutate({
        user_id: userId,
        role_id: confirmingRole.id,
      });
    }
  };

  return (
    <Modal show={isOpen} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>
          <i className="bi bi-person-dash-fill me-2"></i>
          Manage Roles for <span className="fw-bold">{userName}</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {userRoles.length === 0 ? (
          <Alert variant="info" className="text-center py-4">
            <i className="bi bi-info-circle me-2"></i>
            This user has no roles assigned.
          </Alert>
        ) : (
          <>
            <h6 className="fw-bold mb-3 text-secondary">
              <i className="bi bi-shield-fill-check me-2"></i>
              Assigned Roles ({userRoles.length})
            </h6>

            <div className="row g-3">
              {userRoles.map((role) => (
                <div key={role.id} className="col-md-6">
                  <Card className="shadow-sm border-0 h-100">
                    <Card.Body className="d-flex justify-content-between align-items-center">
                      <Stack gap={1}>
                        <Badge bg="primary" className="px-3 py-2">
                          <i className="bi bi-shield-check me-2"></i>
                          {role.display_name}
                        </Badge>
                        <small className="text-muted">
                          <strong>Name:</strong> {role.name}
                        </small>
                        <small className="text-muted">
                          <strong>Guard:</strong> {role.guard_name}
                        </small>
                      </Stack>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => setConfirmingRole(role)}
                        disabled={removeRoleMutation.isLoading}
                      >
                        <i className="bi bi-trash me-1"></i>
                        Remove
                      </Button>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          </>
        )}

        {confirmingRole && (
          <Alert variant="danger" className="mt-4">
            <h6 className="alert-heading mb-2 d-flex align-items-center">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              Confirm Removal
            </h6>
            <p>
              Are you sure you want to remove role{" "}
              <strong>{confirmingRole.display_name}</strong> from{" "}
              <strong>{userName}</strong>?
            </p>
            <p className="small text-muted">
              This action <strong>cannot be undone</strong>.
            </p>
            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setConfirmingRole(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={confirmRemoveRole}
                disabled={removeRoleMutation.isLoading}
              >
                {removeRoleMutation.isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Removing...
                  </>
                ) : (
                  <>
                    <i className="bi bi-trash me-2"></i>
                    Yes, Remove
                  </>
                )}
              </Button>
            </div>
          </Alert>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          <i className="bi bi-x-lg me-2"></i>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveRoleModal;
