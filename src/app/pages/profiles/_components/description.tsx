import { Landmark, ShoppingCart } from "lucide-react";
import React from "react";
import { Event } from "../page";

const Description = ({ event }: { event: Event }) => {
  return (
    <div className="description-section">
      <div className="container">
        <div className="event-tag-container">
          <span className="event-tag">
            <Landmark />
            <p>Fintech</p>
          </span>
          <span className="event-tag">
            <ShoppingCart />
            <p> E-commerce</p>
          </span>
        </div>

        <h1>{event?.title}</h1>
        <p id="description">{event?.description}</p>
      </div>
    </div>
  );
};

export default Description;
