import React from "react";
import { Container, Row, Col } from "react-bootstrap";

// Built-in sponsors data
const SPONSORS = [
  "/sponsors/a-venture.webp",
  "/sponsors/bdl.webp",
  "/sponsors/bea.webp",
  "/sponsors/djezzy.webp",
  "/sponsors/saa.webp",
  "/sponsors/aba.webp",
  "/sponsors/bank-agrc.svg",
  "/sponsors/cnep.png",
  "/sponsors/gaan.png",
  "/sponsors/gie.webp",
  "/sponsors/h24.png",
  "/sponsors/natixis.webp",
  "/sponsors/nesda.png",
  "/sponsors/noubal.jpg",
  "/sponsors/satim.webp",
  "/sponsors/ugca.png",
  "/sponsors/zr.png",
];

// Split sponsors into two groups for better visual variety
const firstHalf = SPONSORS;
const secondHalf = [...SPONSORS].reverse(); // Use spread to avoid mutating original array

const SponsorsSection: React.FC = () => {
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
              Official Sponsor
            </h2>
          </Col>
        </Row>

        {/* First Marquee - Moving Right */}
        <div className="marquee-container mb-4">
          <div className="marquee left-to-right">
            <div className="marquee-wrapper">
              {firstHalf.map((sponsor, index) => (
                <div key={`first-right-${index}`} className="marquee-item">
                  <img
                    src={sponsor}
                    alt={`Sponsor ${index + 1}`}
                    className="sponsor-logo"
                  />
                </div>
              ))}
            </div>
            <div className="marquee-wrapper">
              {firstHalf.map((sponsor, index) => (
                <div key={`first-right-dup-${index}`} className="marquee-item">
                  <img
                    src={sponsor}
                    alt={`Sponsor ${index + 1}`}
                    className="sponsor-logo"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Second Marquee - Moving Left */}
        <div className="marquee-container">
          <div className="marquee right-to-left">
            <div className="marquee-wrapper">
              {secondHalf.map((sponsor, index) => (
                <div key={`second-left-${index}`} className="marquee-item">
                  <img
                    src={sponsor}
                    alt={`Sponsor ${index + 1}`}
                    className="sponsor-logo"
                  />
                </div>
              ))}
            </div>
            <div className="marquee-wrapper">
              {secondHalf.map((sponsor, index) => (
                <div key={`second-left-dup-${index}`} className="marquee-item">
                  <img
                    src={sponsor}
                    alt={`Sponsor ${index + 1}`}
                    className="sponsor-logo"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default SponsorsSection;
