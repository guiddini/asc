import React from "react";
import { Modal, Badge, Button } from "react-bootstrap";
import { Slot } from "../../../types/slot";
import MeetingDetail from "./meeting-detail";

interface SlotDetailModalProps {
  show: boolean;
  onHide: () => void;
  slot?: Slot;
}

const SlotDetailModal: React.FC<SlotDetailModalProps> = ({
  show,
  onHide,
  slot,
}) => {
  if (!slot) return null;

  const isMeeting = slot.slotable_type === "App\\Models\\Meeting";

  const startDate = new Date(slot.start_time).toLocaleString();
  const endDate = new Date(slot.end_time).toLocaleString();

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="slot-details-modal"
      centered
    >
      {isMeeting ? (
        <MeetingDetail meetingId={slot.slotable_id} onClose={onHide} />
      ) : (
        <Modal.Body>
          <Badge bg="info" className="mb-3">
            {slot.slotable_type}
          </Badge>
          <p>
            <strong>Start:</strong> {startDate}
          </p>
          <p>
            <strong>End:</strong> {endDate}
          </p>
          <p>
            <strong>Location:</strong> {slot.slotable_type}
          </p>
        </Modal.Body>
      )}

      {!isMeeting && (
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default SlotDetailModal;
