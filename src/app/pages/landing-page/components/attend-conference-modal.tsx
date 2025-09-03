import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { joinConference } from "../../../apis/conference";

interface AttendConferenceModalProps {
  show: boolean;
  onHide: () => void;
  conferenceId: string;
  conferenceTitle: string;
}

const AttendConferenceModal: React.FC<AttendConferenceModalProps> = ({
  show,
  onHide,
  conferenceId,
  conferenceTitle,
}) => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    () => joinConference(conferenceId),
    {
      onSuccess: () => {
        toast.success("Inscription réussie !");
        queryClient.invalidateQueries(["conferences-public", conferenceId]);
        onHide();
      },
      onError: () => {
        toast.error("Erreur lors de l'inscription à la conférence.");
      },
    }
  );

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Participer à la conférence</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Voulez-vous assister à la conférence{" "}
          <strong>{conferenceTitle}</strong> ?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isLoading}>
          Annuler
        </Button>
        <Button variant="primary" onClick={() => mutate()} disabled={isLoading}>
          {isLoading ? "Inscription en cours..." : "S'inscrire"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AttendConferenceModal;
