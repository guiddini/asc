import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { cancelWorkshop } from "../../../apis/workshop";

interface CancelWorkshopModalProps {
  show: boolean;
  onHide: () => void;
  workshopId: string;
  workshopTitle: string;
  onDeleted: () => void;
}

const CancelWorkshopModal: React.FC<CancelWorkshopModalProps> = ({
  show,
  onHide,
  workshopId,
  workshopTitle,
  onDeleted,
}) => {
  const queryClient = useQueryClient();

  const { mutate: cancelMutate, isLoading: canceling } = useMutation(
    () => cancelWorkshop(workshopId),
    {
      onSuccess: () => {
        toast.success("Workshop canceled successfully");
        queryClient.invalidateQueries(["workshops"]);
        onDeleted();
        onHide();
      },
      onError: () => {
        toast.error("Error canceling the workshop.");
      },
    }
  );

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm cancellation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to cancel the workshop{" "}
        <strong>{workshopTitle}</strong>?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={canceling}>
          Close
        </Button>
        <Button
          variant="warning"
          onClick={() => cancelMutate()}
          disabled={canceling}
        >
          {canceling ? "Canceling..." : "Cancel workshop"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CancelWorkshopModal;
