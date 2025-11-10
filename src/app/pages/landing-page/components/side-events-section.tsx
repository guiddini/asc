import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { getPublicSideEvents } from "../../../apis";
import getMediaUrl from "../../../helpers/getMediaUrl";
import type { SideEvent } from "../../../types/side-event";

const SideEventsSection: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryFn: getPublicSideEvents,
    queryKey: ["publicSideEvents"],
  });

  const navigate = useNavigate();

  // Normalize events from API
  const events: SideEvent[] = (data as SideEvent[]) || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const cardsPerView = 3;
  const maxIndex = Math.max(0, (events?.length || 0) - cardsPerView);

  // Auto-play functionality like Instagram stories
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex >= maxIndex) {
          return 0; // Loop back to start
        }
        return prevIndex + 1;
      });
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, maxIndex]);

  // Add transition effect when currentIndex changes
  useEffect(() => {
    setIsTransitioning(true);
    const timeout = setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [currentIndex]);

  // Pause auto-play on hover
  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  // Manual navigation with animation
  const handlePrev = () => {
    if (isTransitioning) return;
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? maxIndex : prevIndex - 1
    );
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
  };

  // Get visible cards based on current index
  const getVisibleCards = () => {
    return events.slice(currentIndex, currentIndex + cardsPerView);
  };

  const truncate = (text?: string, max: number = 140) => {
    if (!text) return "";
    const normalized = text.trim();
    if (normalized.length <= max) return normalized;
    return normalized.slice(0, max).trimEnd() + "…";
  };

  return (
    <section
      className="side-events-section"
      style={{
        width: "100vw",
        margin: "0 calc(-50vw + 50%)",
        padding: "5rem 0",
        backgroundImage: "url('/media/asc/back4.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 15px",
        }}
      >
        {/* Section Header */}
        <Row className="mb-5">
          <Col className="text-center">
            <h2 className="display-5 fw-bold text-white mb-3">Side Events</h2>
            {/* <h2 className="display-5 fw-bold text-white mb-3">Événements parallèles</h2> */}

            <p className="lead text-light">
              Discover Side Events & Exciting Activities
              {/* Discover exciting parallel events and activities */}
              {/* Découvrez des événements parallèles et des activités passionnantes */}
            </p>
          </Col>
        </Row>

        {/* Carousel Container */}
        <div
          className="side-events-carousel"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Navigation Arrows */}
          <Button
            variant="outline-light"
            className="carousel-nav carousel-nav-prev"
            onClick={handlePrev}
            disabled={events?.length <= cardsPerView || isTransitioning}
          >
            <i className="bi bi-chevron-left"></i>
          </Button>

          {/* Cards Container */}
          <div className="cards-container">
            <div
              className={`cards-wrapper ${
                isTransitioning ? "transitioning" : ""
              }`}
            >
              {getVisibleCards().map((event, index) => (
                <div
                  key={`${event.id || event.slug || index}-${currentIndex}`}
                  className={`side-event-card ${
                    isTransitioning ? "card-transitioning" : ""
                  }`}
                  style={
                    {
                      animationDelay: `${index * 0.1}s`,
                      "--card-index": index,
                    } as React.CSSProperties
                  }
                  onClick={() => navigate(`/side-events/${event.slug}`)}
                >
                  <div className="card-inner">
                    {/* Front Face - Just Image */}
                    <div className="card-front">
                      {(() => {
                        const imgSrc = getMediaUrl(
                          (event.cover as string) ||
                            (event.logo as string) ||
                            (event.gallery && event.gallery[0]) ||
                            ""
                        );
                        const fallback = "/side-events/commingsoon.jpg";
                        return (
                          <img
                            src={getMediaUrl(event?.logo) || fallback}
                            alt={event.name}
                            className="card-image"
                            style={{ width: "100%", height: "100%" }}
                          />
                        );
                      })()}
                    </div>

                    {/* Back Face - Dark Overlay with Title and Description */}
                    <div className="card-back">
                      <div className="dark-overlay">
                        <div className="event-content">
                          <h3 className="event-title">{event.name}</h3>
                          {event.description && (
                            <p className="event-description text-muted">
                              {truncate(event.description, 140)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline-light"
            className="carousel-nav carousel-nav-next"
            onClick={handleNext}
            disabled={(events?.length || 0) <= cardsPerView || isTransitioning}
          >
            <i className="bi bi-chevron-right"></i>
          </Button>
        </div>

        {/* Progress Indicators */}
        <div className="position-relative pt-14">
          <div className="carousel-indicators">
            {Array.from({ length: maxIndex + 1 }, (_, index) => (
              <button
                key={index}
                className={`indicator ${
                  index === currentIndex ? "active" : ""
                }`}
                onClick={() => {
                  if (isTransitioning) return;
                  setCurrentIndex(index);
                  setIsAutoPlaying(false);
                }}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default SideEventsSection;
