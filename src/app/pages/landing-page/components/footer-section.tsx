import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="site-footer"
      style={{
        margin: "0 calc(-50vw + 50%)",
        width: "100vw",
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
              <h5 className="footer-title fw-bold mb-3">Web Summit Qatar</h5>
              <p className="footer-text">
                Connecting a new generation of founders in the Middle East to
                investors, journalists and innovators from around the world.
              </p>
              <div className="footer-logo mt-3">
                <img
                  src="/sponsors/a-venture.webp"
                  alt="Algeria venture Logo"
                  style={{ height: "80px", width: "auto", opacity: 0.8 }}
                />
              </div>
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={6} sm={12}>
            <div className="footer-section">
              <h5 className="footer-title fw-bold mb-3">Quick Links</h5>
              <ul className="footer-links">
                <li>
                  <a href="#home">Home</a>
                </li>
                <li>
                  <a href="#about">About</a>
                </li>
                <li>
                  <a href="#speakers">Speakers</a>
                </li>
                <li>
                  <a href="#schedule">Schedule</a>
                </li>
                <li>
                  <a href="#sponsors">Sponsors</a>
                </li>
                <li>
                  <a href="#gallery">Gallery</a>
                </li>
              </ul>
            </div>
          </Col>

          {/* Event Info */}
          <Col lg={2} md={6} sm={12}>
            <div className="footer-section">
              <h5 className="footer-title fw-bold mb-3">Event Info</h5>
              <ul className="footer-links">
                <li>
                  <a href="#registration">Registration</a>
                </li>
                <li>
                  <a href="#venue">Venue</a>
                </li>
                <li>
                  <a href="#accommodation">Hotels</a>
                </li>
                <li>
                  <a href="#travel">Travel</a>
                </li>
                <li>
                  <a href="#faq">FAQ</a>
                </li>
                <li>
                  <a href="#contact">Contact</a>
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
                  <span>Doha, Qatar</span>
                </div>
                <div className="contact-item mb-2">
                  <i className="bi bi-calendar-event me-2"></i>
                  <span>February 1-4, 2026</span>
                </div>
                <div className="contact-item mb-2">
                  <i className="bi bi-envelope me-2"></i>
                  <a href="mailto:info@websummitqatar.com">
                    info@websummitqatar.com
                  </a>
                </div>
                <div className="contact-item">
                  <i className="bi bi-telephone me-2"></i>
                  <a href="tel:+97444123456">+974 4412 3456</a>
                </div>
              </div>
            </div>
          </Col>

          {/* Social & Newsletter */}
          <Col lg={2} md={6} sm={12}>
            <div className="footer-section">
              <h5 className="footer-title fw-bold mb-3">Follow Us</h5>
              <div className="social-links mb-4">
                <a href="#" aria-label="Facebook" className="social-link">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" aria-label="Twitter" className="social-link">
                  <i className="bi bi-twitter"></i>
                </a>
                <a href="#" aria-label="LinkedIn" className="social-link">
                  <i className="bi bi-linkedin"></i>
                </a>
                <a href="#" aria-label="Instagram" className="social-link">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#" aria-label="YouTube" className="social-link">
                  <i className="bi bi-youtube"></i>
                </a>
              </div>

              <div className="newsletter-signup">
                <p className="small mb-2">Stay updated with latest news</p>
                <div className="input-group input-group-sm">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Your email"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      color: "white",
                    }}
                  />
                  <button
                    className="btn btn-primary"
                    type="button"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Footer Bottom */}
        <Row className="footer-bottom mt-5 pt-4">
          <Col md={6}>
            <div className="copyright">
              <p className="mb-0 small">
                &copy; {currentYear} Web Summit Qatar. All rights reserved.
              </p>
            </div>
          </Col>
          <Col md={6}>
            <div className="footer-legal text-md-end">
              <a href="#privacy" className="legal-link me-3">
                Privacy Policy
              </a>
              <a href="#terms" className="legal-link me-3">
                Terms of Service
              </a>
              <a href="#cookies" className="legal-link">
                Cookie Policy
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
