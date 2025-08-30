import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { SIDE_EVENTS } from "../data/side-events";

const SideEventsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const cardsPerView = 3;
  const maxIndex = Math.max(0, SIDE_EVENTS.length - cardsPerView);

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
    return SIDE_EVENTS.slice(currentIndex, currentIndex + cardsPerView);
  };

  return (
    <section
      className="side-events-section"
      style={{
        width: "100%",
        margin: "0 calc(-50vw + 50%)",

        padding: "5rem 0",
        backgroundColor: "var(--bs-secondary)",
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
            <p className="lead text-light">
              Discover exciting parallel events and activities
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
            disabled={SIDE_EVENTS.length <= cardsPerView || isTransitioning}
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
                  key={`${currentIndex}-${index}`}
                  className={`side-event-card ${
                    isTransitioning ? "card-transitioning" : ""
                  }`}
                  style={
                    {
                      animationDelay: `${index * 0.1}s`,
                      "--card-index": index,
                    } as React.CSSProperties
                  }
                >
                  <div className="card-inner">
                    {/* Front Face - Just Image */}
                    <div className="card-front">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="card-image"
                      />
                    </div>

                    {/* Back Face - Dark Overlay with Title and Description */}
                    <div className="card-back">
                      <div className="dark-overlay">
                        <div className="event-content">
                          <h3 className="event-title">{event.title}</h3>
                          {event.description && (
                            <p className="event-description text-muted">
                              {event.description}
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
            disabled={SIDE_EVENTS.length <= cardsPerView || isTransitioning}
          >
            <i className="bi bi-chevron-right"></i>
          </Button>
        </div>

        {/* Progress Indicators */}
        <div className="carousel-indicators mt-4">
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentIndex ? "active" : ""}`}
              onClick={() => {
                if (isTransitioning) return;
                setCurrentIndex(index);
                setIsAutoPlaying(false);
              }}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default SideEventsSection;
