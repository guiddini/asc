import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const AboutSection: React.FC = () => {
  return (
    <section className="about-section">
      {/* Patronage Section */}
      <div className="patronage-section py-10 mb-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <div className="patronage-image-container mb-4">
                <img
                  src="/media/startups-minister.png"
                  alt="Under the high patronage of the President of the Republic"
                  className="patronage-image img-fluid"
                  width="200"
                />
              </div>
              <h2 className="patronage-title display-4 fw-bold mb-3">
                Under the high patronage of the President of the Republic
              </h2>
              <p className="patronage-subtitle lead text-muted">
                Get ready for 3 full days of enthralling conferences,
                live-action workshops, matched concierge networking and business
                partnerships.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Original About Section */}
      <Container>
        <Row className="align-items-center g-5">
          {/* Right Column - Image */}
          <Col lg={6}>
            <div className="about-image-container">
              <img
                src="/media/eventili/cover.webp"
                alt="About Event"
                className="about-image img-fluid"
              />
            </div>
          </Col>

          {/* Left Column - Content */}
          <Col lg={6}>
            <div className="about-content">
              <h2 className="about-title display-5 fw-bold mb-4">
                Why will 30,000+ people gather in Algiers?
              </h2>

              <p className="about-description">
                The African Startup Conference connects a new generation of
                founders across Africa with investors, policymakers,
                journalists, and global partners. We're proud of our track
                record in bringing ecosystems together and creating
                opportunities for collaboration.
                <br />
                African Startup Conference Connecting a new generation of
                founders in Africa with investors, policymakers, journalists,
                and innovators from around the world.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutSection;
