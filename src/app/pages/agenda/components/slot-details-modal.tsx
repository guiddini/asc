import React from "react";
import { Modal, Badge, Button } from "react-bootstrap";
import { Slot } from "../../../types/slot";
import MeetingDetail from "./meeting-detail";
import ConferenceDetail from "./conference-detail";
import WorkshopDetail from "./workshop-detail";

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

  const startDate = new Date(slot.start_time).toLocaleString();
  const endDate = new Date(slot.end_time).toLocaleString();

  const renderContent = () => {
    switch (slot.slotable_type) {
      case "App\\Models\\Meeting":
        return <MeetingDetail meetingId={slot.slotable_id} onClose={onHide} />;
      case "App\\Models\\Conference":
        return (
          <ConferenceDetail conferenceId={slot.slotable_id} onClose={onHide} />
        );
      case "App\\Models\\Workshop":
        return (
          <WorkshopDetail workshopId={slot.slotable_id} onClose={onHide} />
        );
      default:
        return (
          <>
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
            <Modal.Footer>
              <Button variant="secondary" onClick={onHide}>
                Close
              </Button>
            </Modal.Footer>
          </>
        );
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="slot-details-modal"
      centered
    >
      {renderContent()}
    </Modal>
  );
};

export default SlotDetailModal;
