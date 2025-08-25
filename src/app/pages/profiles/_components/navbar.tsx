import { useState } from "react";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import { Link } from "react-router-dom";
import { useScrollNavigation } from "../../../hooks/useScrollNavigation";
import { useSelector } from "react-redux";
import { UserResponse } from "../../../types/reducers";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useSelector((state: UserResponse) => state.user);

  const canAccess = user?.roleValues?.name === "super_admin";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = isMenuOpen ? "unset" : "hidden";
  };
  const navigateAndScroll = useScrollNavigation();
  const handleRedirect = (path: string) => {
    navigateAndScroll(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/">
          <img
            src={toAbsoluteUrl("/media/eventili/logos/logo-bg-dark.svg")}
            alt="Logo"
            width={120}
            height={40}
            className="navbar-logo"
          />
        </Link>

        <ul className="navbar-links">
          <Link to="/">Accueil</Link>
          <span onClick={() => handleRedirect("/#events-section")}>
            Événements
          </span>
          <Link to="/privacy-policy">Politique de confidentialité</Link>
          <span onClick={() => handleRedirect("/#how-it-works")}>
            Comment ça marche
          </span>
        </ul>

        <div className="navbar-buttons">
          {user ? (
            <button
              className="btn nav-btn-primary"
              onClick={() => handleRedirect(canAccess ? "/home" : "/welcome")}
            >
              Mon Profil
            </button>
          ) : (
            <>
              <button
                className="btn nav-btn-outline"
                onClick={() => handleRedirect("/auth/login")}
              >
                Connexion
              </button>
              <button
                className="btn nav-btn-primary"
                style={{
                  whiteSpace: "nowrap",
                }}
                onClick={() => handleRedirect("/auth/login")}
              >
                Inscription →
              </button>
            </>
          )}
        </div>

        <button className="menu-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Menu en superposition */}
      <div className={`menu-overlay ${isMenuOpen ? "open" : ""}`}>
        <div className="menu-content">
          <button className="close-button" onClick={toggleMenu}>
            ×
          </button>

          <nav className="menu-nav">
            <Link to="/" className="menu-item">
              Accueil
            </Link>
            <span
              className="menu-item"
              onClick={() => handleRedirect("/#events-section")}
            >
              Événements
            </span>
            <Link to="/privacy-policy" className="menu-item">
              Politique de confidentialité
            </Link>
            <span
              className="menu-item"
              onClick={() => handleRedirect("/#how-it-works")}
            >
              Comment ça marche
            </span>
          </nav>

          <div className="menu-buttons">
            {user ? (
              <button
                className="btn nav-btn-primary"
                onClick={() => handleRedirect(canAccess ? "/home" : "/welcome")}
              >
                Mon Profil
              </button>
            ) : (
              <>
                <button
                  className="btn nav-btn-outline"
                  onClick={() => handleRedirect("/auth/login")}
                >
                  Connexion
                </button>
                <button
                  className="btn nav-btn-primary"
                  style={{
                    whiteSpace: "nowrap",
                  }}
                  onClick={() => handleRedirect("/auth/login")}
                >
                  Inscription →
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
