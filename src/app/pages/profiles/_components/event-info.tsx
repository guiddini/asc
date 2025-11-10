import { MapPin, LinkIcon, Mail, CalendarDays } from "lucide-react";
import { SideEvent } from "../../../types/side-event";
import getMediaUrl from "../../../helpers/getMediaUrl";
import { format, parseISO } from "date-fns";
import { Button } from "react-bootstrap";

export default function EventCard({ event }: { event: SideEvent }) {
  const getFormattedDate = (date?: string) => {
    if (!date) return "TBA";
    try {
      const parsed = parseISO(date);
      return format(parsed, "PPP"); // e.g., Dec 7, 2025
    } catch (e) {
      const fallback = new Date(date as any);
      if (!isNaN(fallback.getTime())) {
        return format(fallback, "PPP");
      }
      return date;
    }
  };
  return (
    <div className="event-card">
      <div className="event-card-header">
        <img
          src={getMediaUrl(event?.logo)}
          alt={event?.name}
          className="event-card-logo"
        />
        <div className="event-card-name-container">
          <h1 className="event-card-name">{event?.name}</h1>
        </div>
      </div>

      <div className="date-container">
        <div className="date-icon">
          <CalendarDays />
        </div>
        <div>
          <h2 className="event-title">Event Date</h2>
          <p className="event-date">{getFormattedDate(event?.date)}</p>
        </div>
      </div>

      <p className="description">{event?.description}</p>

      <div className="info-item">
        <MapPin className="info-icon" size={20} />
        <span>{event?.location}</span>
      </div>

      <div className="info-item">
        <Mail className="info-icon" size={20} />
        <a href={`mailto:${event?.email}`}>{event?.email}</a>
      </div>

      <Button
        className="w-100"
        as="a"
        href={event?.website}
        target="_blank"
        rel="noopener noreferrer"
      >
        Visit website
      </Button>
    </div>
  );
}
