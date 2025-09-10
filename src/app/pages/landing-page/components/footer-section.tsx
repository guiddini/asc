import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

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
              <div className="footer-logo mt-3">
                <img
                  src="/sponsors/a-venture.webp"
                  alt="Algeria Venture Logo"
                  style={{ height: "80px", width: "auto", opacity: 0.8 }}
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
                  <a href="/">Home</a>
                </li>
                <li>
                  <a href="/about/event">About</a>
                </li>
                <li>
                  <a href="/about/speakers">Speakers</a>
                </li>
                <li>
                  <a href="/about/program">Program</a>
                </li>
                <li>
                  <a href="/blog">Blog</a>
                </li>
                <li>
                  <a href="/contact">Contact</a>
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
                  <a href="/partners/packages">Become a Sponsor</a>
                </li>
                <li>
                  <a href="/partners/spaces">Exhibition Spaces</a>
                </li>
                <li>
                  <a href="/partners/startup-factory">Startup Factory</a>
                </li>
                <li>
                  <a href="/about/startups">Exhibiting Startups</a>
                </li>
                <li>
                  <a href="/press">Press</a>
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
                  <span>CIC,Algeria</span>
                </div>
                <div className="contact-item mb-2">
                  <i className="bi bi-calendar-event me-2"></i>
                  <span>06-07-08 December</span>
                </div>
                <div className="contact-item mb-2">
                  <i className="bi bi-envelope me-2"></i>
                  <a href="mailto:contact@africanstartupconference.org">
                    contact@africanstartupconference.org
                  </a>
                </div>
                <div className="contact-item">
                  <i className="bi bi-telephone me-2"></i>
                  <a href="tel:+213770737483">+213 (0) 770 22 21 49</a>
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
              <div
                className="newsletter-signup"
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "center",
                }}
              >
                <a
                  href="https://asc-android.eventili.com/"
                  className="btn btn-link p-0"
                  target="_blank"
                >
                  <img
                    src="/media/eventili/afes/play-store.svg"
                    alt="Play Store"
                    style={{ width: "120px" }}
                  />
                </a>
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
