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
        toast.success("Conférence supprimée avec succès");
        queryClient.invalidateQueries(["conferences"]);
        onDeleted();
        onHide();
      },
      onError: () => {
        toast.error("Erreur lors de la suppression de la conférence.");
      },
    }
  );

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmer la suppression</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Êtes-vous sûr de vouloir supprimer la conférence{" "}
        <strong>{conferenceTitle}</strong> ?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={deleting}>
          Annuler
        </Button>
        <Button
          variant="danger"
          onClick={() => deleteMutate()}
          disabled={deleting}
        >
          {deleting ? "Suppression..." : "Supprimer"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModal;
