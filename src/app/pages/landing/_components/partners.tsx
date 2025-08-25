import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";

const Partners = () => {
  return (
    <Container as="section" className="py-5 my-20 text-center">
      <span id="events-label">
        Sous le haut patronage du président de la république
      </span>
      <h2 id="events-title">
        Un message pour <span id="events-section-highlight">l’innovation</span>
        <br /> et l’avenir de l’Afrique
      </h2>
      <p id="events-description">
        C’est avec une immense fierté que je prends part à la troisième édition
        de l’African Startup Conference, placée cette année sous le thème{" "}
        <span className="fw-semibold">
          “Le regroupement des champions africains”
        </span>
        . Cet événement est le symbole d’une Afrique qui se réinvente, qui
        innove et qui mise sur sa jeunesse et son génie créatif pour bâtir un
        avenir prospère et inclusif.
      </p>

      <Row className="justify-content-center mt-5 align-items-center">
        <Col xs="auto" className="d-flex flex-column align-items-center">
          <Image
            src="/media/minister.jpg"
            alt="Portrait M. Noureddine Ouadah"
            roundedCircle
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
            className="mb-3"
          />
          <h5 className="fw-bold mb-1">M. Noureddine Ouadah</h5>
          <p className="text-muted mb-0 fs-6">
            Ministre de l'économie de la connaissance,
            <br /> des startups et microentreprises
          </p>
        </Col>

        <Col xs="auto" className="d-flex flex-column align-items-center ms-4">
          <Image
            src="/media/startups-minister.png"
            alt="Logo Ministère de l'économie"
            fluid
            style={{ maxHeight: "100px" }}
          />
          <h5 className="fw-bold mb-1">Ministère</h5>
          <p className="text-muted mt-2 fs-6">
            Ministère de l'Économie et la Connaissance,
            <br />
            des Startups et des Micro-Entreprises
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Partners;
