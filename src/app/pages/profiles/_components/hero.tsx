import { Camera } from "lucide-react";
import { SideEvent } from "../../../types/side-event";
import getMediaUrl from "../../../helpers/getMediaUrl";

export default function Hero({ event }: { event: SideEvent }) {
  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${getMediaUrl(event?.cover)})`,
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
