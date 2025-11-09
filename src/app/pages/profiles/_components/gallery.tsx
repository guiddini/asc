import { Camera } from "lucide-react";
import { SideEvent } from "../../../types/side-event";
import getMediaUrl from "../../../helpers/getMediaUrl";

export default function Gallery({ event }: { event: SideEvent }) {
  return (
    <section className="gallery" id="gallery">
      <div className="container">
        <div className="gallery-header">
          <div id="svg-container">
            <Camera />
          </div>
          <h2>Photo Gallery</h2>
        </div>
        <div className="gallery-grid">
          {event?.gallery?.map((src, index) => (
            <a
              href={getMediaUrl(src)}
              target="_blank"
              key={index}
              className={`gallery-item ${
                index % 6 === 0 || index % 6 === 3 ? "large" : "small"
              }`}
            >
              <img src={getMediaUrl(src)} alt={`Gallery Image ${index + 1}`} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
