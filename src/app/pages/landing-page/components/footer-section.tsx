import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import BecomeSponsorModal from "../../../components/become-sponsor-modal";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [showModal, setShowModal] = useState(false);

  return (
    <footer
      className="site-footer"
      style={{
        margin: "0 calc(-50vw + 50%)",
        padding: "4rem 0 2rem 0",
        color: "black",
      }}
    >
      <Container
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 15px",
        }}
      >
        {/* Main Footer Content */}
        <Row className="g-4">
          {/* About Section */}
          <Col lg={3} md={6} sm={12}>
            <div className="footer-section">
              <h5 className="footer-title fw-bold mb-3">
                African Startup Conference
              </h5>
              <p className="footer-text">
                Connecting African entrepreneurs, startups, and innovators with
                investors, partners, and industry leaders to build the future of
                the African tech ecosystem.
              </p>
              <div className="footer-logo mt-3 gap-4">
                <img
                  src="/sponsors/a-venture.webp"
                  alt="Algeria Venture Logo"
                  style={{ height: "80px", width: "auto", opacity: 0.8 }}
                />
                <img
                  src="/media/startups.png"
                  alt="Algeria Venture Logo"
                  style={{ height: "80px", width: "auto", marginLeft: "10px" }}
                />
              </div>
            </div>
          </Col>

          {/* Navigation Links */}
          <Col lg={2} md={6} sm={12}>
            <div className="footer-section">
              <h5 className="footer-title fw-bold mb-3">Navigate</h5>
              <ul className="footer-links">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/about/event">About</Link>
                </li>
                <li>
                  <Link to="/about/speakers">Speakers</Link>
                </li>
                <li>
                  <Link to="/about/program">Program</Link>
                </li>

                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </div>
          </Col>

          {/* Opportunities */}
          <Col lg={2} md={6} sm={12}>
            <div className="footer-section">
              <h5 className="footer-title fw-bold mb-3">Get Involved</h5>
              <ul className="footer-links">
                <li>
                  <span role="button" onClick={() => setShowModal(true)}>
                    Become a Sponsor
                  </span>
                </li>
                <li>
                  <Link to="/partners/spaces">Exhibition Spaces</Link>
                </li>
                <li>
                  <Link to="/partners/startup-factory">Startup Factory</Link>
                </li>
                <li>
                  <Link to="/about/startups">Exhibiting Startups</Link>
                </li>
                <li>
                  <Link to="/press">Press</Link>
                </li>
              </ul>
            </div>
          </Col>

          {/* Contact Info */}
          <Col lg={3} md={6} sm={12}>
            <div className="footer-section">
              <h5 className="footer-title fw-bold mb-3">Contact Info</h5>
              <div className="contact-info">
                <div className="contact-item mb-2">
                  <i className="bi bi-geo-alt me-2"></i>
                  <span>
                    International Conference Center – CIC – Abdelatif Rahal,
                    Algiers, Algeria
                  </span>
                </div>
                <div className="contact-item mb-2">
                  <i className="bi bi-calendar-event me-2"></i>
                  <span>06–07–08 December</span>
                </div>
                <div className="contact-item mb-2">
                  <i className="bi bi-envelope me-2"></i>
                  <div className="d-flex flex-column">
                    <a href="mailto:info-africanstartupconference@startup.dz">
                      info-africanstartupconference@startup.dz
                    </a>
                    <a href="mailto:exibition-africanstartupconference@startup.dz">
                      exibition-africanstartupconference@startup.dz
                    </a>
                    <a href="mailto:sponsoring-africanstartupconference@startup.dz">
                      sponsoring-africanstartupconference@startup.dz
                    </a>
                  </div>
                </div>
                <div className="contact-item">
                  <i className="bi bi-telephone me-2"></i>
                  <a href="tel:+213770222149">+213 (0) 770 22 21 49</a>
                </div>
              </div>
            </div>
          </Col>

          {/* Social & Newsletter */}
          <Col lg={2} md={6} sm={12}>
            <div className="footer-section">
              <h5 className="footer-title fw-bold mb-3">Follow Us</h5>
              <div className="social-links mb-4">
                <Link
                  to="https://www.facebook.com/africanstartupconference"
                  aria-label="Facebook"
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-facebook"></i>
                </Link>
                <Link
                  to="https://x.com/africanstartupc"
                  aria-label="Twitter / X"
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-twitter"></i>
                </Link>
                <Link
                  to="https://www.linkedin.com/company/the-african-startup-conference"
                  aria-label="LinkedIn"
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-linkedin"></i>
                </Link>
                <Link
                  to="https://www.instagram.com/africanstartupconference"
                  aria-label="Instagram"
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-instagram"></i>
                </Link>
                <Link
                  to="https://www.youtube.com/@AfricanStartupConference"
                  aria-label="YouTube"
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-youtube"></i>
                </Link>
              </div>

              <div className="d-flex flex-column align-items-center align-md-start gap-4 gap-md-3">
                <a
                  href="https://play.google.com/store/apps/details?id=com.africanstartupconference.app&pli=1"
                  className="btn btn-link p-0"
                  target="_blank"
                >
                  <img
                    src="/media/play-store.svg"
                    alt="Play Store"
                    style={{ width: "150px" }}
                  />
                </a>

                <span className="btn btn-link p-0">
                  <img
                    src="/media/app-store.svg"
                    alt="App Store"
                    style={{ width: "150px" }}
                  />
                </span>
              </div>
            </div>
          </Col>
        </Row>

        {/* Footer Bottom */}
        <Row className="footer-bottom mt-5 pt-4">
          <Col md={6}>
            <div className="copyright">
              <p className="mb-0 small">
                &copy; {currentYear} Algeria Venture. All rights reserved.
              </p>
            </div>
          </Col>
          <Col md={6}>
            <div className="footer-legal text-md-end">
              <Link to="#privacy" className="legal-link me-3">
                Privacy Policy
              </Link>
              <Link to="#terms" className="legal-link me-3">
                Terms of Service
              </Link>
              <Link to="#cookies" className="legal-link">
                Cookie Policy
              </Link>
            </div>
          </Col>
        </Row>
      </Container>

      <BecomeSponsorModal onHide={() => setShowModal(false)} show={showModal} />
    </footer>
  );
};

export default Footer;
