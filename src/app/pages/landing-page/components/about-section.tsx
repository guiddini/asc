import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const AboutSection: React.FC = () => {
  return (
    <section className="about-section">
      <Container>
        <Row className="align-items-center g-5">
          {/* Right Column - Image */}
          <Col lg={6}>
            <div className="about-image-container">
              <img
                src="/media/eventili/cover.webp"
                alt="Doha Qatar Skyline"
                className="about-image img-fluid"
              />
            </div>
          </Col>

          {/* Left Column - Content */}
          <Col lg={6}>
            <div className="about-content">
              <h2 className="about-title display-5 fw-bold mb-4">
                Why will 30,000+ people gather in Qatar?
              </h2>

              <p className="about-description">
                Web Summit Qatar helps to connect a new generation of founders
                in the Middle East to investors, journalists and more around the
                world. We're proud of our track record when it comes to live
                events. The Guardian called us "Glastonbury for geeks". Al
                Jazeera has said we run "The largest gathering of international
                start-ups in the Middle East."
              </p>

              {/* Ministry Endorsement */}
              <div className="ministry-endorsement mt-5">
                <div className="d-flex align-items-center">
                  <img
                    src="/media/startups-minister.png"
                    alt="Ministry Logo"
                    className="ministry-logo me-3"
                    style={{
                      height: "60px",
                      width: "auto",
                      objectFit: "contain",
                    }}
                  />
                  <div className="endorsement-text">
                    <p className="mb-0 text-muted fw-medium">
                      Under the high patronage of the President of the Republic
                    </p>
                    <p className="mb-0 text-muted fw-medium">
                      Get ready for 3 full days of enthralling conferences,
                      live-action workshops, matched concierge networking and
                      business partnerships.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutSection;
