import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { deleteSponsor } from "../../../apis/sponsor";
import type { Sponsor } from "../../../types/sponsor";

interface Props {
  show: boolean;
  sponsor: Sponsor | null;
  onClose: () => void;
}

const DeleteSponsorModal: React.FC<Props> = ({ show, sponsor, onClose }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    async () => {
      if (!sponsor) return;
      return await deleteSponsor(sponsor.id);
    },
    {
      onSuccess: () => {
        toast.success("Sponsor deleted successfully");
        queryClient.invalidateQueries("sponsors");
        onClose();
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to delete sponsor");
      },
    }
  );

  const handleDelete = () => mutation.mutate();

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete Sponsor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {sponsor ? (
          <p>
            Are you sure you want to delete <strong>{sponsor.name}</strong>?
            This action cannot be undone.
          </p>
        ) : (
          <p>Are you sure you want to delete this sponsor?</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={mutation.isLoading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={mutation.isLoading}>
          {mutation.isLoading ? "Deleting..." : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteSponsorModal;