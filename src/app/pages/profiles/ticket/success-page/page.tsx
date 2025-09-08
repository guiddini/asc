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

        <h1 id="ticket-success-title">
          {" "}
          <h1 id="ticket-success-title">
            Your ticket has been successfully reserved
          </h1>
        </h1>

        <p id="ticket-success-description">
          Your ticket reservation was successful.
          <br />
          You can now explore your dashboard to access event details and manage
          your tickets.
        </p>

        <div id="ticket-success-actions">
          <button id="ticket-success-dashboard" onClick={handleAuthRedirect}>
            Go to dashboard
            <ArrowRight size={20} className="rotate-180" />
          </button>

          <button
            id="ticket-success-explore"
            onClick={() => navigate("/#events-section")}
          >
            Explore events
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketBoughtSuccess;
