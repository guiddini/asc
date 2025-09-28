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
        title: "African Startup Conference 2025 ",
        backgroundImage: "/media/afes/africainStartup.jpg",
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
            alt="African Startup Conference"
            className="logo"
          />
        </div>
        <div className="nav-right">
          <button className="logout-button" onClick={handleLogout}>
            Logout
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
        <span className="category-label">ALL EVENTS</span>

        <h1 className="welcome-heading">
          Welcome to the African Startup Conference!
          <br />
          Let's discover your first
          <span className="welcome-highlight"> event</span>
        </h1>

        <p className="welcome-description">
          Explore a curated list of events in technology, e-commerce, fintech,
          business, startups, and professional networking. Select the one that
          excites you, check the details, choose your ticket, and get started!
        </p>

        <div className="row">
          {events.map((event, index) => (
            <div key={index} className="col-6 mx-auto">
              <EventCard
                title={event.title}
                backgroundImage={event.backgroundImage}
                isLocked={event.isLocked}
                isContinue={event.isContinue}
                isFetching={!user}
                canOpenModal={!userHasTicket}
                hasPassed={event.hasPassed}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default React.memo(WelcomePage);
