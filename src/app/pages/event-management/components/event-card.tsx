import { Lock, LockOpen } from "lucide-react";
import { Link } from "react-router-dom";

interface EventCardProps {
  title: string;
  date?: string;
  image: string;
  action: "Continue" | "Switch" | "Get Access";
  isLocked: boolean;
  variant?: "default" | "photo";
  href?: string;
}

const EventCard = ({
  title,
  date,
  image,
  action,
  isLocked,
  variant = "default",
  href,
}: EventCardProps) => {
  return (
    <div
      id="event-management-card"
      className={variant === "photo" ? "photo" : ""}
      style={{
        backgroundImage: `url(${image})`,
      }}
    >
      <div id="event-management-card-overlay" />

      <div id="event-management-card-content">
        {isLocked ? (
          <Lock className="event-management-card-lock" size={20} />
        ) : (
          <LockOpen className="event-management-card-lock" size={20} />
        )}

        <div id="event-management-card-info">
          <h3>{title}</h3>
          {date && <span>{date}</span>}
        </div>

        {href ? (
          <Link
            to={href}
            id="event-management-card-button"
            className={action === "Switch" ? "switch" : ""}
          >
            {action}
            {action === "Switch" ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M4.167 10H15.833M15.833 10L10.833 5M15.833 10L10.833 15"
                  stroke="currentColor"
                  strokeWidth="1.67"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : action === "Continue" ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M4.167 10H15.833M15.833 10L10.833 5M15.833 10L10.833 15"
                  stroke="currentColor"
                  strokeWidth="1.67"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <Lock size={16} />
            )}
          </Link>
        ) : (
          <button
            id="event-management-card-button"
            className={action === "Switch" ? "switch" : ""}
          >
            {action}
            {action === "Switch" ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M4.167 10H15.833M15.833 10L10.833 5M15.833 10L10.833 15"
                  stroke="currentColor"
                  strokeWidth="1.67"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : action === "Continue" ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M4.167 10H15.833M15.833 10L10.833 5M15.833 10L10.833 15"
                  stroke="currentColor"
                  strokeWidth="1.67"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <Lock size={16} />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
