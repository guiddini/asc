import React from "react";
import { Container, Card } from "react-bootstrap";

const StatisticsPage = () => {
  return (
    <Container
      className="py-10 w-100 h-100"
      style={{
        minHeight: "65vh",
      }}
    >
      <Card className="bg-card text-center shadow-sm w-100 h-100">
        <Card.Body className="py-10 d-flex flex-column align-items-center justify-content-center">
          <img
            src="/statistics.png"
            alt="Statistics illustration"
            className="img-fluid mb-5"
            style={{ maxWidth: "400px" }}
          />
          <h1 className="fw-bold mb-3">Statistics</h1>
          <p className="text-muted fs-5 mb-0">
            Coming soon — insightful dashboards and KPIs are on the way.
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StatisticsPage;
