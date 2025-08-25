import {
  MapPin,
  LinkIcon,
  Mail,
  ArrowRight,
  CalendarDays,
  FileDown,
} from "lucide-react";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import { Event } from "../page";

export default function EventCard({ event }: { event: Event }) {
  return (
    <div className="event-card">
      <img
        src={toAbsoluteUrl("/media/eventili/logos/afes-long.png")}
        alt="FINTECH & E-commerce Summit"
        className="logo"
      />

      <div className="date-container">
        <div className="date-icon">
          <CalendarDays />
        </div>
        <div>
          <h2 className="event-title">Date de l'Événement</h2>
          <p className="event-date">{event?.date}</p>
        </div>
      </div>

      <p className="description">{event?.description}</p>

      <div className="info-item">
        <MapPin className="info-icon" size={20} />
        <span>{event?.location}</span>
      </div>

      <div className="info-item">
        <LinkIcon className="info-icon" size={20} />
        <a href={event?.website} target="_blank" rel="noopener noreferrer">
          {event?.website}
        </a>
      </div>

      <div className="info-item">
        <Mail className="info-icon" size={20} />
        <a href={`mailto:${event?.email}`}>{event?.email}</a>
      </div>

      <div className="organizers-section">
        <h3 className="organizers-title">ORGANISATEURS D'ÉVÉNEMENTS</h3>
        {event?.organizers?.map((img, idx) => (
          <img
            key={idx}
            src={toAbsoluteUrl(img)}
            alt="organizer-logo"
            className="organizer-logo"
          />
        ))}
      </div>

      {event?.cta2 && (
        <button
          onClick={event?.onClick2}
          className="reserve-button"
          style={{
            marginBottom: "8px",
          }}
        >
          {event?.cta2}
          <FileDown size={20} />
        </button>
      )}

      {event?.cta && (
        <button onClick={event?.onClick} className="reserve-button">
          {event?.cta}
          {event?.showIcon && <ArrowRight size={20} />}
        </button>
      )}
    </div>
  );
}
