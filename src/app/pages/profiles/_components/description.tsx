import { Landmark } from "lucide-react";
import { SideEvent } from "../../../types/side-event";

// Show a short preview of the description on the left panel
const truncate = (text?: string, max = 160) => {
  if (!text) return "";
  if (text.length <= max) return text;
  const trimmed = text.slice(0, max);
  const lastSpace = trimmed.lastIndexOf(" ");
  return `${trimmed.slice(0, lastSpace > 0 ? lastSpace : max)}…`;
};

const Description = ({ event }: { event: SideEvent }) => {
  return (
    <div className="description-section">
      <div className="container">
        <div className="event-tag-container">
          {event?.categories?.map((cat, idx) => (
            <span className="event-tag">
              <Landmark />
              <p>{cat}</p>
            </span>
          ))}
        </div>

        <h1>{event?.name}</h1>
        <p id="description">{truncate(event?.description)}</p>
      </div>
    </div>
  );
};

export default Description;
