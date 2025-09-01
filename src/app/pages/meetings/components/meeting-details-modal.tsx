import React from "react";
import { Modal, Button, Badge, Card, Row, Col } from "react-bootstrap";
import { MeetingDetail } from "../../../types/meetings";
import getMediaUrl from "../../../helpers/getMediaUrl";
import { Link } from "react-router-dom";

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
    new Date(dateString).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title>
          <i className="bi bi-info-circle me-2 text-primary" />
          Meeting Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-0">
        <div className="text-center">
          <div className="mb-4">
            <i className="bi bi-calendar-event display-4 text-primary mb-3" />
            <h5 className="mb-2">{meeting.topic}</h5>
            <p className="text-muted mb-3">{meeting.location}</p>
            <Badge bg={getStatusBadgeVariant(meeting.status)} className="fs-6">
              {meeting.status.toUpperCase()}
            </Badge>
          </div>

          {meeting.receiver && (
            <Card className="mb-4">
              <Card.Body className="d-flex align-items-center gap-3">
                <img
                  src={
                    getMediaUrl(meeting.receiver.avatar) || "/placeholder.svg"
                  }
                  alt={`${meeting.receiver.fname} ${meeting.receiver.lname}`}
                  className="rounded-circle"
                  style={{ width: 60, height: 60, objectFit: "cover" }}
                />
                <Link
                  to={`/profile/${meeting.receiver.id}`}
                  className="text-start"
                >
                  <h6 className="mb-0">
                    {meeting.receiver.fname} {meeting.receiver.lname}
                  </h6>
                  <small className="text-muted d-block">
                    {meeting.receiver.email}
                  </small>
                </Link>
              </Card.Body>
            </Card>
          )}

          <Row className="g-4">
            <Col md={6}>
              <Card className="border-0 bg-light">
                <Card.Body className="text-center">
                  <i className="bi bi-calendar-check text-primary fs-3 mb-2" />
                  <h6 className="mb-1">Start Time</h6>
                  <small className="text-muted">
                    {formatDateTime(meeting.start_time)}
                  </small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="border-0 bg-light">
                <Card.Body className="text-center">
                  <i className="bi bi-clock text-primary fs-3 mb-2" />
                  <h6 className="mb-1">End Time</h6>
                  <small className="text-muted">
                    {formatDateTime(meeting.end_time)}
                  </small>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0 justify-content-center">
        <div className="d-flex gap-2 flex-wrap">
          {/* Accept/Decline buttons */}
          {isUserReceiver(meeting) && meeting.status === "pending" && (
            <>
              <Button
                variant="success"
                size="sm"
                onClick={onAccept}
                disabled={loadingRespond}
              >
                <i className="bi bi-check-circle me-1" />
                Accept
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={onDecline}
                disabled={loadingRespond}
              >
                <i className="bi bi-x-circle me-1" />
                Decline
              </Button>
            </>
          )}

          {/* Edit button */}
          {isUserRequester(meeting) && (
            <Button variant="primary" size="sm" onClick={onEdit}>
              <i className="bi bi-pencil me-1" />
              Edit
            </Button>
          )}

          {/* Delete button */}
          <Button
            variant="outline-danger"
            size="sm"
            onClick={onDelete}
            disabled={deleting}
          >
            <i className="bi bi-trash me-1" />
            Delete
          </Button>

          <Button variant="outline-secondary" size="sm" onClick={onHide}>
            Close
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default MeetingDetailsModal;
