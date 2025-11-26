import React, { useRef } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useQuery } from "react-query";
import { getPublicCompanies } from "../../../apis/company";
import type { PublicCompany } from "../../../types/company";
import getMediaUrl from "../../../helpers/getMediaUrl";
import { useSelector } from "react-redux";
import type { UserResponse } from "../../../types/reducers";
import { useNavigate } from "react-router-dom";

const ExhibitorsSection: React.FC = () => {
  const { user } = useSelector((state: UserResponse) => state.user);
  const isAuthenticated = Boolean(user);
  const navigate = useNavigate();
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

  const {
    data: companies,
    isLoading,
    isError,
  } = useQuery<PublicCompany[]>(
    ["public-companies"],
    () => getPublicCompanies(),
    { staleTime: 5 * 60 * 1000, retry: 1 }
  );

  const logos: { src: string; alt: string; id: string }[] = (
    companies || []
  ).map((c) => ({
    src: getMediaUrl(c.logo) || "/sponsors/commingSoon.jpeg",
    alt: c.name,
    id: c.id,
  }));

  return (
    <section id="landing-exhibitors-section">
      <div id="landing-partners-container">
        <div id="landing-partners-header">
          <h2 id="landing-partners-heading" className="text-black">
            Exhibitors
          </h2>
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
            {isLoading && (
              <div data-partner-card-wrap>
                <div data-partner-card>
                  <div data-logo>
                    <img src="/sponsors/commingSoon.jpeg" alt="Loading" />
                  </div>
                </div>
              </div>
            )}
            {isError && (
              <div data-partner-card-wrap>
                <div data-partner-card>
                  <div data-logo>
                    <img src="/sponsors/commingSoon.jpeg" alt="Error" />
                  </div>
                </div>
              </div>
            )}
            {!isLoading &&
              !isError &&
              (logos.length > 0 ? (
                logos.map((logo, idx) => (
                  <div data-partner-card-wrap key={idx}>
                    <div
                      data-partner-card
                      role={isAuthenticated ? "button" : undefined}
                      style={{
                        cursor: isAuthenticated ? "pointer" : "default",
                      }}
                      onClick={() => {
                        if (isAuthenticated) {
                          navigate(`/company/${logo.id}`);
                        }
                      }}
                    >
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
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
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

export default ExhibitorsSection;
