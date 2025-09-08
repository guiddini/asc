import { Lock } from "lucide-react";
import React, { useState } from "react";
import ConfirmTicketModal from "./confirm-ticket-modal";
import { useNavigate } from "react-router-dom";

interface EventCardProps {
  title: string;
  backgroundImage: string;
  isLocked?: boolean;
  isContinue?: boolean;
  isFetching?: boolean;
  canOpenModal?: boolean;
  hasPassed: boolean;
  onClick?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  backgroundImage,
  isLocked = true,
  isContinue = false,
  isFetching = false,
  canOpenModal,
  onClick,
  hasPassed,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div
        id="event-card"
        style={{
          backgroundImage: isFetching ? "none" : `url(${backgroundImage})`,
        }}
        className={isFetching ? "shimmer" : ""}
      >
        {!isFetching && isLocked && (
          <div id="event-card-lock">
            <Lock size={20} />
          </div>
        )}
        <div id="event-card-content">
          {isFetching ? (
            <>
              <div className="shimmer-title"></div>
              <div className="shimmer-button"></div>
            </>
          ) : (
            <>
              <h2>{title}</h2>
              <button
                id="event-card-button"
                style={{
                  background: hasPassed ? "#DC2626" : "",
                  color: hasPassed ? "white" : "black",
                }}
                className={isContinue ? "continue" : ""}
                onClick={() => {
                  if (onClick) {
                    onClick();
                  } else {
                    if (isLocked && !canOpenModal) return;

                    if (isLocked && canOpenModal) {
                      setIsModalOpen(true);
                    }

                    if (isContinue) {
                      navigate("/home");
                    }
                  }
                }}
              >
                {hasPassed ? "Past" : isContinue ? "Continue" : "Get Access"}
                {hasPassed ? (
                  ""
                ) : isContinue ? (
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
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                ) : (
                  <Lock size={16} />
                )}
              </button>
            </>
          )}
        </div>
      </div>
      {isModalOpen && (
        <ConfirmTicketModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default React.memo(EventCard);
