import { ArrowLeft, ArrowRight, BadgeCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { UserResponse } from "../../../../types/reducers";

const TicketBoughtSuccess = () => {
  const navigate = useNavigate();

  const { user } = useSelector((state: UserResponse) => state.user);

  const handleAuthRedirect = () => {
    if (user) {
      navigate("/home");
    } else {
      navigate("/auth/login");
    }
  };

  return (
    <div id="ticket-success-page">
      <header id="exhibition-confirmation-header">
        <button
          id="exhibition-confirmation-back"
          onClick={() => (user ? navigate("/home") : navigate("/"))}
        >
          <ArrowLeft size={24} />
          <span>Home</span>
        </button>
        <img
          src="/media/eventili/logos/logo-bg-dark.svg"
          alt="African Startup Conference"
          id="exhibition-confirmation-logo"
        />
      </header>

      <div id="ticket-success-content">
        <div id="ticket-success-icon">
          <BadgeCheck size={48} />
        </div>

        <h1 id="ticket-success-title">Votre ticket est réservé avec succès</h1>

        <p id="ticket-success-description">
          Votre réservation de Ticket a réussi.
          <br />
          Vous pouvez désormais explorer votre tableau de bord pour accéder aux
          détails de l'événement et à la gestion des Tickets.
        </p>

        <div id="ticket-success-actions">
          <button id="ticket-success-dashboard" onClick={handleAuthRedirect}>
            Accéder au tableau de bord
            <ArrowRight size={20} className="rotate-180" />
          </button>

          <button
            id="ticket-success-explore"
            onClick={() => navigate("/#events-section")}
          >
            Explorer les événements
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketBoughtSuccess;
