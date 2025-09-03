import React from "react";
import { Card } from "react-bootstrap";
import getMediaUrl from "../../../helpers/getMediaUrl";
import { Link } from "react-router-dom";

interface SpeakerCardProps {
  speaker: { id: string; avatar: string; fname: string; lname: string };
}

const SpeakerCard: React.FC<SpeakerCardProps> = ({ speaker }) => {
  return (
    <Card
      as={Link}
      to={`/speakers/${speaker.id}`}
      className="speaker-card h-100 shadow-sm border-0"
    >
      <Card.Body className="p-4 text-center">
        <div className="speaker-avatar mb-3">
          <img
            src={getMediaUrl(speaker.avatar)}
            alt={speaker.fname}
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
            {speaker.fname}
          </h5>
          <p className="speaker-title text-muted mb-2">{speaker.lname}</p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SpeakerCard;
