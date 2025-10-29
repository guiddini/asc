import React from "react";
import { useQuery } from "react-query";
import { Modal, Spinner, Alert, Image, Button, Badge } from "react-bootstrap";
import { showConferenceById } from "../../../apis/conference";
import getMediaUrl from "../../../helpers/getMediaUrl";

interface ConferenceDetailProps {
  conferenceId: string;
  onClose: () => void;
}

const ConferenceDetail: React.FC<ConferenceDetailProps> = ({
  conferenceId,
  onClose,
}) => {
  const { data, isLoading, error } = useQuery(
    ["conference", conferenceId],
    () => showConferenceById(conferenceId),
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
        <Alert variant="danger">Failed to load conference details.</Alert>
      </Modal.Body>
    );
  }

  const { conference, meta } = data;

  return (
    <>
      <Modal.Header>
        <Modal.Title>Conference Details :</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-2">{conference.title}</h5>
        <p className="mb-2 text-muted">{conference.description}</p>
        <p>
          <strong>Location:</strong> {conference.location}
        </p>
        <p>
          <strong>Start:</strong> {new Date(conference.start_time).toLocaleString()}
          <br />
          <strong>End:</strong> {new Date(conference.end_time).toLocaleString()}
        </p>
        <div className="d-flex gap-2 mb-3">
          <Badge bg="danger">Speakers: {meta.speakers_count}</Badge>
          <Badge bg="secondary">Attendees: {meta.attendees_count}</Badge>
        </div>
        {conference.speakers.length > 0 && (
          <div className="d-flex align-items-center gap-2 flex-wrap">
            {conference.speakers.slice(0, 6).map((sp) => (
              <div key={sp.id} className="d-flex align-items-center gap-2">
                <Image
                  src={getMediaUrl(sp.avatar) ?? "/placeholder.svg"}
                  alt={`${sp.fname} ${sp.lname}`}
                  roundedCircle
                  width={40}
                  height={40}
                  style={{ objectFit: "cover" }}
                />
                <span className="small">{sp.fname} {sp.lname}</span>
              </div>
            ))}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </>
  );
};

export default ConferenceDetail;