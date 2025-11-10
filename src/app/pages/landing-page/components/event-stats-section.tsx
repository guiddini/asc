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

export const Counter: React.FC<CounterProps> = ({
  value,
  duration = 2000,
  start = false,
}) => {
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

// 200+ INVESTORS
// 25 000+ PARTICIPANTS
// 200+ EXHIBITOS
// ---- Données ----
export const EVENT_STATS: StatItem[] = [
  {
    icon: "/stats/minister-delegations.png",
    label: "Ministerial Delegations",
    value: "40+",
    alt: "Icône Startups",
  },
  {
    icon: "/stats/participants.png",
    label: "Participants",
    value: "25 000+",
    alt: "Icône Visiteurs",
  },
  {
    icon: "/stats/experts.png",
    label: "International Experts",
    value: "300+",
    alt: "Icône Experts",
  },
  {
    icon: "/stats/investors.png",
    label: "Investors",
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
    <section id="event-stats-section" ref={sectionRef}>
      <Container id="event-stats-container">
        <Row className="mb-4">
          <Col>
            <h2 id="event-stats-heading">Event Highlights in Numbers</h2>
            <p id="event-stats-subheading">
              Explore the scale, impact, and global reach of our continental
              conference.
            </p>
          </Col>
        </Row>
        <Row id="event-stats-grid" className="g-4 gy-4">
          {EVENT_STATS.map((stat) => (
            <Col key={stat.label} xs={6} md={3}>
              <div className="event-stat-card text-center">
                <div className="event-stat-icon mb-2">
                  <img src={stat.icon} alt={stat.alt} width={70} height={70} />
                </div>
                <div className="event-stat-label fw-semibold mb-1">
                  {stat.label}
                </div>
                <div className="event-stat-value">
                  <Counter
                    value={stat.value}
                    duration={2500}
                    start={startCounter}
                  />
                </div>
              </div>
            </Col>
          ))}
        </Row>
        {/* Exhibitors counter text */}
        <Row className="mt-4">
          <Col>
            <div className="event-stats-exhibitors text-center text-white">
              And more than{" "}
              <Counter value="+200" duration={10000} start={startCounter} />{" "}
              Exhibitors
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default EventStatsSection;
