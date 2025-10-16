import React from "react";
import {
  Modal,
  Button,
  Badge,
  Row,
  Col,
  Spinner,
  Alert,
  Image,
} from "react-bootstrap";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { showOneMeeting } from "../../../apis/meetings";
import { MeetingDetail } from "../../../types/meetings";
import getMediaUrl from "../../../helpers/getMediaUrl";

interface MeetingDetailsModalProps {
  show: boolean;
  onHide: () => void;
  meeting_id: string;
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
  meeting_id,
  isUserReceiver,
  isUserRequester,
  onAccept,
  onDecline,
  onEdit,
  onDelete,
  loadingRespond,
  deleting,
}) => {
  const {
    data: meeting,
    isLoading,
    error,
  } = useQuery(["meeting", meeting_id], () => showOneMeeting(meeting_id), {
    retry: false,
  });

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
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold fs-4">
          🗓️ Meeting Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-3">
        {isLoading && (
          <div className="text-center py-4">
            <Spinner animation="border" />
          </div>
        )}

        {error && (
          <Alert variant="danger">
            Error loading the meeting.
          </Alert>
        )}

        {meeting && (
          <div className="px-2">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">{meeting.topic}</h5>
              <Badge pill bg={getStatusBadgeVariant(meeting.status)}>
                {meeting.status.toUpperCase()}
              </Badge>
            </div>

            {meeting.receiver && (
              <div className="d-flex align-items-center gap-3 mb-4">
                <Image
                  src={
                    getMediaUrl(meeting.receiver.avatar) ?? "/placeholder.svg"
                  }
                  alt={`${meeting.receiver.fname} ${meeting.receiver.lname}`}
                  roundedCircle
                  width={60}
                  height={60}
                  style={{ objectFit: "cover" }}
                />
                <div>
                  <Link
                    to={`/profile/${meeting.receiver.id}`}
                    className="h6 mb-1 text-decoration-none text-dark"
                  >
                    {meeting.receiver.fname} {meeting.receiver.lname}
                  </Link>
                  <div className="text-muted small">
                    {meeting.receiver.email}
                  </div>
                </div>
              </div>
            )}

            <div className="p-3 bg-light rounded mb-3">
              <div className="fw-semibold text-dark mb-1">Location:</div>
              <div>{meeting.location}</div>
            </div>

            <Row>
              <Col>
                <div className="fw-semibold text-dark mb-1">Start Time</div>
                <div className="text-muted">
                  {formatDateTime(meeting.start_time)}
                </div>
              </Col>
              <Col>
                <div className="fw-semibold text-dark mb-1">End Time</div>
                <div className="text-muted">
                  {formatDateTime(meeting.end_time)}
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between border-0 pt-0">
        <Button variant="outline-secondary" onClick={onHide}>
          Close
        </Button>

        {meeting && (
          <div className="d-flex gap-2">
            {isUserReceiver(meeting) && meeting.status === "pending" && (
              <>
                <Button
                  variant="success"
                  onClick={onAccept}
                  disabled={loadingRespond}
                >
                  Accept
                </Button>
                <Button
                  variant="danger"
                  onClick={onDecline}
                  disabled={loadingRespond}
                >
                  Decline
                </Button>
              </>
            )}
            {isUserRequester(meeting) && (
              <Button
                variant="primary"
                onClick={onEdit}
                disabled={loadingRespond || deleting}
              >
                Edit
              </Button>
            )}
            {meeting.status === "accepted" && (
              <Button
                variant="outline-danger"
                onClick={onDelete}
                disabled={loadingRespond || deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            )}
          </div>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default MeetingDetailsModal;
