import React, { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import SpeakerList from "./speaker-list";
import { useQuery } from "react-query";
import { getAllSpeakers, SpeakersResponse } from "../../../apis/speaker";

const SpeakerSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const gridRef = useRef<HTMLDivElement | null>(null);
  // Mobile/md window within page (2 speakers per step)
  const [mobileStart, setMobileStart] = useState(0);
  const [isStacked, setIsStacked] = useState(false);
  const [pendingPrevJump, setPendingPrevJump] = useState(false);
  const [pendingNextJump, setPendingNextJump] = useState(false);

  // Fetch speakers using React Query with currentPage param
  const { data, isLoading, isError } = useQuery<SpeakersResponse>(
    ["speakers", currentPage],
    () => getAllSpeakers(currentPage),
    {
      keepPreviousData: true,
      staleTime: 5000,
    }
  );

  // Speakers from API response or empty array if loading
  const speakers = data?.data || [];

  // Filter speakers based on search term locally on current page
  const filteredSpeakers = speakers.filter((speaker) => {
    const lowerSearch = searchTerm.toLowerCase();
    const fullName = `${speaker.fname} ${speaker.lname}`.toLowerCase();
    return fullName.includes(lowerSearch);
  });

  const totalPages = data?.last_page || 1;

  // Detect md and down (<= 991.98px) to stack 1-per-row
  useEffect(() => {
    const handler = () => setIsStacked(window.innerWidth <= 991.98);
    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Reset to page 1 when search term changes (optional: can keep currentPage)
  useEffect(() => {
    setCurrentPage(1);
    setMobileStart(0);
  }, [searchTerm]);

  // Reset grid scroll on page change
  useEffect(() => {
    gridRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // After page data loads, honor pending cross-page mobile jumps
  useEffect(() => {
    if (pendingPrevJump) {
      const len = filteredSpeakers.length;
      setMobileStart(Math.max(0, len - 2));
      setPendingPrevJump(false);
    }
    if (pendingNextJump) {
      setMobileStart(0);
      setPendingNextJump(false);
    }
  }, [speakers, pendingPrevJump, pendingNextJump]);

  const onPrev = () => {
    if (isStacked) {
      if (mobileStart > 0) {
        setMobileStart(Math.max(0, mobileStart - 2));
      } else if (currentPage > 1) {
        setPendingPrevJump(true);
        setCurrentPage((p) => Math.max(1, p - 1));
      }
    } else {
      setCurrentPage((p) => Math.max(1, p - 1));
    }
  };

  const onNext = () => {
    if (isStacked) {
      if (mobileStart + 2 < filteredSpeakers.length) {
        setMobileStart(mobileStart + 2);
      } else if (currentPage < totalPages) {
        setPendingNextJump(true);
        setCurrentPage((p) => Math.min(totalPages, p + 1));
      }
    } else {
      setCurrentPage((p) => Math.min(totalPages, p + 1));
    }
  };

  return (
    <section id="landing-speaker-section">
      <div id="landing-speaker-container">
        <div id="landing-speaker-header">
          <h2 id="landing-speaker-heading">Meet Our Speakers</h2>
          <p id="landing-speaker-subheading">
            Discover the minds shaping the future of innovation and
            entrepreneurship
          </p>
        </div>

        <div id="landing-speaker-slider-wrap" className="w-100">
          <button
            id="landing-speaker-prev"
            aria-label="Previous page"
            onClick={onPrev}
            disabled={currentPage <= 1}
          >
            <i className="bi bi-chevron-left" />
          </button>
          <div id="landing-speaker-slider" className="grid" ref={gridRef}>
            {isLoading ? (
              <div data-placeholder>Loading speakers...</div>
            ) : isError ? (
              <div data-placeholder>Error loading speakers.</div>
            ) : filteredSpeakers.length > 0 ? (
              <SpeakerList
                speakers={
                  isStacked
                    ? filteredSpeakers.slice(mobileStart, mobileStart + 2)
                    : filteredSpeakers.slice(0, 10)
                }
                activeIndex={-1}
                onSelect={() => {}}
              />
            ) : (
              // Empty state: keep card styling but show a Coming Soon image
              <SpeakerList
                speakers={[
                  {
                    id: "coming-soon",
                    avatar: "", // force placeholder usage
                    fname: "Coming",
                    lname: "Soon",
                  },
                ]}
                activeIndex={0}
                onSelect={() => {}}
                placeholderImage="/side-events/commingsoon.jpeg"
              />
            )}
          </div>
          <button
            id="landing-speaker-next"
            aria-label="Next page"
            onClick={onNext}
            disabled={
              isStacked
                ? mobileStart + 2 >= filteredSpeakers.length && currentPage >= totalPages
                : currentPage >= totalPages
            }
          >
            <i className="bi bi-chevron-right" />
          </button>
        </div>

        {/* Removed page indicator as requested */}
      </div>
    </section>
  );
};

export default SpeakerSection;
