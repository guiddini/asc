import { Camera } from "lucide-react";
import { Event } from "../page";

export default function Hero({ event }: { event: Event }) {
  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${event?.hero})`,
      }}
    >
      <div className="container">
        <a href="#gallery" id="gallery-cta">
          <Camera />
          <span>View Gallery</span>
        </a>
      </div>
    </section>
  );
}
