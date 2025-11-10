import { Camera } from "lucide-react";
import { SideEvent } from "../../../types/side-event";
import getMediaUrl from "../../../helpers/getMediaUrl";
import { useState } from "react";
import { Modal } from "react-bootstrap";

export default function Gallery({ event }: { event: SideEvent }) {
  const [show, setShow] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);

  const open = (src: string) => {
    setCurrent(src);
    setShow(true);
  };

  const close = () => {
    setShow(false);
    setCurrent(null);
  };

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
            <button
              type="button"
              onClick={() => open(src)}
              key={index}
              className={`gallery-item ${
                index % 6 === 0 || index % 6 === 3 ? "large" : "small"
              }`}
              style={{ border: "none", background: "transparent", padding: 0 }}
            >
              <img src={getMediaUrl(src)} alt={`Gallery Image ${index + 1}`} />
            </button>
          ))}
        </div>
      </div>

      <Modal show={show} onHide={close} centered size="lg">
        <Modal.Body className="p-0">
          {current && (
            <img
              src={getMediaUrl(current)}
              alt="Selected gallery item"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          )}
        </Modal.Body>
      </Modal>
    </section>
  );
}
