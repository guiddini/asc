import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { deleteConference } from "../../../apis/conference";

interface DeleteConfirmationModalProps {
  show: boolean;
  onHide: () => void;
  conferenceId: string;
  conferenceTitle: string;
  onDeleted: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  show,
  onHide,
  conferenceId,
  conferenceTitle,
  onDeleted,
}) => {
  const queryClient = useQueryClient();

  const { mutate: deleteMutate, isLoading: deleting } = useMutation(
    () => deleteConference(conferenceId),
    {
      onSuccess: () => {
        toast.success("Conference deleted successfully");
        queryClient.invalidateQueries(["conferences"]);
        onDeleted();
        onHide();
      },
      onError: () => {
        toast.error("Error deleting the conference.");
      },
    }
  );

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete the conference{" "}
        <strong>{conferenceTitle}</strong>?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={deleting}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={() => deleteMutate()}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModal;
