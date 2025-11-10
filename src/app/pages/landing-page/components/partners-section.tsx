import React, { useRef } from "react";

const partnerLogos: { src: string; alt: string }[] = [
  { src: "/sponsors/commingSoon.jpeg", alt: "Coming Soon" },
  { src: "/sponsors/commingSoon.jpeg", alt: "Coming Soon" },
  { src: "/sponsors/commingSoon.jpeg", alt: "Coming Soon" },
  { src: "/sponsors/commingSoon.jpeg", alt: "Coming Soon" },
  { src: "/sponsors/commingSoon.jpeg", alt: "Coming Soon" },
];

const PartnersSection: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const scrollByAmount = (dir: "prev" | "next") => {
    const el = sliderRef.current;
    if (!el) return;
    const amount = el.clientWidth - 160;
    el.scrollBy({
      left: dir === "prev" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section id="landing-partners-section">
      <div id="landing-partners-container">
        <div id="landing-partners-header">
          <h2 id="landing-partners-heading">Our Partners</h2>
        </div>

        <div id="landing-partners-slider-wrap">
          <button
            id="landing-partners-prev"
            aria-label="Previous"
            onClick={() => scrollByAmount("prev")}
          >
            <i className="bi bi-chevron-left" />
          </button>

          <div id="landing-partners-slider" ref={sliderRef}>
            {partnerLogos.map((logo, idx) => (
              <div data-partner-card-wrap key={idx}>
                <div data-partner-card>
                  <div data-logo>
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      width={220}
                      height={220}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "fill",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            id="landing-partners-next"
            aria-label="Next"
            onClick={() => scrollByAmount("next")}
          >
            <i className="bi bi-chevron-right" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
