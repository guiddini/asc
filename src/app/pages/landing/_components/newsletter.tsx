import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const Newsletter = () => {
  return (
    <Container as="section" className="py-5 my-20" id="newsletter-section">
      <Row className="text-center mb-5">
        <Col lg={8} className="mx-auto">
          <span id="events-label">📩 Restez connectés</span>
          <h2 id="events-title">
            Ne manquez{" "}
            <span id="events-section-highlight">aucune actualité</span>
          </h2>
          <p id="events-description">
            👉 Inscrivez-vous à notre newsletter pour recevoir les dernières
            mises à jour sur les intervenants, le programme et les opportunités
            exclusives.
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Form className="d-flex">
            <Form.Control
              type="email"
              placeholder="Entrez votre adresse e-mail"
              className="rounded-start-4 px-3 py-3"
            />
            <Button
              variant="primary"
              type="submit"
              className="rounded-end-4 px-4 fw-bold"
            >
              S'inscrire
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Newsletter;
