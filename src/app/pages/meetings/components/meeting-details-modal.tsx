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
  Card,
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

const getStatusIcon = (status: string) => {
  switch (status) {
    case "accepted":
      return "bi-check-circle-fill";
    case "declined":
      return "bi-x-circle-fill";
    default:
      return "bi-clock-fill";
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
    <Modal show={show} onHide={onHide} centered size="lg" backdrop="static">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="d-flex align-items-center">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle me-3"
            style={{
              width: "45px",
              height: "45px",
              backgroundColor: "#e7f3ff",
            }}
          >
            <i
              className="bi bi-calendar-event text-primary"
              style={{ fontSize: "1.3rem" }}
            />
          </div>
          <div>
            <h4 className="mb-0 fw-bold">Meeting Details</h4>
            <small className="text-muted">View meeting information</small>
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4 py-4">
        {isLoading && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <div className="mt-3 text-muted">Loading meeting details...</div>
          </div>
        )}

        {error && (
          <Alert variant="danger" className="d-flex align-items-center">
            <i className="bi bi-exclamation-triangle-fill me-2" />
            Error loading the meeting details. Please try again.
          </Alert>
        )}

        {meeting && (
          <div>
            {/* Meeting Header */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="flex-grow-1">
                    <h5 className="mb-2 fw-bold text-dark">{meeting.topic}</h5>
                    <div className="text-muted">
                      <i className="bi bi-calendar3 me-2" />
                      Meeting Discussion
                    </div>
                  </div>
                  <Badge
                    bg={getStatusBadgeVariant(meeting.status)}
                    className="px-3 py-2 fs-6 d-flex align-items-center"
                    style={{ borderRadius: "20px" }}
                  >
                    <i className={`bi ${getStatusIcon(meeting.status)} me-2`} />
                    {meeting.status.toUpperCase()}
                  </Badge>
                </div>
              </Card.Body>
            </Card>

            {/* Participant Info */}
            {meeting.receiver && (
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-4">
                  <h6 className="fw-bold text-dark mb-3">
                    <i className="bi bi-person-fill me-2 text-primary" />
                    Meeting Participant
                  </h6>
                  <div className="d-flex align-items-center">
                    <div className="position-relative me-3">
                      <Image
                        src={
                          getMediaUrl(meeting.receiver.avatar) ??
                          "/placeholder.svg"
                        }
                        alt={`${meeting.receiver.fname} ${meeting.receiver.lname}`}
                        roundedCircle
                        width={70}
                        height={70}
                        style={{
                          objectFit: "cover",
                          border: "3px solid #e9ecef",
                        }}
                      />
                      <div
                        className="position-absolute bottom-0 end-0 bg-success rounded-circle"
                        style={{
                          width: "20px",
                          height: "20px",
                          border: "3px solid white",
                        }}
                      />
                    </div>
                    <div>
                      <Link
                        to={`/profile/${meeting.receiver.id}`}
                        className="h6 mb-1 text-decoration-none fw-bold"
                        style={{ color: "#2c3e50" }}
                      >
                        {meeting.receiver.fname} {meeting.receiver.lname}
                      </Link>
                      <div className="text-muted d-flex align-items-center">
                        <i className="bi bi-envelope me-2" />
                        {meeting.receiver.email}
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Meeting Details */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h6 className="fw-bold text-dark mb-3">
                  <i className="bi bi-info-circle-fill me-2 text-info" />
                  Meeting Information
                </h6>

                {/* Location */}
                <div
                  className="mb-4 p-3 rounded"
                  style={{ backgroundColor: "#f8f9fa" }}
                >
                  <div className="d-flex align-items-center">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle me-3"
                      style={{
                        width: "35px",
                        height: "35px",
                        backgroundColor: "#fff3cd",
                      }}
                    >
                      <i className="bi bi-geo-alt-fill text-warning" />
                    </div>
                    <div>
                      <div className="fw-semibold text-dark mb-1">Location</div>
                      <div className="text-muted">{meeting.location}</div>
                    </div>
                  </div>
                </div>

                {/* Time Information */}
                <Row>
                  <Col md={6}>
                    <div
                      className="p-3 rounded h-100"
                      style={{ backgroundColor: "#d1edff" }}
                    >
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-play-circle-fill text-success me-2" />
                        <span className="fw-semibold text-dark">
                          Start Time
                        </span>
                      </div>
                      <div className="text-muted small">
                        {formatDateTime(meeting.start_time)}
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div
                      className="p-3 rounded h-100"
                      style={{ backgroundColor: "#ffe6e6" }}
                    >
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-stop-circle-fill text-danger me-2" />
                        <span className="fw-semibold text-dark">End Time</span>
                      </div>
                      <div className="text-muted small">
                        {formatDateTime(meeting.end_time)}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="border-0 px-4 pb-4">
        <div className="d-flex justify-content-between w-100">
          <Button
            variant="outline-secondary"
            onClick={onHide}
            className="px-4 py-2 fw-semibold"
            style={{
              borderRadius: "8px",
              border: "2px solid",
            }}
          >
            <i className="bi bi-x-circle me-2" />
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
                    className="px-4 py-2 fw-semibold"
                    style={{
                      borderRadius: "8px",
                      border: "2px solid transparent",
                    }}
                  >
                    {loadingRespond ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Accepting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle-fill me-2" />
                        Accept
                      </>
                    )}
                  </Button>
                  <Button
                    variant="danger"
                    onClick={onDecline}
                    disabled={loadingRespond}
                    className="px-4 py-2 fw-semibold"
                    style={{
                      borderRadius: "8px",
                      border: "2px solid transparent",
                    }}
                  >
                    {loadingRespond ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Declining...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-x-circle-fill me-2" />
                        Decline
                      </>
                    )}
                  </Button>
                </>
              )}
              {isUserRequester(meeting) && (
                <Button
                  variant="primary"
                  onClick={onEdit}
                  disabled={loadingRespond || deleting}
                  className="px-4 py-2 fw-semibold"
                  style={{
                    borderRadius: "8px",
                    border: "2px solid transparent",
                  }}
                >
                  <i className="bi bi-pencil-square me-2" />
                  Edit
                </Button>
              )}
              {meeting.status === "accepted" && (
                <Button
                  variant="outline-danger"
                  onClick={onDelete}
                  disabled={loadingRespond || deleting}
                  className="px-4 py-2 fw-semibold"
                  style={{
                    borderRadius: "8px",
                    border: "2px solid",
                  }}
                >
                  {deleting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-trash3-fill me-2" />
                      Delete
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default MeetingDetailsModal;
