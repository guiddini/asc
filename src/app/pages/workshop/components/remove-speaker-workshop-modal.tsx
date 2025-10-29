import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { removeSpeakerFromWorkshop } from "../../../apis/workshop";
import { ConferenceSpeaker } from "../../../types/conference";

interface RemoveSpeakerFromWorkshopModalProps {
  workshopId: string;
  speaker: ConferenceSpeaker | null;
  show: boolean;
  onClose: () => void;
  onRemoved: () => void;
}

const RemoveSpeakerFromWorkshopModal: React.FC<
  RemoveSpeakerFromWorkshopModalProps
> = ({ workshopId, speaker, show, onClose, onRemoved }) => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    () => removeSpeakerFromWorkshop(workshopId, speaker!.id),
    {
      onSuccess: () => {
        toast.success("Speaker removed successfully");
        queryClient.invalidateQueries(["conferences", workshopId]);
        onRemoved();
        onClose();
      },
      onError: () => {
        toast.error("Error removing the speaker");
      },
    }
  );

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Remove this speaker?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {speaker && (
          <p>
            Are you sure you want to remove{" "}
            <strong>
              {speaker.fname} {speaker.lname}
            </strong>{" "}
            from the workshop?
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={() => mutate()} disabled={isLoading}>
          {isLoading ? "Removing..." : "Remove"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveSpeakerFromWorkshopModal;
