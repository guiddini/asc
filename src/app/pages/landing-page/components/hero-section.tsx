import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

const HeroSection: React.FC = () => {
  return (
    <section className="hero-section">
      <Container fluid className="h-100">
        <Row className="h-100 g-0">
          {/* Left Column - Content */}
          <Col lg={6} className="hero-content-col d-flex align-items-center">
            <Container>
              <Row>
                <Col xl={10}>
                  <div className="hero-content">
                    <h1 className="hero-title display-4 fw-bold mb-3">
                      {" "}
                      {/* Smaller display size */}
                      Web Summit Qatar
                      <br />
                      <span className="hero-subtitle">
                        coming 1-4 February, 2026
                      </span>
                    </h1>

                    <p className="hero-description mb-3">
                      {" "}
                      {/* Removed lead class for compactness */}
                      Web Summit Qatar will return to the Doha Exhibition and
                      Convention Center (DECC) next year. Thousands of
                      international entrepreneurs, investors and leaders will
                      gather for Web Summit Qatar 2026. Join them.
                    </p>

                    <p className="hero-cta-text mb-3">
                      Book tickets for 2026 now and join us in Doha next
                      February.
                    </p>

                    <div className="hero-actions d-flex flex-column flex-sm-row gap-2">
                      {" "}
                      {/* Reduced gap */}
                      <Button
                        variant="primary"
                        size="lg"
                        className="hero-btn-primary"
                      >
                        Book tickets
                      </Button>
                      <Button
                        variant="secondary"
                        size="lg"
                        className="hero-btn-secondary"
                      >
                        Partner with us
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </Col>

          {/* Right Column - Video */}
          <Col lg={6} className="hero-video-col">
            <div className="hero-video-container position-relative">
              <div className="video-wrapper">
                <iframe
                  className="hero-video w-100"
                  src="https://www.youtube.com/embed/0j1MiCU2bhM?si=lG0KFmcKRbKlxCGd&autoplay=1&mute=1&loop=1&playlist=0j1MiCU2bhM&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"
                  title="Web Summit Qatar 2026 Preview"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>

                {/* Optional video overlay for better control */}
                <div className="video-overlay d-flex align-items-center justify-content-center">
                  <Button
                    variant="light"
                    size="lg"
                    className="play-button d-none"
                  >
                    <i className="bi bi-play-fill me-2"></i>
                    Watch Preview
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HeroSection;
