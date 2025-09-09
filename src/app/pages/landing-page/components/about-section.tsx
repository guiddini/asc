import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const AboutSection: React.FC = () => {
  return (
    <section className="about-section pt-5 position-relative">
      <div className="patronage-section py-8 mb-2 w-100">
        <Container
          style={{
            paddingTop: "5rem",
            paddingBottom: "5rem",
          }}
        >
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <div className="patronage-image-container mb-4">
                <img
                  src="/media/startups-minister.png"
                  alt="Under the High Patronage"
                  className="patronage-image img-fluid"
                  width={180}
                  height={100}
                />
              </div>
              <h2 className="patronage-title display-5 fw-bold mb-3">
                Under the High Patronage of the President of the Republic
                {/* Sous le Haut Patronage du Président de la République */}
              </h2>
              <p className="patronage-subtitle lead text-muted">
                {/* Vivez trois jours intenses de réseautage mondial, de présentations d'innovations et d'ateliers porteurs d'avenir. Entrepreneurs, investisseurs et penseurs se réuniront pour créer des opportunités et créer un impact en Afrique. */}
                Experience 3 powerful days of global networking, innovation
                showcases, and future-shaping workshops. Entrepreneurs,
                investors, and thinkers will gather to drive opportunity and
                impact across Africa.
              </p>
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
          {/* Left Content Column */}
          <Col lg={6} className="mb-4 mb-lg-0">
            {/* If you have a neutral event logo, put it here */}
            <img
              src="media/eventili/logos/logo.svg"
              alt="Event Logo"
              style={{ width: 70, marginBottom: 18, display: "block" }}
              className="d-none d-md-block"
            />
            <div className="about-content">
              <p className="about-description">
                The African Startup Conference is the ultimate Pan-African stage
                for innovation and entrepreneurship. From December 6–8, 2025, in
                Algiers, its 4th edition will celebrate the “African Champions”
                bold startups, visionary investors, forward-thinking
                policymakers, and the vibrant diaspora all,, coming together to
                shape a competitive, sovereign, and world-class tech ecosystem
              </p>
              {/* Endorsement/Organization Banner */}
              <div className="ministry-endorsement d-flex align-items-center gap-3 mt-4 rounded-3 bg-light p-3 shadow-sm">
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
              </div>
            </div>
          </Col>

          {/* Right Image Column */}
          <Col lg={6}>
            <div className="about-image-container">
              <img
                src="/media/eventili/cover.webp"
                alt="About Event"
                className="about-image img-fluid"
                loading="lazy"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutSection;
