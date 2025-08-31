import { Check } from "lucide-react";
import { UserResponse } from "../../types/reducers";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SharedTicketsSuccess = () => {
  const { user } = useSelector((state: UserResponse) => state.user);

  return (
    <div id="shared-ticket-success">
      <div id="success-content">
        <div id="success-container">
          <div id="success-icon-wrapper">
            <Check id="success-icon" />
          </div>
          <h1 id="success-title">Votre Ticket Est Réservé Avec Succès</h1>
          <p id="success-description">
            Votre réservation de Ticket a réussi. Vous pouvez désormais explorer
            votre tableau de bord pour accéder aux détails de l'événement et à
            la gestion des Tickets.
          </p>
          <div id="success-buttons">
            {user ? (
              <Link to="/home" id="button-primary">
                Accéder au tableau de bord
              </Link>
            ) : (
              <Link to="/auth" id="button-primary">
                Se connecter à votre compte
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedTicketsSuccess;
