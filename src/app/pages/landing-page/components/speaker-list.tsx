import React from "react";
import { Row, Col } from "react-bootstrap";
import { Speaker } from "../types/speaker";
import SpeakerCard from "./speaker-card";

interface SpeakerListProps {
  speakers: Speaker[];
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

const SpeakerList: React.FC<SpeakerListProps> = ({
  speakers,
  columns = { xs: 1, sm: 1, md: 2, lg: 3, xl: 4 },
}) => {
  const getColProps = () => {
    const colProps: any = {};
    if (columns.xs) colProps.xs = 12 / columns.xs;
    if (columns.sm) colProps.sm = 12 / columns.sm;
    if (columns.md) colProps.md = 12 / columns.md;
    if (columns.lg) colProps.lg = 12 / columns.lg;
    if (columns.xl) colProps.xl = 12 / columns.xl;
    return colProps;
  };

  return (
    <div className="speaker-list">
      <Row className="g-4 justify-content-center">
        {speakers.map((speaker) => (
          <Col key={speaker.slug} {...getColProps()}>
            <SpeakerCard speaker={speaker} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SpeakerList;
