import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const AboutSection: React.FC = () => {
  return (
    <section id="about-section" className="position-relative">
      <div id="patronage" className="py-8 mb-2 w-100">
        <Container id="patronage-container">
          <Row className="align-items-center">
            {/* Left copy */}
            <Col lg={7} className="text-white">
              <h2 id="about-section-heading" className="fw-bold mb-3">
                Under the high patronage of his excellency President of Algerian
                Republic Abdelmadjid Tebboune
              </h2>
              <p id="about-section-subtitle" className="lead">
                Experience 3 powerful days of global networking, innovation
                showcases, and future-shaping workshops. Entrepreneurs,
                investors, and thinkers will gather to drive opportunity and
                impact across Africa.
              </p>
            </Col>
            {/* Right card */}
            <Col
              lg={5}
              className="d-flex justify-content-lg-end justify-content-center mt-4 mt-lg-0"
            >
              <div id="patronage-card">
                <img
                  src="/media/startups-minister.png"
                  alt="Under the High Patronage"
                  id="patronage-image"
                  className="w-100 h-100 object-fit-contain"
                  style={{
                    borderRadius: 22,
                  }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container
        style={{
          paddingTop: "5rem",
          paddingBottom: "5rem",
        }}
      >
        <Row className="align-items-center g-5 flex-column-reverse flex-lg-row">
          {/* Image Column - should appear on the left on large screens */}
          <Col lg={6}>
            <div className="about-image-container">
              <img
                src="/media/eventili/cover.webp"
                alt="About Event"
                id="about-image"
                className="img-fluid"
                loading="lazy"
              />
            </div>
          </Col>

          {/* Content Column */}
          <Col lg={6} className="mb-4 mb-lg-0">
            {/* If you have a neutral event logo, put it here */}
            <img
              src="media/eventili/logos/logo.svg"
              alt="Event Logo"
              id="about-logo"
              style={{ width: 100, marginBottom: 18, display: "block" }}
              className="d-none d-md-block mx-auto"
            />
            <div id="about-content">
              <p id="about-description">
                The African Startup Conference is the ultimate Pan-African stage
                for innovation and entrepreneurship. From December 6–8, 2025, in
                Algiers, its 4th edition will celebrate the “African Champions”
                bold startups, visionary investors, forward-thinking
                policymakers, and the vibrant diaspora all, coming together to
                shape a competitive, sovereign, and world-class tech ecosystem
              </p>
              {/* Endorsement/Organization Banner */}
              <div
                id="ministry-endorsement"
                className="d-flex justify-content-between align-items-center gap-3 mt-4 rounded-3 bg-light p-3 shadow-sm w-100"
              >
                <img
                  src="/media/startups-minister.png"
                  alt="Ministry logo"
                  height={48}
                  className="ministry-logo"
                  style={{ marginRight: 12 }}
                />
                <div className="endorsement-text text-muted">
                  <p>
                    Organized by the Ministry of Knowledge Economy, <br />
                    Startups and Micro-Enterprises, and Algeria Venture
                  </p>
                </div>
                <img
                  src="/media/algeria-venture-logo.svg.svg"
                  alt="Ministry logo"
                  height={48}
                  className="ministry-logo"
                  style={{ marginLeft: 12, height: 30, width: "auto" }}
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutSection;
