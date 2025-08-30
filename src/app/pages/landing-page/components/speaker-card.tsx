import React from "react";
import { Card } from "react-bootstrap";
import { Speaker } from "../types/speaker";

interface SpeakerCardProps {
  speaker: Speaker;
}

const SpeakerCard: React.FC<SpeakerCardProps> = ({ speaker }) => {
  return (
    <Card className="speaker-card h-100 shadow-sm border-0">
      <Card.Body className="p-4 text-center">
        {/* Speaker Avatar */}
        <div className="speaker-avatar mb-3">
          <img
            src={speaker.avatar}
            alt={speaker.name}
            className="rounded-circle mx-auto d-block"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              border: "3px solid var(--bs-primary)",
            }}
          />
        </div>

        {/* Speaker Info */}
        <div className="speaker-info">
          <h5 className="speaker-name fw-bold text-dark mb-2">
            {speaker.name}
          </h5>
          <p className="speaker-title text-muted mb-2">{speaker.title}</p>
          <p className="speaker-affiliation text-primary small fw-medium mb-0">
            <i className="bi bi-building me-1"></i>
            {speaker.affiliation}
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SpeakerCard;
