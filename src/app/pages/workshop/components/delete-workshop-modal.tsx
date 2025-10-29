import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { deleteWorkshop } from "../../../apis/workshop";

interface DeleteWorkshopModalProps {
  show: boolean;
  onHide: () => void;
  workshopId: string;
  workshopTitle: string;
  onDeleted: () => void;
}

const DeleteWorkshopModal: React.FC<DeleteWorkshopModalProps> = ({
  show,
  onHide,
  workshopId,
  workshopTitle,
  onDeleted,
}) => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(() => deleteWorkshop(workshopId), {
    onSuccess: () => {
      toast.success("Workshop deleted successfully");
      queryClient.invalidateQueries(["workshops"]);
      onDeleted();
      onHide();
    },
    onError: () => {
      toast.error("Error deleting the workshop");
    },
  });

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete the workshop{" "}
        <strong>{workshopTitle}</strong>?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={() => mutate()} disabled={isLoading}>
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteWorkshopModal;
