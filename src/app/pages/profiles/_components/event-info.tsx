import {
  MapPin,
  LinkIcon,
  Mail,
  ArrowRight,
  CalendarDays,
  FileDown,
} from "lucide-react";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import { SideEvent } from "../../../types/side-event";
import getMediaUrl from "../../../helpers/getMediaUrl";

export default function EventCard({ event }: { event: SideEvent }) {
  return (
    <div className="event-card">
      <img src={getMediaUrl(event?.logo)} alt={event?.name} className="logo" />

      <div className="date-container">
        <div className="date-icon">
          <CalendarDays />
        </div>
        <div>
          <h2 className="event-title">Event Date</h2>
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
    </div>
  );
}
