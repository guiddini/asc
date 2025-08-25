import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Handshake, Rocket, Lightbulb, Award } from "lucide-react";

const WhyParticipate = () => {
  return (
    <Container as="section" className="py-5 my-20" id="why-participate-section">
      <Row className="text-center mb-5">
        <Col lg={10} className="mx-auto">
          <span id="events-label">POURQUOI PARTICIPER ?</span>
          <h2 id="events-title">
            Les <span id="events-section-highlight">avantages uniques</span>
            <br /> de cet événement incontournable
          </h2>
          <p id="events-description">
            Découvrez comment ce rendez-vous vous ouvre des opportunités de
            réseautage, d’apprentissage, de croissance et de visibilité à
            l’échelle régionale et internationale.
          </p>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={6} lg={3} className="text-center">
          <div className="p-4 h-100 border rounded-4 shadow-sm">
            <Handshake size={36} className="mb-3 text-primary" />
            <h5 className="fw-bold mb-2">🤝 Networking exclusif</h5>
            <p className="mb-0 fs-6 text-muted">
              Connectez-vous avec les fondateurs de startups à fort impact,
              investisseurs, incubateurs et décideurs politiques.
            </p>
          </div>
        </Col>

        <Col md={6} lg={3} className="text-center">
          <div className="p-4 h-100 border rounded-4 shadow-sm">
            <Rocket size={36} className="mb-3 text-success" />
            <h5 className="fw-bold mb-2">🚀 Champion Stories</h5>
            <p className="mb-0 fs-6 text-muted">
              Découvrez le parcours des startups africaines devenues des
              références régionales et internationales.
            </p>
          </div>
        </Col>

        <Col md={6} lg={3} className="text-center">
          <div className="p-4 h-100 border rounded-4 shadow-sm">
            <Lightbulb size={36} className="mb-3 text-warning" />
            <h5 className="fw-bold mb-2">💡 Workshops & Panels</h5>
            <p className="mb-0 fs-6 text-muted">
              Des sessions interactives autour du financement, du scale-up, de
              la digitalisation et de l’intégration régionale.
            </p>
          </div>
        </Col>

        <Col md={6} lg={3} className="text-center">
          <div className="p-4 h-100 border rounded-4 shadow-sm">
            <Award size={36} className="mb-3 text-danger" />
            <h5 className="fw-bold mb-2">🏅 Startup Battle</h5>
            <p className="mb-0 fs-6 text-muted">
              La compétition qui met en avant les talents émergents du
              continent.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default WhyParticipate;
