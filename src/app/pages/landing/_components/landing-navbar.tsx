import { useState } from "react";
import { Link } from "react-router-dom";
import { useScrollNavigation } from "../../../hooks/useScrollNavigation";
import { useSelector } from "react-redux";
import { UserResponse } from "../../../types/reducers";

type LandingNavbarProps = {
  isLight?: boolean;
};

export default function LandingNavbar({ isLight = false }: LandingNavbarProps) {
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

  const textColor = isLight ? "#000000" : "#ffffff";
  const hoverColor = isLight ? "#00c4c4" : "#00c4c4";
  const btnPrimaryBg = isLight ? "#00c4c4" : "#00c4c4";
  const btnPrimaryColor = isLight ? "#000000" : "#000000";

  return (
    <nav id="landing-navbar" className={isLight ? "light" : ""}>
      <div className="container landing-navbar-container">
        <Link to="/">
          <img
            src={"/media/eventili/logos/logo.svg"}
            alt="Logo"
            className="landing-navbar-logo"
          />
        </Link>

        <ul className="landing-navbar-links">
          <span
            style={{ color: textColor }}
            onClick={() => handleRedirect("/")}
          >
            Accueil
          </span>
          <span
            style={{ color: textColor }}
            onClick={() => handleRedirect("/#events-section")}
          >
            Événements
          </span>
          <span
            style={{ color: textColor }}
            onClick={() => handleRedirect("/privacy-policy")}
          >
            Politique de confidentialité
          </span>
        </ul>

        <div className="landing-navbar-buttons">
          {user ? (
            <Link
              to={"/home"}
              className="landing-nav-btn-primary"
              style={{
                backgroundColor: btnPrimaryBg,
                color: btnPrimaryColor,
                whiteSpace: "nowrap",
              }}
            >
              Mon Profil
            </Link>
          ) : (
            <>
              <Link
                to={"/auth/login"}
                className="landing-nav-btn-outline"
                style={{ color: textColor, borderColor: textColor }}
              >
                Connexion
              </Link>
              <Link
                to={"/auth/signup"}
                className="landing-nav-btn-primary"
                style={{
                  backgroundColor: btnPrimaryBg,
                  color: btnPrimaryColor,
                }}
              >
                Inscription →
              </Link>
            </>
          )}
        </div>

        <button className="landing-menu-toggle" onClick={toggleMenu}>
          <span style={{ backgroundColor: textColor }}></span>
          <span style={{ backgroundColor: textColor }}></span>
          <span style={{ backgroundColor: textColor }}></span>
        </button>
      </div>

      <div className={`landing-menu-overlay ${isMenuOpen ? "open" : ""}`}>
        <div className="landing-menu-content">
          <button
            className="landing-close-button"
            onClick={toggleMenu}
            style={{ color: textColor }}
          >
            ×
          </button>

          <nav className="landing-menu-nav">
            <Link
              to="/"
              className="landing-menu-item"
              onClick={toggleMenu}
              style={{ color: textColor }}
            >
              Accueil
            </Link>
            <Link
              to="/#events-section"
              className="landing-menu-item"
              onClick={toggleMenu}
              style={{ color: textColor }}
            >
              Événements
            </Link>
            <span
              className="landing-menu-item"
              onClick={() => handleRedirect("/privacy-policy")}
              style={{ color: textColor }}
            >
              Politique de confidentialité
            </span>
          </nav>

          <div className="landing-menu-buttons">
            {user ? (
              <Link
                to={"/home"}
                className="landing-nav-btn-primary"
                style={{
                  backgroundColor: btnPrimaryBg,
                  color: btnPrimaryColor,
                  whiteSpace: "nowrap",
                }}
              >
                Mon Profil
              </Link>
            ) : (
              <>
                <Link
                  to={"/auth/login"}
                  className="landing-nav-btn-outline"
                  style={{ color: textColor, borderColor: textColor }}
                >
                  Connexion
                </Link>
                <Link
                  to={"/auth/signup"}
                  className="landing-nav-btn-primary"
                  style={{
                    backgroundColor: btnPrimaryBg,
                    color: btnPrimaryColor,
                  }}
                >
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
