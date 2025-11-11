import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { getPublicProgramSchedule } from "../../apis/slot";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Col, Row, Spinner } from "react-bootstrap";
import { format, parseISO } from "date-fns";
import type { PublicSlot, PublicSlotType } from "../../types/slot";
import { getThreeDayRange } from "../meetings/utils/scheduleUtils";
import "./ProgramPage.css";
import {
  Counter,
  EVENT_STATS,
} from "../landing-page/components/event-stats-section";
import getMediaUrl from "../../helpers/getMediaUrl";
// Removed join/leave imports; only display program data

// Custom Event Card Component for Timeline
const TimelineEventCard: React.FC<{ event: PublicSlot }> = ({ event }) => {
  const formatTime = (timeString: string) => {
    return format(parseISO(timeString), "h:mm a");
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "conference":
        return "conference";
      case "workshop":
        return "workshop";
      default:
        return "general";
    }
  };

  const getEventLabel = (type: string) => {
    switch (type) {
      case "conference":
        return "Conference";
      case "workshop":
        return "Workshop";
      default:
        return "General Event";
    }
  };

  const navigate = useNavigate();

  return (
    <div
      id={`event-card-${event.id}`}
      className="timeline-event-item"
      onClick={() => {
        if (event?.side_event_slug) {
          navigate(`/side-events/${event.side_event_slug}`);
        }
      }}
    >
      <div className="timeline-event-time">
        <div className="timeline-event-time-content">
          <span className="timeline-start-time">
            {formatTime(event.start_time)}
          </span>
          <span className="timeline-separator">-</span>
          <span className="timeline-end-time">
            {formatTime(event.end_time)}
          </span>
        </div>
      </div>

      <div className="timeline-event-marker">
        <div
          className={`timeline-dot timeline-dot-${getEventColor(event.type)}`}
        ></div>
        <div className="timeline-line"></div>
      </div>

      <div className="timeline-event-content">
        <div
          className={`timeline-event-card timeline-event-card-${getEventColor(
            event.type
          )}`}
        >
          <div className="timeline-event-header">
            <span
              className={`timeline-event-badge timeline-event-badge-${getEventColor(
                event.type
              )}`}
            >
              {getEventLabel(event.type)}
            </span>
            {event.side_event_slug ? (
              <span
                className="timeline-event-badge timeline-event-badge-sideevent-chip"
                title="View Side Event"
                aria-label="View Side Event"
              >
                Side Event
              </span>
            ) : (
              <span
                className="timeline-event-badge timeline-event-badge-asc-chip"
                aria-label="ASC"
              >
                ASC
              </span>
            )}
          </div>

          <h3 className="timeline-event-title">
            {event.title || "Untitled Event"}
          </h3>

          {event.location && (
            <div className="timeline-event-location">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>{event.location}</span>
            </div>
          )}

          {event.speakers && event.speakers.length > 0 && (
            <div className="d-flex align-items-center mt-3">
              {event.speakers.slice(0, 8).map((speaker, index) => (
                <img
                  key={speaker.id}
                  src={getMediaUrl(speaker?.avatar)}
                  alt={speaker.name}
                  title={speaker.name}
                  className="rounded-circle border border-white"
                  style={{
                    width: 40,
                    height: 40,
                    objectFit: "cover",
                    marginLeft: index === 0 ? 0 : -10,
                    zIndex: 10 - index,
                  }}
                />
              ))}
              {event.speakers.length > 8 && (
                <div
                  className="d-flex justify-content-center align-items-center rounded-circle bg-secondary text-white border border-white"
                  style={{
                    width: 40,
                    height: 40,
                    marginLeft: -10,
                    fontSize: 14,
                    zIndex: 1,
                  }}
                >
                  +{event.speakers.length - 8}
                </div>
              )}
            </div>
          )}

          {/* Actions removed: no join/leave buttons */}
        </div>
      </div>
    </div>
  );
};

const ProgramPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const threeDays = getThreeDayRange();

  const [activeDay, setActiveDay] = useState<string>(threeDays[0].date);

  // Get activeType from URL query params
  const activeType = (searchParams.get("type") as PublicSlotType) || undefined;

  const { data: events, isLoading } = useQuery({
    queryKey: ["program", activeType, activeDay],
    queryFn: () => getPublicProgramSchedule(activeType, activeDay),
  });

  const eventTypes: { label: string; value: PublicSlotType | undefined }[] = [
    { label: "All Events", value: undefined },
    { label: "Conferences", value: "conference" },
    { label: "Workshops", value: "workshop" },
  ];

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
    <div id="program-page-wrapper">
      {/* Hero Section */}
      <div id="program-hero-section" ref={sectionRef}>
        <div id="program-hero-container">
          <div id="program-hero-content">
            <div id="program-hero-badge">4th Edition • 2025</div>
            <h1 id="program-hero-title">Raising African Champions</h1>
            <p id="program-hero-description">
              Join us for three transformative days dedicated to innovation,
              entrepreneurship, and future technologies. Experience high-level
              dialogue, strategic initiatives, and connect with Africa's leading
              startup ecosystem.
            </p>
            {/* <div id="program-hero-stats">
              <div className="program-hero-stat">
                <div className="program-hero-stat-number">3</div>
                <div className="program-hero-stat-label">
                  Days of Innovation
                </div>
              </div>
              <div className="program-hero-stat">
                <div className="program-hero-stat-number">300+</div>
                <div className="program-hero-stat-label">
                  International Expert
                </div>
              </div>
              <div className="program-hero-stat">
                <div className="program-hero-stat-number">1000+</div>
                <div className="program-hero-stat-label">Participants</div>
              </div>
            </div> */}

            <Row className="g-4 gy-4 justify-content-center">
              {EVENT_STATS.map((stat) => (
                <Col
                  key={stat.label}
                  xs={6}
                  md={3}
                  className="d-flex flex-column align-items-center stat-col"
                >
                  <div className="stat-icon mb-2">
                    <img
                      src={stat.icon}
                      alt={stat.alt}
                      width={48}
                      height={48}
                    />
                  </div>
                  <div className="stat-label small text-uppercase fw-semibold text-white mb-1">
                    {stat.label}
                  </div>
                  <div
                    className="stat-value fw-bold display-5 text-white"
                    style={{ color: "var(--bs-dark)" }}
                  >
                    <Counter
                      value={stat.value}
                      duration={2500}
                      start={startCounter}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </div>

      <div id="program-page-container">
        <div id="program-page-header">
          <h2 id="program-page-title">Conference Schedule</h2>
          <p id="program-page-subtitle">
            Explore our comprehensive program featuring conferences, workshops,
            and networking opportunities
          </p>
        </div>

        {/* Day Tabs */}
        <div id="program-day-tabs">
          {threeDays.map((day, index) => (
            <button
              key={day.date}
              id={`program-day-tab-${index}`}
              className={`program-day-tab ${
                activeDay === day.date ? "program-day-tab-active" : ""
              }`}
              onClick={() => setActiveDay(day.date)}
            >
              <span className="program-day-tab-label">Day {index + 1}</span>
              <span className="program-day-tab-date">
                {format(day.fullDate, "MMM d")}
              </span>
            </button>
          ))}
        </div>

        <div id="program-content-wrapper">
          <h2 id="program-selected-day">
            {threeDays.find((day) => day.date === activeDay)?.display ||
              "Program Schedule"}
          </h2>

          {/* Event Type Filter */}
          <div id="program-filter-tabs">
            {eventTypes.map((type) => (
              <button
                key={type.value || "all"}
                id={`program-filter-${type.value || "all"}`}
                className={`program-filter-btn ${
                  activeType === type.value ? "program-filter-btn-active" : ""
                }`}
                onClick={() => {
                  if (type.value) {
                    setSearchParams({ type: type.value });
                  } else {
                    setSearchParams({});
                  }
                }}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Timeline Events */}
          {isLoading ? (
            <div id="program-loading">
              <Spinner animation="border" style={{ color: "#00c4c4" }} />
              <p>Loading events...</p>
            </div>
          ) : events && events.length > 0 ? (
            <div id="program-timeline">
              {events.map((event: PublicSlot) => (
                <TimelineEventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div id="program-empty-state">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <h3>No events scheduled</h3>
              <p>There are no events scheduled for this day and category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramPage;
