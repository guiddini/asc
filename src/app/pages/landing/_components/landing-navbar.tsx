import { useState } from "react";
import { Link } from "react-router-dom";
import { useScrollNavigation } from "../../../hooks/useScrollNavigation";
import { useSelector } from "react-redux";
import { UserResponse } from "../../../types/reducers";

export default function LandingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useSelector((state: UserResponse) => state.user);
  const navigateAndScroll = useScrollNavigation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = isMenuOpen ? "unset" : "hidden";
  };

  const handleRedirect = (path: string) => {
    navigateAndScroll(path);
    setIsMenuOpen(false);
  };

  return (
    <nav id="landing-navbar">
      <div className="container landing-navbar-container">
        <Link to="/">
          <img
            src="/media/eventili/logos/logo-bg.svg"
            alt="Logo"
            className="landing-navbar-logo"
          />
        </Link>

        <ul className="landing-navbar-links">
          <span onClick={() => handleRedirect("/")}>Accueil</span>
          <span onClick={() => handleRedirect("/#events-section")}>
            Événements
          </span>
          <span onClick={() => handleRedirect("/privacy-policy")}>
            Politique de confidentialité
          </span>
          <span onClick={() => handleRedirect("/#how-it-works")}>
            Comment ça marche
          </span>

          {/* <span onClick={() => handleRedirect("/#events-section")}>Contact</span> */}
        </ul>

        <div className="landing-navbar-buttons">
          {user ? (
            <Link
              to={"/home"}
              className="landing-nav-btn-primary"
              style={{
                whiteSpace: "nowrap",
              }}
            >
              Mon Profil
            </Link>
          ) : (
            <>
              <Link to={"/auth/login"} className="landing-nav-btn-outline">
                Connexion
              </Link>
              <Link to={"/auth/signup"} className="landing-nav-btn-primary">
                Inscription →
              </Link>
            </>
          )}
        </div>

        <button className="landing-menu-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className={`landing-menu-overlay ${isMenuOpen ? "open" : ""}`}>
        <div className="landing-menu-content">
          <button className="landing-close-button" onClick={toggleMenu}>
            ×
          </button>

          <nav className="landing-menu-nav">
            <Link to="/" className="landing-menu-item" onClick={toggleMenu}>
              Accueil
            </Link>
            <Link
              to="/#events-section"
              className="landing-menu-item"
              onClick={toggleMenu}
            >
              Événements
            </Link>
            <span
              className="landing-menu-item"
              onClick={() => handleRedirect("/privacy-policy")}
            >
              Politique de confidentialité
            </span>
            <span
              className="landing-menu-item"
              onClick={() => handleRedirect("/#how-it-works")}
            >
              Comment ça marche
            </span>
          </nav>

          <div className="landing-menu-buttons">
            {user ? (
              <Link
                to={"/home"}
                className="landing-nav-btn-primary"
                style={{
                  whiteSpace: "nowrap",
                }}
              >
                Mon Profil
              </Link>
            ) : (
              <>
                <Link to={"/auth/login"} className="landing-nav-btn-outline">
                  Connexion
                </Link>
                <Link to={"/auth/signup"} className="landing-nav-btn-primary">
                  Inscription →
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
