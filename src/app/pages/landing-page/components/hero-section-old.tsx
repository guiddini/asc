import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

const HeroSection: React.FC = () => {
  return (
    <section className="hero-section">
      <div className="hero-gradient-bg"></div>
      <Container fluid className="hero-container">
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <div className="hero-content text-center">
              <h1 className="hero-heading display-2 fw-bold mb-4 text-white">
                Raising African Champions
              </h1>

              <p className="hero-subheading lead mb-5">
                Rejoignez le plus grand rassemblement des champions africains
                <br />
                de l'innovation et de l'entrepreneuriat.
              </p>

              <div className="hero-details mb-4">
                <p className="hero-date mb-2">Du 06 au 08 Decembre 2025</p>
                <p className="hero-location mb-0">
                  Centre International de Conference Abdeelatif Rahal,
                  <br />
                  Alger, Algerie
                </p>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col lg={12} xl={12}>
            <div className="hero-video-container">
              <div className="video-wrapper">
                <iframe
                  className="hero-video"
                  src="https://www.youtube.com/embed/0j1MiCU2bhM?si=lG0KFmcKRbKlxCGd&autoplay=1&mute=1&loop=1&playlist=0j1MiCU2bhM&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"
                  title="African Startup Conference Preview"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HeroSection;
