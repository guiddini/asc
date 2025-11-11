import React, { useRef } from "react";
import { useQuery } from "react-query";
import { getPublicSponsors } from "../../../apis/sponsor";
import type { Sponsor } from "../../../types/sponsor";
import getMediaUrl from "../../../helpers/getMediaUrl";

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

  const { data: partners, isLoading, isError } = useQuery<Sponsor[]>(
    ["public-sponsors", "partner"],
    () => getPublicSponsors({ type: "partner" }),
    { staleTime: 5 * 60 * 1000, retry: 1 }
  );

  const logos: { src: string; alt: string }[] = (partners || []).map((p) => ({
    src: getMediaUrl(p.logo) || "/sponsors/commingSoon.jpeg",
    alt: p.name || "Partner",
  }));

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
            {isLoading && <div data-partner-card-wrap><div data-partner-card><div data-logo><img src="/sponsors/commingSoon.jpeg" alt="Loading" /></div></div></div>}
            {isError && <div data-partner-card-wrap><div data-partner-card><div data-logo><img src="/sponsors/commingSoon.jpeg" alt="Error" /></div></div></div>}
            {!isLoading && !isError && (logos.length > 0 ? (
              logos.map((logo, idx) => (
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
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div data-partner-card-wrap>
                <div data-partner-card>
                  <div data-logo>
                    <img
                      src="/sponsors/commingSoon.jpeg"
                      alt="Coming Soon"
                      width={220}
                      height={220}
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
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
