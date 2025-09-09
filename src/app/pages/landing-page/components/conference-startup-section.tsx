import React from "react";
import { Container, Row, Col } from "react-bootstrap";

// Built-in sponsors data
// const SPONSORS = [
//   "/sponsors/a-venture.webp",
//   "/sponsors/bdl.webp",
//   "/sponsors/bea.webp",
//   "/sponsors/djezzy.webp",
//   "/sponsors/saa.webp",
//   "/sponsors/aba.webp",
//   "/sponsors/bank-agrc.svg",
//   "/sponsors/cnep.png",
//   "/sponsors/gaan.png",
//   "/sponsors/gie.webp",
//   "/sponsors/h24.png",
//   "/sponsors/natixis.webp",
//   "/sponsors/nesda.png",
//   "/sponsors/noubal.jpg",
//   "/sponsors/satim.webp",
//   "/sponsors/ugca.png",
//   "/sponsors/zr.png",
// ];
const SPONSORS = [
  "/sponsors/commingSoon.jpeg",
  "/sponsors/commingSoon.jpeg",
  "/sponsors/commingSoon.jpeg",
  "/sponsors/commingSoon.jpeg",
  "/sponsors/commingSoon.jpeg",
  "/sponsors/commingSoon.jpeg",
  "/sponsors/commingSoon.jpeg",
  "/sponsors/commingSoon.jpeg",
  "/sponsors/commingSoon.jpeg",
];

// Split sponsors into two groups for better visual variety
const firstHalf = SPONSORS;
const secondHalf = [...SPONSORS].reverse(); // Use spread to avoid mutating original array

const ConferenceStartupSection: React.FC = () => {
  return (
    <section
      className="sponsors-section"
      style={{
        margin: "0 calc(-50vw + 50%)",
        width: "100vw",
        padding: "5rem 0",
        backgroundColor: "var(--bs-white)",
      }}
    >
      <Container
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 15px",
        }}
      >
        {/* Section Header */}
        <Row className="mb-5">
          <Col className="text-center">
            <h2 className="display-5 fw-bold text-dark mb-0">
              African Champion par startup{" "}
            </h2>
          </Col>
        </Row>

        {/* First Marquee - Moving Right */}
      </Container>
    </section>
  );
};

export default ConferenceStartupSection;
