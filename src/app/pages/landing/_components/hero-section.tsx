import { Button, Container, Row, Col, Image } from "react-bootstrap";
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
        <span id="landing-hero-label">
          African Startup Conference – 4ème Édition
        </span>
        <h1 id="landing-hero-title">Le regroupement des champions africains</h1>
        <p id="landing-hero-description">
          L’African Startup Conference revient pour sa troisième édition,
          réunissant cette année les champions de l’innovation et de
          l’entrepreneuriat africain. <br />
          Sous le thème{" "}
          <strong>“Le regroupement des champions africains”</strong>,
          l’événement met en lumière les startups, investisseurs, institutions
          et leaders qui façonnent l’avenir de l’Afrique
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
              alt="Play Store"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
