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
                {/* Connecting African entrepreneurs, startups, and innovators with
                investors, partners, and industry leaders to build the future of
                the African tech ecosystem. */}
                Connecter les entrepreneurs, les startups et les innovateurs africains avec les investisseurs, les partenaires et les leaders de l'industrie pour construire l'avenir de l'écosystème technologique africain.
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
        

          {/* Opportunities */}
         

          {/* Contact Info */}
         

          {/* Social & Newsletter */}
          <Col lg={2} md={6} sm={12}>
  <div className="footer-section">
    <h5 className="footer-title fw-bold mb-3">Navigation</h5>
    <ul className="footer-links">
      <li>
        <a href="/">Accueil</a>
      </li>
      <li>
        <a href="/about/event">À propos</a>
      </li>
      <li>
        <a href="/about/speakers">Intervenants</a>
      </li>
      <li>
        <a href="/about/program">Programme</a>
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

{/* Opportunités */}
<Col lg={2} md={6} sm={12}>
  <div className="footer-section">
    <h5 className="footer-title fw-bold mb-3">S'impliquer</h5>
    <ul className="footer-links">
      <li>
        <a href="/partners/packages">Devenir Sponsor</a>
      </li>
      <li>
        <a href="/partners/spaces">Espaces d’exposition</a>
      </li>
      <li>
        <a href="/partners/startup-factory">Startup Factory</a>
      </li>
      <li>
        <a href="/about/startups">Startups exposantes</a>
      </li>
      <li>
        <a href="/press">Presse</a>
      </li>
    </ul>
  </div>
</Col>

{/* Informations de contact */}
<Col lg={3} md={6} sm={12}>
  <div className="footer-section">
    <h5 className="footer-title fw-bold mb-3">Informations de contact</h5>
    <div className="contact-info">
      <div className="contact-item mb-2">
        <i className="bi bi-geo-alt me-2"></i>
        <span>CIC,Algérie</span>
      </div>
      <div className="contact-item mb-2">
        <i className="bi bi-calendar-event me-2"></i>
        <span>06-07-08 Décembre 2025</span>
      </div>
      <div className="contact-item mb-2">
        <i className="bi bi-envelope me-2"></i>
        <a href="mailto:contact@africanstartupconference.org">
          contact@africanstartupconference.org
        </a>
      </div>
      <div className="contact-item">
        <i className="bi bi-telephone me-2"></i>
        <a href="tel:+213770737483">+213 770 22 21 49</a>
      </div>
    </div>
  </div>
</Col>

{/* Réseaux sociaux & Newsletter */}
<Col lg={2} md={6} sm={12}>
  <div className="footer-section">
    <h5 className="footer-title fw-bold mb-3">Suivez-nous</h5>
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
      <p className="small mb-2">Restez informé des dernières nouvelles</p>
      <div className="input-group input-group-sm">
        <input
          type="email"
          className="form-control"
          placeholder="Votre email"
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
          S'abonner
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
                &copy; {currentYear} Algeria Venture. Tous droits réservés.
              </p>
            </div>
          </Col>
         <Col md={6}>
  <div className="footer-legal text-md-end">
    <a href="#privacy" className="legal-link me-3">
      Politique de confidentialité
    </a>
    <a href="#terms" className="legal-link me-3">
      Conditions d’utilisation
    </a>
    <a href="#cookies" className="legal-link">
      Politique relative aux cookies
    </a>
  </div>
</Col>

        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
