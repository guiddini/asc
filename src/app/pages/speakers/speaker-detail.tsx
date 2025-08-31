import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Badge,
  ListGroup,
} from "react-bootstrap";
import { SPEAKERS } from "../../helpers/data";

const SpeakerDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const speaker = SPEAKERS.find((s) => s.slug === slug) || {
    name: "Mr. Raouf Chebri",
    slug: "raouf-chebri",
    title: "Senior Developer Advocate",
    affiliation: "Neon Geneva, Switzerland",
    avatar: "public/speakers/2.png",
    bio: "Raouf is passionate about empowering developers through open-source projects and advocacy programs.",
    topic: "Modern Database Development",
    country: "Switzerland",
    phone: "+41 22 123 4567",
    website: "https://raouf.dev",
    email: "raouf@example.com",
    linkedin: "https://linkedin.com/in/raoufchebri",
    twitter: "https://twitter.com/raoufchebri",
    social: {
      github: "https://github.com/raoufchebri",
      facebook: "https://facebook.com/raoufchebri",
    },
    talks: [
      { title: "Scaling Modern Databases", time: "11:00 AM", room: "C1" },
      { title: "Open Source Advocacy", time: "3:00 PM", room: "D2" },
    ],
    awards: ["Developer Advocate of the Year 2023", "Open Source Hero 2022"],
    languages: ["English", "French"],
  };

  return (
    <div id="landing-page-body" className="w-100 h-100">
      <Container
        as="section"
        className="py-5"
        style={{ marginTop: "80px", maxWidth: "900px" }}
      >
        <Row className="align-items-center mb-4">
          <Col md={4} className="text-center mb-3 mb-md-0">
            <Image
              src={speaker.avatar.replace("public/", "/")}
              alt={speaker.name}
              roundedCircle
              fluid
              style={{
                width: "180px",
                height: "180px",
                objectFit: "cover",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              }}
            />
          </Col>
          <Col md={8}>
            <h2 className="fw-bold mb-1">{speaker.name}</h2>
            <p className="text-muted mb-1">{speaker.title}</p>
            <p className="mb-2">{speaker.affiliation}</p>
            <p>{speaker.bio}</p>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <h5 className="fw-bold mb-2">🎤 Sujet :</h5>
            <p>{speaker.topic}</p>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <h5 className="fw-bold mb-2">📍 Informations :</h5>
            <p className="mb-1">Pays: {speaker.country}</p>
            <p className="mb-1">Téléphone: {speaker.phone}</p>
            {speaker.website && (
              <p>
                Site web:{" "}
                <a
                  href={speaker.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {speaker.website}
                </a>
              </p>
            )}
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <h5 className="fw-bold mb-2">🔗 Réseaux sociaux :</h5>
            <div className="d-flex gap-2 flex-wrap">
              {speaker.email && (
                <a
                  href={`mailto:${speaker.email}`}
                  className="btn btn-outline-dark"
                >
                  Email
                </a>
              )}
              {speaker.linkedin && (
                <a
                  href={speaker.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary"
                >
                  LinkedIn
                </a>
              )}
              {speaker.twitter && (
                <a
                  href={speaker.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-info"
                >
                  Twitter
                </a>
              )}
              {speaker.social?.github && (
                <a
                  href={speaker.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-dark"
                >
                  GitHub
                </a>
              )}
              {speaker.social?.facebook && (
                <a
                  href={speaker.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary"
                >
                  Facebook
                </a>
              )}
            </div>
          </Col>
        </Row>

        {speaker.talks?.length > 0 && (
          <Row className="mb-4">
            <Col>
              <h5 className="fw-bold mb-2">🗓️ Talks :</h5>
              <ListGroup>
                {speaker.talks.map((talk, idx) => (
                  <ListGroup.Item key={idx}>
                    <strong>{talk.title}</strong> — {talk.time} — Salle:{" "}
                    {talk.room}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
        )}

        {speaker.awards?.length > 0 && (
          <Row className="mb-4">
            <Col>
              <h5 className="fw-bold mb-2">🏆 Awards :</h5>
              <div className="d-flex flex-wrap gap-2">
                {speaker.awards.map((award, idx) => (
                  <Badge key={idx} bg="success">
                    {award}
                  </Badge>
                ))}
              </div>
            </Col>
          </Row>
        )}

        {speaker.languages?.length > 0 && (
          <Row className="mb-4">
            <Col>
              <h5 className="fw-bold mb-2">🗣️ Langues :</h5>
              <div className="d-flex flex-wrap gap-2">
                {speaker.languages.map((lang, idx) => (
                  <Badge key={idx} bg="secondary">
                    {lang}
                  </Badge>
                ))}
              </div>
            </Col>
          </Row>
        )}

        <Row>
          <Col className="text-center">
            <Button variant="primary" onClick={() => navigate("/")}>
              ← Back Home
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SpeakerDetail;
