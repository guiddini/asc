import { ArrowLeft, Camera } from "lucide-react";
import { SideEvent } from "../../../types/side-event";
import getMediaUrl from "../../../helpers/getMediaUrl";
import { Link } from "react-router-dom";

export default function Hero({ event }: { event: SideEvent }) {
  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${getMediaUrl(event?.cover)})`,
      }}
    >
      <div className="container">
        <Link to="/" id="gallery-cta">
          <span>← Back</span>
        </Link>
      </div>
    </section>
  );
}
