import { Landmark, ShoppingCart } from "lucide-react";
import { SideEvent } from "../../../types/side-event";

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
        <p id="description">{event?.description}</p>
      </div>
    </div>
  );
};

export default Description;
