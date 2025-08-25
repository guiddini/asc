import { ArrowLeft, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../modules/auth";

export default function ComingSoon() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <div id="coming-soon-page">
      <nav id="coming-soon-nav">
        <Link to="/welcome" id="back-button">
          <ArrowLeft size={20} />
          Retour
        </Link>
        <div id="logo-container">
          <img src="/media/eventili/logos/logo-white.svg" alt="Eventili" />
        </div>
        <button id="logout-button" onClick={handleLogout}>
          Déconnexion
          <LogOut size={20} />
        </button>
      </nav>

      <main id="coming-soon-content">
        <img
          src="/media/eventili/illustrations/coming-soon.png"
          alt="Prochainement"
        />
        <p id="coming-soon-description">
          Nous innovons constamment pour améliorer votre expérience. Restez à
          l'écoute pour le lancement de nouvelles fonctionnalités qui rendront
          la gestion de vos événements encore plus performante.
        </p>
        <Link to="/" id="back-home-button">
          Retour à l'accueil
          <ArrowLeft size={20} />
        </Link>
      </main>
    </div>
  );
}
