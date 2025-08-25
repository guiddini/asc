import { Button } from "react-bootstrap";
import LandingNavbar from "./landing-navbar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { UserResponse } from "../../../types/reducers";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";

export default function HeroSection() {
  const { user } = useSelector((state: UserResponse) => state.user);
  return (
    <section id="landing-hero">
      <div id="landing-hero-overlay"></div>
      <LandingNavbar />
      <div id="landing-hero-content">
        <span id="landing-hero-label">BIENVENUE SUR EVENTILI</span>
        <h1 id="landing-hero-title">
          Créez des connexions réelles
          <br />
          avec <span id="landing-hero-highlight">Eventili</span>
        </h1>
        <p id="landing-hero-description">
          Rejoignez un monde d'innovation, d'entrepreneuriat et de croissance.
          <br />
          Découvrez, réservez ou organisez des événements qui favorisent le
          succès dans la technologie, les affaires, les startups, et plus
          encore.
        </p>
        <div id="landing-hero-buttons">
          <a href="#events-section" id="landing-book-ticket-btn">
            Explorer les événements
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.eventili.app"
            target="_blank"
            id="landing-play-store"
          >
            <img
              src={toAbsoluteUrl("/media/eventili/afes/play-store.svg")}
              alt=""
            />
          </a>
        </div>
      </div>
    </section>
  );
}
