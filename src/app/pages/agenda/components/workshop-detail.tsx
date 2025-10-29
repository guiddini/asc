import React from "react";
import { useQuery } from "react-query";
import { Modal, Spinner, Alert, Image, Button, Badge } from "react-bootstrap";
import { showWorkshopById } from "../../../apis/workshop";
import getMediaUrl from "../../../helpers/getMediaUrl";

interface WorkshopDetailProps {
  workshopId: string;
  onClose: () => void;
}

const WorkshopDetail: React.FC<WorkshopDetailProps> = ({
  workshopId,
  onClose,
}) => {
  const { data, isLoading, error } = useQuery(
    ["workshop", workshopId],
    () => showWorkshopById(workshopId),
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
        <Alert variant="danger">Failed to load workshop details.</Alert>
      </Modal.Body>
    );
  }

  const { workshop, meta } = data;

  return (
    <>
      <Modal.Header>
        <Modal.Title>Workshop Details :</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5 className="mb-2">{workshop.title}</h5>
        <p className="mb-2 text-muted">{workshop.description}</p>
        <p>
          <strong>Location:</strong> {workshop.location}
        </p>
        <p>
          <strong>Start:</strong> {new Date(workshop.start_time).toLocaleString()}
          <br />
          <strong>End:</strong> {new Date(workshop.end_time).toLocaleString()}
        </p>
        <div className="d-flex gap-2 mb-3">
          <Badge bg="warning" text="dark">Speakers: {meta.speakers_count}</Badge>
          <Badge bg="secondary">Attendees: {meta.attendees_count}</Badge>
        </div>
        {workshop.speakers.length > 0 && (
          <div className="d-flex align-items-center gap-2 flex-wrap">
            {workshop.speakers.slice(0, 6).map((sp) => (
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

export default WorkshopDetail;