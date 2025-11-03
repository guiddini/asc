import React from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";

const LoadingSpinner: React.FC = () => {
  return (
    <Container className="py-5">
      <Row>
        <Col className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <p className="text-muted">Loading blog post...</p>
        </Col>
      </Row>
    </Container>
  );
};

export default LoadingSpinner;
