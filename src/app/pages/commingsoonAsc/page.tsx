import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

const ComingSoonAsc: React.FC = () => {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0090C7, #57C1DC)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontFamily: "Montserrat, sans-serif",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <img
 src="/media/eventili/logos/logo.svg"
               alt="African Startup Conference"
              style={{ maxWidth: "250px", marginBottom: "30px" }}
            />
            <h1 style={{ fontWeight: 700, fontSize: "3rem" }}>
              🚀 African Startup Conference
            </h1>
            <h2 style={{ fontWeight: 500, marginTop: "10px" }}>
              Notre site arrive bientôt !
            </h2>
            <p style={{ marginTop: "20px", fontSize: "1.2rem" }}>
              Restez connectés, une nouvelle aventure démarre très bientôt.
            </p>
            <Button
              variant="light"
              style={{
                color: "#0090C7",
                fontWeight: 600,
                marginTop: "20px",
                borderRadius: "30px",
                padding: "10px 25px",
              }}
            >
              Me notifier au lancement
            </Button>
            <p
              style={{
                marginTop: "40px",
                fontSize: "0.9rem",
                opacity: 0.8,
              }}
            >
              © {new Date().getFullYear()} African Startup Conference
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ComingSoonAsc;
