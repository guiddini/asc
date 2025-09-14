import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const PublicProgramPage: React.FC = () => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <Container fluid className="p-4">
      {/* ✅ Title */}
      <Row className="mb-4 text-center">
        <Col>
          <h2 style={{ fontWeight: "bold", color: "#0090C7" }}>
            Explore the Event Program
          </h2>
          <p style={{ fontSize: "1.1rem", color: "#555" }}>
            Browse the program online or{" "}
            <a
              href="/media/asc_note_conceptuelle FINAL EN-7-8 program.pdf.pdf"
              download
              style={{ color: "#0090C7", fontWeight: 600 }}
            >
              download the full version
            </a>
          </p>
          {/* Optional: Add a button instead of a simple link */}
          <Button
            as="a"
            variant="primary"
            href="/media/asc_note_conceptuelle FINAL EN-7-8 program.pdf.pdf"
            download
            style={{
              background: "linear-gradient(90deg, #0090C7, #57C1DC)",
              border: "none",
              fontWeight: 600,
              borderRadius: "8px",
              padding: "10px 20px",
            }}
          >
            Download Program
          </Button>
        </Col>
      </Row>

      {/* ✅ PDF Viewer */}
      <Row className="justify-content-center">
        <Col xs={12} lg={12}>
          <Card>
            <Card.Body style={{ height: "90vh" }}>
              <Worker workerUrl="/pdfjs/pdf.worker.min.js">
                <Viewer
                  fileUrl="/media/asc_note_conceptuelle FINAL EN-7-8 program.pdf.pdf"
                  plugins={[defaultLayoutPluginInstance]}
                />
              </Worker>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PublicProgramPage;
