import React from "react";
import { useQuery } from "react-query";
import { Modal, Badge, Spinner, Alert, Image, Button } from "react-bootstrap";
import { showOneMeeting } from "../../../apis/meetings";
import { MeetingDetail } from "../../../types/meetings";
import getMediaUrl from "../../../helpers/getMediaUrl";
import { Link } from "react-router-dom";

interface MeetingDetailProps {
  meetingId: string;
  onClose: () => void;
}

const MeetingDetail: React.FC<MeetingDetailProps> = ({
  meetingId,
  onClose,
}) => {
  const { data, isLoading, error } = useQuery<MeetingDetail>(
    ["meeting", meetingId],
    () => showOneMeeting(meetingId),
    { retry: false }
  );

  if (isLoading) {
    return (
      <Modal.Body>
        <Spinner animation="border" />
      </Modal.Body>
    );
  }

  if (error || !data) {
    return (
      <Modal.Body>
        <Alert variant="danger">Failed to load meeting details.</Alert>
      </Modal.Body>
    );
  }

  return (
    <>
      <Modal.Header>
        <Modal.Title>Meeting Details :</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>Location:</strong> {data.location}
        </p>
        <p>
          <strong>Start:</strong> {new Date(data.start_time).toLocaleString()}
          <br />
          <strong>End:</strong> {new Date(data.end_time).toLocaleString()}
        </p>
        <hr />
        <div className="d-flex align-items-center gap-3">
          <Image
            src={getMediaUrl(data.receiver.avatar) ?? "/placeholder.svg"}
            alt={`${data.receiver.fname} ${data.receiver.lname}`}
            roundedCircle
            width={60}
            height={60}
            style={{ objectFit: "cover" }}
          />
          <div>
            <Link
              to={`/profile/${data.receiver.id}`}
              className="h6 mb-0 text-decoration-none"
            >
              {data.receiver.fname} {data.receiver.lname}
            </Link>
            <div className="text-muted">{data.receiver.email}</div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </>
  );
};

export default MeetingDetail;
