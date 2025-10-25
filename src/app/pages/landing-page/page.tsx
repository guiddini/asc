import React from "react";
import HeroSection from "./components/hero-section";
import AboutSection from "./components/about-section";
import SpeakerSection from "./components/speakers-section";
import SponsorsSection from "./components/sponsors-section";
import EventGallerySection from "./components/event-gallery-section";
import SideEventsSection from "./components/side-events-section";
import EventStatsSection from "./components/event-stats-section";
import ConferenceSection from "./components/conference-section";
import ConferenceStartupSection from "./components/conference-startup-section";

const LandingPage: React.FC = () => {
  return (
    <div id="home-page">
      <HeroSection />
      <AboutSection />
      <EventStatsSection />
      <ConferenceSection />
      {/* <ConferenceStartupSection /> */}

      <SpeakerSection />
      <SponsorsSection />
      <EventGallerySection
        heading="Highlights from ASC"
        subheading="A quick look at memorable moments"
      />
      <SideEventsSection />
    </div>
  );
};

export default LandingPage;
