import React from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";

const ErrorMessage: React.FC = () => {
  return (
    <Container className="py-5">
      <Row>
        <Col lg={8} className="mx-auto">
          <Alert variant="danger" className="text-center">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <strong>Error:</strong> Unable to load blog post. Please try again
            later.
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default ErrorMessage;
