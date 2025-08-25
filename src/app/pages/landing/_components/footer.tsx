import { toAbsoluteUrl } from "../../../../_metronic/helpers";

export default function Footer() {
  return (
    <footer id="footer">
      <div id="footer-content">
        <img
          src={toAbsoluteUrl("/media/eventili/logos/logo-bg.svg")}
          alt="Logo"
          id="footer-logo"
        />
        <h2 id="footer-title">
          Découvrez. Connectez-vous. Prospérez avec{" "}
          <span id="footer-highlight">African Startup Conference</span>
        </h2>
        <p id="footer-description">
          Vous permettant de trouver les bons événements, établir des connexions
          et prospérer dans votre carrière ou entreprise.
        </p>
      </div>
      <div id="footer-bottom">
        <a
          href="https://guiddini.com/"
          target="_blank"
          id="powered-by"
          style={{
            marginTop: "0",
          }}
        >
          <img src="/media/eventili/logos/algeria-venture-logo.svg" alt="" />
          <span>
            Copyright © 2025 <span id="owner">Algeria Venture</span>
            <br />
            All rights reserved.
          </span>
        </a>
        <div id="footer-links">
          <a href="/about">À propos</a>
          <a href="/events">Événements</a>
          <a href="/terms">Termes et conditions</a>
        </div>
      </div>
    </footer>
  );
}
