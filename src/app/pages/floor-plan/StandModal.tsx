import React from "react";
import { Modal, Button } from "react-bootstrap";

interface StandModalProps {
  show: boolean;
  onHide: () => void;
  standDetails: {
    id: string;
    name: string;
    description: string;
  } | null;
}

const StandModal: React.FC<StandModalProps> = ({
  show,
  onHide,
  standDetails,
}) => {
  if (!standDetails) return null;

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{standDetails.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>Stand ID:</strong> {standDetails.id}
        </p>
        <p>{standDetails.description}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StandModal;
