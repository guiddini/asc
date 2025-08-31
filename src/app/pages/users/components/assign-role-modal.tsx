import React, { useEffect } from "react";
import { Modal, Button, Form, Alert, Badge } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { assignRoleToUserApi, getAllRolesApi } from "../../../apis";
import { Role } from "../../../types/roles";

interface AssignRoleModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  userId: string | number;
  userName: string;
  userRoles: Role[]; // Add user's current roles
}

interface FormData {
  role_id: string;
}

const schema = yup.object({
  role_id: yup.string().required("Please select a role"),
});

const AssignRoleModal: React.FC<AssignRoleModalProps> = ({
  isOpen,
  setIsOpen,
  userId,
  userName,
  userRoles = [], // Default to empty array
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Fetch all roles
  const {
    data,
    isLoading: loadingRoles,
    error: rolesError,
  } = useQuery({
    queryKey: ["all-roles"],
    queryFn: getAllRolesApi,
    enabled: isOpen,
  });

  const roles = data?.data as Role[];

  // Get current user role IDs
  const currentRoleIds = userRoles.map((role) => role.id);

  // Filter out roles that user already has
  const availableRoles =
    roles?.filter((role) => !currentRoleIds.includes(role.id)) || [];

  // Assign role mutation
  const assignRoleMutation = useMutation({
    mutationFn: ({
      user_id,
      role_id,
    }: {
      user_id: string | number;
      role_id: string | number;
    }) => assignRoleToUserApi(user_id, role_id),
    onSuccess: () => {
      toast.success("Role assigned successfully!");
      queryClient.invalidateQueries(["users"]);
      handleClose();
    },
    onError: () => {
      toast.error("Failed to assign role. Please try again.");
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit = (data) => {
    assignRoleMutation.mutate({
      user_id: userId,
      role_id: parseInt(data.role_id),
    });
  };

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <Modal show={isOpen} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-person-plus-fill me-2 text-primary"></i>
          Assign Role
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="mb-3">
          <p className="text-muted">
            <strong>User:</strong> {userName}
          </p>
        </div>

        {/* Show current roles */}
        <div className="mb-4">
          <h6 className="mb-2">
            <i className="bi bi-shield-fill-check me-2"></i>
            Current Roles
          </h6>
          {userRoles.length > 0 ? (
            <div className="d-flex flex-wrap gap-2">
              {userRoles.map((role) => (
                <Badge key={role.id} bg="primary" className="px-2 py-1">
                  {role.display_name}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted small">No roles assigned yet</p>
          )}
        </div>

        {rolesError && (
          <Alert variant="danger">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Failed to load roles. Please try again.
          </Alert>
        )}

        {availableRoles?.length === 0 && !loadingRoles && (
          <Alert variant="info">
            <i className="bi bi-info-circle me-2"></i>
            User already has all available roles assigned.
          </Alert>
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-4">
            <Form.Label>
              <i className="bi bi-shield-check me-2"></i>
              Select Role to Assign
            </Form.Label>
            <Form.Select
              {...register("role_id")}
              isInvalid={!!errors.role_id}
              disabled={
                loadingRoles ||
                assignRoleMutation.isLoading ||
                availableRoles?.length === 0
              }
            >
              <option value="">
                {loadingRoles
                  ? "Loading roles..."
                  : availableRoles?.length === 0
                  ? "No roles available to assign"
                  : "Choose a role..."}
              </option>
              {availableRoles?.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.display_name} ({role.name})
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.role_id?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button
              variant="outline-secondary"
              onClick={handleClose}
              disabled={assignRoleMutation.isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={
                assignRoleMutation.isLoading ||
                loadingRoles ||
                availableRoles?.length === 0
              }
            >
              {assignRoleMutation.isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Assigning...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg me-2"></i>
                  Assign Role
                </>
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AssignRoleModal;
