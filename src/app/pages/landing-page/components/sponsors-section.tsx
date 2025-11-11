import React, { useRef } from "react";
import { useQuery } from "react-query";
import { getPublicSponsors } from "../../../apis/sponsor";
import type { Sponsor } from "../../../types/sponsor";
import getMediaUrl from "../../../helpers/getMediaUrl";

const SponsorsSection: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const { data: sponsors, isLoading, isError } = useQuery<Sponsor[]>(
    ["public-sponsors", "sponsor"],
    () => getPublicSponsors({ type: "sponsor" }),
    { staleTime: 5 * 60 * 1000, retry: 1 }
  );

  const logos: { src: string; alt: string }[] = (sponsors || []).map((s) => ({
    src: getMediaUrl(s.logo) || "/sponsors/commingSoon.jpeg",
    alt: s.name || "Sponsor",
  }));

  const scrollByAmount = (dir: "prev" | "next") => {
    const el = sliderRef.current;
    if (!el) return;
    const amount = el.clientWidth - 160;
    el.scrollBy({ left: dir === "prev" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section id="landing-sponsors-section">
      <div id="landing-sponsors-container">
        <div id="landing-sponsors-header">
          <h2 id="landing-sponsors-heading">Our Sponsors</h2>
        </div>

        <div id="landing-sponsors-slider-wrap">
          <button
            id="landing-sponsors-prev"
            aria-label="Previous"
            onClick={() => scrollByAmount("prev")}
          >
            <i className="bi bi-chevron-left" />
          </button>

          <div id="landing-sponsors-slider" ref={sliderRef}>
            {isLoading && (
              <div data-sponsor-card-wrap>
                <div data-sponsor-card>
                  <div data-logo>
                    <img src="/sponsors/commingSoon.jpeg" alt="Loading" />
                  </div>
                </div>
              </div>
            )}
            {isError && (
              <div data-sponsor-card-wrap>
                <div data-sponsor-card>
                  <div data-logo>
                    <img src="/sponsors/commingSoon.jpeg" alt="Error" />
                  </div>
                </div>
              </div>
            )}
            {!isLoading && !isError && (logos.length > 0 ? (
              logos.map((logo, idx) => (
                <div data-sponsor-card-wrap key={idx}>
                  <div data-sponsor-card>
                    <div data-logo>
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        width={220}
                        height={220}
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div data-sponsor-card-wrap>
                <div data-sponsor-card>
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
            id="landing-sponsors-next"
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

export default SponsorsSection;
