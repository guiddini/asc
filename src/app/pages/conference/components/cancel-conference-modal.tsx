import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { cancelConference } from "../../../apis/conference";

interface CancelConfirmationModalProps {
  show: boolean;
  onHide: () => void;
  conferenceId: string;
  conferenceTitle: string;
  onDeleted: () => void;
}

const CancelConfirmationModal: React.FC<CancelConfirmationModalProps> = ({
  show,
  onHide,
  conferenceId,
  conferenceTitle,
  onDeleted,
}) => {
  const queryClient = useQueryClient();

  const { mutate: cancelMutate, isLoading: canceling } = useMutation(
    () => cancelConference(conferenceId),
    {
      onSuccess: () => {
        toast.success("Conférence annulée avec succès");
        queryClient.invalidateQueries(["conferences"]);
        onDeleted();
        onHide();
      },
      onError: () => {
        toast.error("Erreur lors de l'annulation de la conférence.");
      },
    }
  );

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmer l'annulation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Êtes-vous sûr de vouloir annuler la conférence{" "}
        <strong>{conferenceTitle}</strong> ?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={canceling}>
          Annuler
        </Button>
        <Button
          variant="warning"
          onClick={() => cancelMutate()}
          disabled={canceling}
        >
          {canceling ? "Annulation en cours..." : "Annuler la conférence"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CancelConfirmationModal;
