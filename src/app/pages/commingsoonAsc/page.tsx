import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";

export default function ComingSoonAsc() {
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
            {/* Logo */}
            <img
              src="/logo-asc.png" // mets ton logo ici
              alt="African Startup Conference"
              style={{ maxWidth: "250px", marginBottom: "30px" }}
            />

            {/* Titre */}
            <h1 style={{ fontWeight: 700, fontSize: "3rem" }}>
              🚀 African Startup Conference
            </h1>
            <h2 style={{ fontWeight: 500, marginTop: "10px" }}>
              Notre site arrive bientôt !
            </h2>

            {/* Texte */}
            <p style={{ marginTop: "20px", fontSize: "1.2rem" }}>
              Restez connectés, une nouvelle aventure démarre très bientôt.
            </p>

            {/* Bouton */}
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

            {/* Footer */}
            <p style={{ marginTop: "40px", fontSize: "0.9rem", opacity: 0.8 }}>
              © {new Date().getFullYear()} African Startup Conference
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

