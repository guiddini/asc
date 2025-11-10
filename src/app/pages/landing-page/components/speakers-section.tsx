import React, { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import SpeakerList from "./speaker-list";
import { useQuery } from "react-query";
import { getAllSpeakers, SpeakersResponse } from "../../../apis/speaker";

const SpeakerSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement | null>(null);

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

  // Reset to page 1 when search term changes (optional: can keep currentPage)
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Scroll the active card toward center when index changes
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    const cards = el.querySelectorAll("[data-card]");
    const target = cards[activeIndex] as HTMLElement | undefined;
    if (!target) return;
    const offset =
      target.offsetLeft - el.clientWidth / 2 + target.clientWidth / 2;
    el.scrollTo({ left: offset, behavior: "smooth" });
  }, [activeIndex]);

  // Scroll slider left/right without changing the active card
  const scrollByAmount = (dir: "prev" | "next") => {
    const el = sliderRef.current;
    if (!el) return;
    const amount = el.clientWidth - 160; // show more cards per click
    el.scrollBy({ left: dir === "prev" ? -amount : amount, behavior: "smooth" });
  };

  const onPrev = () => scrollByAmount("prev");
  const onNext = () => scrollByAmount("next");

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

        <div id="landing-speaker-slider-wrap">
          <button
            id="landing-speaker-prev"
            aria-label="Previous"
            onClick={onPrev}
          >
            <i className="bi bi-chevron-left" />
          </button>
          <div id="landing-speaker-slider" ref={sliderRef}>
            {isLoading ? (
              <div data-placeholder>Loading speakers...</div>
            ) : isError ? (
              <div data-placeholder>Error loading speakers.</div>
            ) : filteredSpeakers.length > 0 ? (
              <SpeakerList
                speakers={filteredSpeakers}
                activeIndex={activeIndex}
                onSelect={setActiveIndex}
              />
            ) : (
              <div data-placeholder>No speakers found</div>
            )}
          </div>
          <button id="landing-speaker-next" aria-label="Next" onClick={onNext}>
            <i className="bi bi-chevron-right" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SpeakerSection;
