import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

type StatItem = {
  icon: string;
  label: string;
  value: string; // ex: "200+"
  alt: string;
};

// ---- Composant compteur ----
type CounterProps = {
  value: string; // "200+" ou "20 000+"
  duration?: number;
  start?: boolean; // animation démarre seulement si true
};

const Counter: React.FC<CounterProps> = ({ value, duration = 2000, start = false }) => {
  const numericValue = parseInt(value.replace(/[^\d]/g, ""), 10);
  const suffix = value.replace(/[0-9\s]/g, ""); // ex: "+"

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return; // n'animer que si start = true

    let startValue = 0;
    const end = numericValue;
    const incrementTime = 20;
    const step = Math.ceil(end / (duration / incrementTime));

    const timer = setInterval(() => {
      startValue += step;
      if (startValue >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(startValue);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [numericValue, duration, start]);

  return (
    <span>
      {count.toLocaleString()} {suffix}
    </span>
  );
};

// ---- Données ----
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
];

// ---- Section ----
const EventStatsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [startCounter, setStartCounter] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setStartCounter(true);
          observer.disconnect(); // On arrête après la première activation
        }
      },
      { threshold: 0.3 } // déclenche quand 30% de la section est visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section className="event-stats-section py-5" ref={sectionRef}>
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
                <Counter value={stat.value} duration={2500} start={startCounter} />
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default EventStatsSection;
