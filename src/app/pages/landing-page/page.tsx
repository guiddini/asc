import React from "react";
import { Container } from "react-bootstrap";
import HeroSection from "./components/hero-section";
import Header from "./layout/header";
import AboutSection from "./components/about-section";
import SpeakerSection from "./components/speakers-section";
import SponsorsSection from "./components/sponsors-section";
import EventGallerySection from "./components/event-gallery-section";
import SideEventsSection from "./components/side-events-section";
import FooterSection from "./components/footer-section";

const LandingPage: React.FC = () => {
  return (
    <div id="home-page">
      <HeroSection />
      <AboutSection />
      <SpeakerSection />
      <SponsorsSection />
      <EventGallerySection />
      <SideEventsSection />
    </div>
  );
};

export default LandingPage;
