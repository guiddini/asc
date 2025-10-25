import React, { useEffect, useRef, useState } from "react";
import UserTypeComponent from "../landing-page/layout/type-user-component";
import EventGallerySection from "../landing-page/components/event-gallery-section";
// Milestones data
const milestones = [
  {
    year: 2022,
    title: "The Next Revolution",
    text: "The inaugural edition with the ministerial summit laid the foundations for cooperation with the Algiers Declaration on Startup Development, later endorsed by the African Union.",
  },
  {
    year: 2023,
    title: "From Ideas to Impact",
    text: "Adoption of the African Charter for Talent Retention and launch of AFBAN, solidifying the conference’s institutional structure with a Permanent Secretariat.",
  },
  {
    year: 2024,
    title: "Reimagine Africa with AI",
    text: "Focus on AI as a driver of transformation, resulting in the adoption of a continental AI policy framework and action plan.",
  },
  {
    year: 2025,
    title: "Raising African Champions",
    text: 'The 4th Edition, December 6–8, 2025 at CIC Algiers, marks a defining moment under the theme "Raising African Champions".',
  },
];
const AboutPage = () => {
  const [showTypeComponent, setShowTypeComponent] = useState(false);
  const handleCloseType = () => setShowTypeComponent(false);

  return (
    <div className="bg-white w-100">
      <div className="container py-20">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-primary mb-2">
            About the African Startup Conference
          </h1>
          <p className="text-muted fs-5">
            A continental platform for innovation, entrepreneurship, and
            technology
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Our Story */}
            <section className="mb-5">
              <h2 className="h3 fw-bold mb-3">Our Story</h2>
              <p className="mb-3 lh-lg text-secondary fs-5">
                Africa is undergoing a profound transformation, driven by a new
                generation of ambitious and visionary entrepreneurs. In this
                context, the African Startup Conference (ASC) was created as a
                continental platform for innovation, entrepreneurship, and
                technology.
              </p>
              <p className="mb-3 lh-lg text-secondary fs-5">
                Organized under the High Patronage of the President of the
                Algerian Republic, the Conference embodies the continent's
                determination to build a future led by its youth, a future
                rooted in creativity, technological sovereignty, and sustainable
                development.
              </p>
              <p className="mb-0 lh-lg text-secondary fs-5">
                Since its first edition held in December 2022, the African
                Startup Conference has brought together governments,
                policymakers, investors, startups, incubators, the African
                diaspora and other relevant stakeholders to coordinate efforts
                and design a robust, inclusive, and interconnected startup
                ecosystem.
              </p>
            </section>

            <EventGallerySection withBG={false} />

            {/* Our Vision */}
            <section className="mb-5">
              <h2 className="h3 fw-bold mb-3">Our Vision</h2>
              <p className="mb-3 lh-lg text-secondary fs-5">
                The African Startup Conference envisions an Africa that leads
                through innovation, a continent where startups thrive, create
                jobs, drive economic resilience, and shape the technologies of
                tomorrow.
              </p>
              <p className="mb-3 lh-lg text-secondary fs-5">
                Its purpose is to empower African startups to become regional
                and global champions, strengthen continental cooperation, and
                promote a shared prosperity based on knowledge, creativity, and
                inclusion.
              </p>
              <p className="mb-0 lh-lg text-secondary fs-5">
                Through policy dialogue, strategic partnerships, and capacity
                building, The African Startup Conference seeks to make
                innovation a cornerstone of Africa's sustainable growth, while
                ensuring that African youth have the tools, networks, and
                opportunities to compete globally.
              </p>
            </section>

            {/* Milestones - Timeline */}
            <section className="mb-5">
              <h2 className="h3 fw-bold mb-3">Milestones of Impact</h2>
              <p className="text-secondary mb-4 fs-5">
                Since its inception, the African Startup Conference has evolved
                from a bold initiative into a continental movement shaping the
                future of innovation policy in Africa:
              </p>
              <div className="position-relative ms-2">
                <div className="border-start border-2 border-primary-subtle ps-4">
                  {milestones.map((m) => (
                    <div key={m.year} className="position-relative mb-4 ps-3">
                      <span
                        className="position-absolute bg-primary rounded-circle"
                        style={{ width: 10, height: 10, left: -5, top: 10 }}
                      />
                      <h3 className="fw-semibold fs-5 mb-1">
                        {m.year} – "{m.title}"
                      </h3>
                      <p className="text-secondary mb-0 lh-lg fs-5">{m.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Platform for Action - Animated Stats */}
            <section className="mb-5">
              <h2 className="h3 fw-bold mb-3">
                A Platform for Action and Collaboration
              </h2>
              <p className="mb-4 lh-lg text-secondary fs-5">
                More than just an international conference, The ASC2025 connects
                ecosystems across borders and catalyzes dialogue between
                policymakers, investors, and entrepreneurs to accelerate
                Africa's technological and economic sovereignty.
              </p>
              <div className="row text-center gy-4">
                <div className="col-6 col-md-3">
                  <CountUp end={25000} suffix="+" />
                  <small className="text-secondary">Participants</small>
                </div>
                <div className="col-6 col-md-3">
                  <CountUp end={300} suffix="+" />
                  <small className="text-secondary">
                    International Experts
                  </small>
                </div>
                <div className="col-6 col-md-3">
                  <CountUp end={200} suffix="+" />
                  <small className="text-secondary">Investors</small>
                </div>
                <div className="col-6 col-md-3">
                  <CountUp end={40} suffix="+" />
                  <small className="text-secondary">
                    Ministerial Delegations
                  </small>
                </div>
              </div>
            </section>

            {/* Call to Action */}
            <section className="text-center">
              <h2 className="h3 fw-bold mb-3">Join the Movement</h2>
              <p className="mb-3 lh-lg text-secondary fs-5">
                The African Startup Conference is not just a gathering — It's a
                Call to Action.
              </p>
              <p className="mb-4 lh-lg text-secondary fs-5">
                Join us in celebrating Africa's champions, sharing ideas and
                shaping the future of innovation and entrepreneurship.
              </p>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => {
                  setShowTypeComponent(true);
                }}
              >
                Join Us
              </button>
            </section>
          </div>
        </div>
      </div>

      <UserTypeComponent show={showTypeComponent} onHide={handleCloseType} />
    </div>
  );
};

// Minimal count-up component that animates when visible
const CountUp = ({
  end,
  duration = 1500,
  suffix = "",
}: {
  end: number;
  duration?: number;
  suffix?: string;
}) => {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            setValue(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <div ref={ref} className="fw-bold h4 text-primary">
      {value.toLocaleString()}
      {suffix}
    </div>
  );
};

export { AboutPage };
