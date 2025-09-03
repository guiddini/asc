import React from "react";
import { Row, Col } from "react-bootstrap";
import SpeakerCard from "./speaker-card";

interface SpeakerListProps {
  speakers: {
    id: string;
    avatar: string;
    fname: string;
    lname: string;
  }[];
}

const SpeakerList: React.FC<SpeakerListProps> = ({ speakers }) => (
  <Row className="g-4 w-100" xs={12} sm={12} md={12} lg={12}>
    {speakers.map((speaker) => (
      <Col key={speaker.id} xs={12} sm={6} md={4} lg={3}>
        <SpeakerCard speaker={speaker} />
      </Col>
    ))}
  </Row>
);

export default SpeakerList;
