import { Outlet, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const AuthLayout = () => {
  return (
    <div id="auth-layout">
      <div id="auth-layout-wrapper">
        <div id="auth-layout-left">
          <div id="welcome-content">
            <h1>
              Bienvenue sur <span id="highlight">Eventili</span>
              <br />
              L'endroit où chaque événement commence !
            </h1>
            <p>
              Rejoignez une communauté de rêveurs, créateurs et organisateurs
              qui donnent vie à des expériences inoubliables. Que vous planifiez
              votre prochain grand événement ou que vous soyez à la recherche de
              votre prochaine aventure, Eventili rend tout simple, fluide et
              excitant.
            </p>
            <p>
              Ne manquez pas l'opportunité de faire partie de quelque chose
              d'extraordinaire. Réservez votre place dès aujourd'hui et laissez
              l'aventure commencer !
            </p>
          </div>
          <a href="https://guiddini.com/" target="_blank" id="powered-by">
            <span>
              Un produit de <span id="owner">Guiddini</span>{" "}
            </span>
            <img src="/media/eventili/logos/guiddini-long.svg" alt="" />
          </a>
        </div>
        <div id="auth-layout-right">
          <div id="auth-header">
            <Link to="/" id="back-home">
              <ArrowLeft size={16} />
              Accueil
            </Link>

            <Link to="/" id="auth-logo">
              <img src="/media/eventili/logos/logo.svg" alt="" />
            </Link>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export { AuthLayout };
