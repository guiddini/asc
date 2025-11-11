import React from "react";
import HeroSection from "./components/hero-section";
import AboutSection from "./components/about-section";
import SpeakerSection from "./components/speakers-section";
import SponsorsSection from "./components/sponsors-section";
import PartnersSection from "./components/partners-section";
import EventGallerySection from "./components/event-gallery-section";
import ExhibitorsSection from "./components/exhibitors-section";
import SideEventsSection from "./components/side-events-section";
import EventStatsSection from "./components/event-stats-section";

const LandingPage: React.FC = () => {
  return (
    <div id="home-page">
      <HeroSection />
      <AboutSection />
      <EventStatsSection />
      <SpeakerSection />
      <SponsorsSection />
      <PartnersSection />
      <ExhibitorsSection />
      <EventGallerySection
        heading="ASC 2024 In Pictures"
        subheading="A quick look at memorable moments"
      />
      <SideEventsSection />
    </div>
  );
};

export default LandingPage;
