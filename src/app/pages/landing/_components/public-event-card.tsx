import { Calendar, MapPin } from "lucide-react";
import { Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

interface PublicEventCardProps {
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  url: string;
  hasPassed: boolean;
}

export default function PublicEventCard({
  title,
  description,
  date,
  location,
  image = "/fintech-summit-bg.jpg",
  url,
  hasPassed,
}: PublicEventCardProps) {
  return (
    <Link to={hasPassed ? "" : url} className="public-event-card">
      <div
        className="public-event-card-image"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="public-event-card-overlay">
          <div className="public-event-card-tags">
            <span className="public-event-tag fintech">Fintech</span>
            <span className="public-event-tag ecommerce">E-commerce</span>
          </div>
        </div>
      </div>
      <div className="public-event-card-content">
        <div className="public-event-card-meta">
          {hasPassed ? (
            <span id="passed-event">Passé</span>
          ) : (
            <div className="public-event-card-meta-item">
              <Calendar size={16} className="meta-icon" />
              <span>{date}</span>
            </div>
          )}
          <div className="public-event-card-meta-item">
            <MapPin size={16} className="meta-icon" />
            <span>{location}</span>
          </div>
        </div>
        <h3 className="public-event-card-title">{title}</h3>
        <p className="public-event-card-description">{description}</p>
      </div>
    </Link>
  );
}
