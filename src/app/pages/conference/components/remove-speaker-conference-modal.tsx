import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { removeSpeakerFromConference } from "../../../apis/conference";
import { ConferenceSpeaker } from "../../../types/conference";

interface RemoveSpeakerFromConferenceModalProps {
  conferenceId: string;
  speaker: ConferenceSpeaker | null;
  show: boolean;
  onClose: () => void;
  onRemoved: () => void;
}

const RemoveSpeakerFromConferenceModal: React.FC<
  RemoveSpeakerFromConferenceModalProps
> = ({ conferenceId, speaker, show, onClose, onRemoved }) => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    () => removeSpeakerFromConference(conferenceId, speaker!.id),
    {
      onSuccess: () => {
        toast.success("Conférencier retiré avec succès");
        queryClient.invalidateQueries(["conferences", conferenceId]);
        onRemoved();
        onClose();
      },
      onError: () => {
        toast.error("Erreur lors du retrait du conférencier");
      },
    }
  );

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Retirer ce conférencier ?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {speaker && (
          <p>
            Êtes-vous sûr de vouloir retirer{" "}
            <strong>
              {speaker.fname} {speaker.lname}
            </strong>{" "}
            de la conférence ?
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          Annuler
        </Button>
        <Button variant="danger" onClick={() => mutate()} disabled={isLoading}>
          {isLoading ? "Suppression..." : "Retirer"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveSpeakerFromConferenceModal;
