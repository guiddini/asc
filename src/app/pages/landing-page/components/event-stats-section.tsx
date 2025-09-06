import React from "react";
import { Container, Row, Col } from "react-bootstrap";

type StatItem = {
  icon: string;
  label: string;
  value: string;
  alt: string;
};

const EVENT_STATS: StatItem[] = [
  {
    icon: "/stats/startup.svg",
    label: "Délégations ministérielles",
    value: "40+",
    alt: "Icône Startups",
  },
  {
    icon: "/stats/visitors.svg",
    label: "Participants",
    value: "20 000+",
    alt: "Icône Visiteurs",
  },
  // {
  //   icon: "/stats/ministers.svg",
  //   label: "Ministres",
  //   value: "45+",
  //   alt: "Icône Ministres",
  // },
  // {
  //   icon: "/stats/conferences.svg",
  //   label: "Conférences",
  //   value: "30+",
  //   alt: "Icône Conférences",
  // },
  {
    icon: "/stats/experts.svg",
    label: "Experts Internationaux",
    value: "200+",
    alt: "Icône Experts",
  },
  {
    icon: "/stats/investors.svg",
    label: "Investisseurs",
    value: "150+",
    alt: "Icône Investisseurs",
  },
  // {
  //   icon: "/stats/countries.svg",
  //   label: "Pays",
  //   value: "50+",
  //   alt: "Icône Pays",
  // },
  // {
  //   icon: "/stats/sides-events.svg",
  //   label: "Événements parallèles",
  //   value: "6+",
  //   alt: "Icône Événements parallèles",
  // },
];

const EventStatsSection: React.FC = () => (
  <section className="event-stats-section py-5">
    <Container
      style={{
        paddingTop: "5rem",
        paddingBottom: "5rem",
      }}
    >
      <Row className="mb-5 text-center">
        <Col>
          <h2 className="fw-bold display-4">L’événement en chiffres</h2>
          <p className="lead text-secondary">
            Découvrez l’ampleur et l’impact de notre rassemblement international
          </p>
        </Col>
      </Row>
      <Row className="g-4 gy-4 justify-content-center">
        {EVENT_STATS.map((stat) => (
          <Col
            key={stat.label}
            xs={6}
            md={3}
            className="d-flex flex-column align-items-center stat-col"
          >
            <div className="stat-icon mb-2">
              <img src={stat.icon} alt={stat.alt} width={48} height={48} />
            </div>
            <div className="stat-label small text-uppercase fw-semibold text-secondary mb-1">
              {stat.label}
            </div>
            <div
              className="stat-value fw-bold display-5"
              style={{ color: "var(--bs-dark)" }}
            >
              {stat.value}
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  </section>
);

export default EventStatsSection;
