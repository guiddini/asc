import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { SPEAKERS } from "../../../helpers/data";
import { Link, useNavigate } from "react-router-dom";

const Speakers = () => {
  const navigate = useNavigate();

  return (
    <Container as="section" className="py-5 my-20" id="speakers-section">
      <Row className="text-center mb-5">
        <Col lg={10} className="mx-auto">
          <span id="events-label">NOS SPEAKERS</span>
          <h2 id="events-title">
            Découvrez les{" "}
            <span id="events-section-highlight">visionnaires</span>
            <br /> qui partagent leur expertise
          </h2>
          <p id="events-description">
            Des leaders, chercheurs, investisseurs et entrepreneurs qui
            façonnent l’avenir de l’innovation et de l’entrepreneuriat en
            Afrique.
          </p>
        </Col>
      </Row>

      <Row className="g-4">
        {SPEAKERS.map((speaker, index) => (
          <Col key={index} md={6} lg={3} className="text-center">
            <Link
              to={`/speakers/${speaker.slug}`}
              className="p-4 h-100 border rounded-4 shadow-sm cursor-pointer"
            >
              <Image
                src={speaker.avatar.replace("public/", "/")}
                alt={speaker.name}
                roundedCircle
                fluid
                style={{
                  maxWidth: "140px",
                  height: "140px",
                  objectFit: "cover",
                }}
                className="mb-3"
              />
              <h5 className="fw-bold mb-1">{speaker.name}</h5>
              <p className="mb-1 text-muted">{speaker.title}</p>
              <p className="small text-muted mb-0">{speaker.affiliation}</p>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Speakers;
