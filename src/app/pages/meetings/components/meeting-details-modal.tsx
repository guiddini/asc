import React from "react";
import { Modal, Button, Badge, Row, Col } from "react-bootstrap";
import { MeetingDetail } from "../../../types/meetings";

interface MeetingDetailsModalProps {
  show: boolean;
  onHide: () => void;
  meeting: MeetingDetail;
  isUserReceiver: (meeting: MeetingDetail) => boolean;
  isUserRequester: (meeting: MeetingDetail) => boolean;
  onAccept: () => void;
  onDecline: () => void;
  onEdit: () => void;
  onDelete: () => void;
  loadingRespond: boolean;
  deleting: boolean;
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "accepted":
      return "success";
    case "declined":
      return "danger";
    default:
      return "warning";
  }
};

const MeetingDetailsModal: React.FC<MeetingDetailsModalProps> = ({
  show,
  onHide,
  meeting,
  isUserReceiver,
  isUserRequester,
  onAccept,
  onDecline,
  onEdit,
  onDelete,
  loadingRespond,
  deleting,
}) => {
  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Détails de la réunion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>{meeting.topic}</h5>
        <p>{meeting.location}</p>
        <Badge pill bg={getStatusBadgeVariant(meeting.status)} className="mb-2">
          {meeting.status.toUpperCase()}
        </Badge>
        {meeting.receiver && (
          <div>
            <strong>Destinataire :</strong> {meeting.receiver.fname}{" "}
            {meeting.receiver.lname}
            <br />
            <small>{meeting.receiver.email}</small>
          </div>
        )}
        <Row className="mt-3">
          <Col>
            <strong>Heure de début</strong>
            <div>{formatDateTime(meeting.start_time)}</div>
          </Col>
          <Col>
            <strong>Heure de fin</strong>
            <div>{formatDateTime(meeting.end_time)}</div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        {isUserReceiver(meeting) && meeting.status === "pending" && (
          <>
            <Button
              variant="success"
              onClick={onAccept}
              disabled={loadingRespond}
            >
              Accepter
            </Button>
            <Button
              variant="danger"
              onClick={onDecline}
              disabled={loadingRespond}
            >
              Refuser
            </Button>
          </>
        )}
        {isUserRequester(meeting) && (
          <Button
            variant="primary"
            onClick={onEdit}
            disabled={loadingRespond || deleting}
          >
            Modifier
          </Button>
        )}
        {meeting.status === "accepted" && (
          <Button
            variant="outline-danger"
            onClick={onDelete}
            disabled={loadingRespond || deleting}
          >
            {deleting ? "Traitement en cours..." : "Supprimer"}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default MeetingDetailsModal;
