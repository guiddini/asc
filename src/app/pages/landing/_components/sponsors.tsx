import { Container, Row, Col } from "react-bootstrap";
import { SPONSORS } from "../../../helpers/data";

const Sponsors = () => {
  return (
    <Container as="section" className="py-5 my-20" id="sponsors-section">
      <Row className="text-center mb-5">
        <Col lg={10} className="mx-auto">
          <span id="events-label">Partenaires & Sponsors</span>
          <h2 id="events-title">
            Un <span id="events-section-highlight">soutien essentiel</span>
            <br /> à la réussite de l’événement
          </h2>
          <p id="events-description">
            L’événement est rendu possible grâce au soutien de partenaires
            institutionnels, corporates et acteurs de l’écosystème africain.
          </p>
        </Col>
      </Row>

      <Row className="g-4 justify-content-center align-items-center">
        {SPONSORS.map((logo, i) => (
          <Col xs={6} sm={4} md={3} lg={2} key={i} className="text-center">
            <img
              src={logo}
              alt={`sponsor-${i}`}
              className="img-fluid grayscale hover:grayscale-0 transition-all mx-auto"
              style={{ maxHeight: "120px", objectFit: "contain" }}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Sponsors;
