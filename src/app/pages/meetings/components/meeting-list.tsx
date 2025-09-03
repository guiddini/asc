import React from "react";
import { ListGroup, Badge } from "react-bootstrap";
import { Meeting } from "../../../types/meetings";

interface MeetingListProps {
  currentDisplayData: Meeting[];
  viewType: "meetings" | "requests";
  onMeetingClick: (meeting: Meeting) => void;
  isUserRequester: (meeting: Meeting) => boolean;
  isUserReceiver: (meeting: Meeting) => boolean;
  formatTimeRange: (startTime: string, endTime: string) => string;
}

const MeetingList: React.FC<MeetingListProps> = ({
  currentDisplayData,
  viewType,
  onMeetingClick,
  formatTimeRange,
}) => {
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

  if (currentDisplayData.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <i
          className={`bi ${
            viewType === "meetings" ? "bi-calendar-x" : "bi-inbox"
          } display-4 mb-3`}
        />
        <h6>
          {viewType === "meetings"
            ? "Aucune réunion prévue pour cette journée"
            : "Aucune demande de réunion pour cette journée"}
        </h6>
        <p className="mb-0">Votre emploi du temps est libre !</p>
      </div>
    );
  }

  return (
    <ListGroup>
      {currentDisplayData.map((meeting) => (
        <ListGroup.Item
          key={meeting.id}
          action
          onClick={() => onMeetingClick(meeting)}
          className="d-flex justify-content-between align-items-center py-3"
        >
          <div className="d-flex align-items-center">
            <div className="me-3">
              <i
                className={`bi ${
                  viewType === "requests" ? "bi-inbox" : "bi-clock"
                } text-primary fs-4`}
              />
            </div>
            <div>
              <div className="d-flex align-items-center mb-1">
                <h6 className="mb-0 me-2">
                  <i className="bi bi-chat-text me-2" />
                  {meeting.topic}
                </h6>
                {meeting.status && (
                  <Badge bg={getStatusBadgeVariant(meeting.status)}>
                    {meeting.status.toUpperCase()}
                  </Badge>
                )}
              </div>
              <small className="text-muted d-block">
                <i className="bi bi-geo-alt me-1" />
                {meeting.location}
              </small>
              <small className="text-muted">
                <i className="bi bi-clock me-1" />
                {formatTimeRange(meeting.start_time, meeting.end_time)}
                {viewType === "requests" && (
                  <span className="ms-2">
                    • Demande de l'utilisateur {meeting.requester_id}
                  </span>
                )}
              </small>
            </div>
          </div>
          <div>
            <i className="bi bi-chevron-right text-muted" />
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default MeetingList;
