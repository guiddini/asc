import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import EventCard from "../components/event-card";
import { useAuth } from "../modules/auth";
import { useSelector } from "react-redux";
import { UserResponse } from "../types/reducers";

const WelcomePage = () => {
  const { logout } = useAuth();
  const { user } = useSelector((state: UserResponse) => state.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const userHasTicket = user?.user_has_ticket_id !== null ? true : false;

  const events = useMemo(
    () => [
      {
        title: "Conférence de Presse AFES 2025",
        backgroundImage: "/media/eventili/afes/afes.jpeg",
        isLocked: false,
        isContinue: false,
        onClick: () => {},
        hasPassed: true,
      },
      {
        title: "Algeria Fintech & E-commerce Summit",
        backgroundImage: "/media/eventili/afes/bg.jpg",
        isLocked: !userHasTicket,
        isContinue: userHasTicket,
        hasPassed: false,
      },
    ],
    [userHasTicket]
  );

  return (
    <div className="welcome-container">
      <nav className="nav-bar">
        <div className="nav-left"></div>
        <div className="nav-center">
          <img
            src="/media/eventili/logos/logo-bg.svg"
            alt="Eventili"
            className="logo"
          />
        </div>
        <div className="nav-right">
          <button className="logout-button" onClick={handleLogout}>
            Déconnexion
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </nav>

      <main className="main-content">
        <span className="category-label">TOUS LES ÉVÉNEMENTS</span>

        <h1 className="welcome-heading">
          Bienvenue chez Eventili !
          <br />
          Découvrons votre premier
          <span className="welcome-highlight"> événement</span>
        </h1>

        <p className="welcome-description">
          Explorez une liste organisée d'événements dans les domaines de la
          technologie, du commerce électronique, de la fintech, des affaires,
          des startups et des événements professionnels. Sélectionnez celui qui
          vous enthousiasme, consultez les détails, choisissez votre ticket et
          commencez !
        </p>

        <div className="events-grid">
          {events.map((event, index) => (
            <EventCard
              key={index}
              title={event.title}
              backgroundImage={event.backgroundImage}
              isLocked={event.isLocked}
              isContinue={event.isContinue}
              isFetching={!user}
              canOpenModal={!userHasTicket}
              onClick={event.onClick}
              hasPassed={event.hasPassed}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default React.memo(WelcomePage);
