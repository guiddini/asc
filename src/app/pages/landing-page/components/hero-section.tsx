import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserTypeComponent from "../layout/type-user-component";

const HeroSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTypeComponent, setShowTypeComponent] = useState(false);
  const handleType = () => setShowTypeComponent(true);
  const handleCloseType = () => setShowTypeComponent(false);

  // Static content for hero section (text and images)
  const HERO_BACKGROUND = "/media/asc/hero-back.png";
  const HERO_LONG_LOGO = "/media/asc/logo-section.png";

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 300);
  }, []);

  // Countdown to December 6, 2025
  const targetDate = new Date("2025-12-06T00:00:00");
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    // Initial call and interval setup
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero-section"
      className="position-relative d-flex align-items-center justify-content-center text-center"
    >
      {/* Background Image */}
      <img
        id="hero-background"
        className="position-absolute top-0 start-0 w-100 h-100"
        src={HERO_BACKGROUND}
        alt="Hero Background"
      />

      {/* Content */}
      <div
        id="hero-content"
        className={`container position-relative ${isVisible ? "show" : ""}`}
      >
        <img
          id="hero-logo"
          src={HERO_LONG_LOGO}
          alt="African Startup Conference"
          className="mb-4"
        />
        <p id="hero-subtext" className="mx-auto">
          Join the largest gathering of Africa’s champions of innovation and
          entrepreneurship.
        </p>
        <h5 id="hero-date" className="mt-4 fw-semibold">
          From <span id="hero-date-start">06</span> to{" "}
          <span id="hero-date-end">08 December 2025</span>
        </h5>
        <h6 id="hero-location" className="mt-2">
          International Conference Center - CIC - Abdelatif Rahal <br />
          Algiers, Algeria
        </h6>
        {/* Countdown to December 6, 2025 */}
        <div id="hero-countdown" className="mt-4">
          <div className="time-box">
            <div className="time-number">
              {String(timeLeft.days).padStart(2, "0")}
            </div>
            <div className="time-label">Days</div>
          </div>
          <div className="time-box">
            <div className="time-number">
              {String(timeLeft.hours).padStart(2, "0")}
            </div>
            <div className="time-label">Hours</div>
          </div>
          <div className="time-box">
            <div className="time-number">
              {String(timeLeft.minutes).padStart(2, "0")}
            </div>
            <div className="time-label">Minutes</div>
          </div>
          <div className="time-box">
            <div className="time-number">
              {String(timeLeft.seconds).padStart(2, "0")}
            </div>
            <div className="time-label">Seconds</div>
          </div>
        </div>
        <div id="hero-cta-container">
          {" "}
          <div className="mt-4 pt-2">
            <Link to="#" id="hero-cta" className="btn" onClick={handleType}>
              <i
                className="uil uil-envelope"
                style={{ fontSize: "1.3rem" }}
              ></i>
              Join-us{" "}
            </Link>
          </div>
        </div>
      </div>
      <UserTypeComponent show={showTypeComponent} onHide={handleCloseType} />
    </section>
  );
};

export default HeroSection;
