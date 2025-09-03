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
  Card,
} from "react-bootstrap";
import { useQuery } from "react-query";
import { showOneSpeaker } from "../../apis/speaker";
import getMediaUrl from "../../helpers/getMediaUrl";

const SpeakerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: speaker,
    isLoading,
    isError,
  } = useQuery(["speaker", id], () => showOneSpeaker(id || ""), {
    enabled: !!id,
  });

  return (
    <Container
      as="section"
      className="py-5"
      style={{ marginTop: "80px", maxWidth: "900px" }}
      fluid
    >
      {isLoading ? (
        <p className="text-center py-5">Loading speaker details...</p>
      ) : isError ? (
        <p className="text-danger text-center py-5">Error loading speaker.</p>
      ) : speaker ? (
        <Card className="shadow-sm border-0">
          <Row className="g-0 align-items-center">
            <Col md={4} className="text-center p-4">
              <Image
                src={getMediaUrl(speaker.avatar)}
                alt={speaker.fname + " " + speaker.lname}
                roundedCircle
                fluid
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  border: "4px solid #fff",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                }}
              />
            </Col>
            <Col md={8}>
              <Card.Body>
                <h2 className="fw-bold mb-2 text-primary">
                  {speaker.fname} {speaker.lname}
                </h2>
                <Card.Text className="text-muted mb-3">
                  No additional information available.
                </Card.Text>
              </Card.Body>
            </Col>
          </Row>
          {speaker.conferences && speaker.conferences.length > 0 && (
            <Card.Body className="pt-4 pb-3">
              <h5 className="mb-4 border-bottom pb-2">🗓️ Conferences:</h5>
              <div className="d-flex flex-column gap-4">
                {speaker.conferences.map((c) => (
                  <Card key={c.id} className="shadow-sm border rounded-3">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
                        <Card.Title className="mb-1 fs-5 fw-bold text-primary flex-grow-1">
                          {c.title}
                        </Card.Title>
                        <Badge
                          color="primary"
                          className="ms-3 small mt-0 mt-sm-1 align-self-start"
                        >
                          {new Date(c.date).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </Badge>
                      </div>
                      <Card.Text
                        className="text-secondary mb-0"
                        style={{ whiteSpace: "pre-line" }}
                      >
                        {c.description}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Card.Body>
          )}

          <Card.Footer className="bg-transparent border-0 text-center">
            <Button variant="primary" onClick={() => navigate("/")}>
              ← Back Home
            </Button>
          </Card.Footer>
        </Card>
      ) : (
        <p className="text-center py-5">Speaker not found.</p>
      )}
    </Container>
  );
};

export default SpeakerDetail;
