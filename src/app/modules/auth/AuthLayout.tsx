import { Outlet, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const AuthLayout = () => {
  return (
    <div id="auth-layout">
      <div id="auth-layout-wrapper">
        <div id="auth-layout-left">
          <div id="welcome-content">
            <h1>
              Bienvenue sur{" "}
              <span id="highlight">African Startup Conference</span>
              <br />
              L'endroit où chaque événement commence !
            </h1>
            <p>
              Rejoignez une communauté de rêveurs, créateurs et organisateurs
              qui donnent vie à des expériences inoubliables. Que vous planifiez
              votre prochain grand événement ou que vous soyez à la recherche de
              votre prochaine aventure, African Startup Conference rend tout
              simple, fluide et excitant.
            </p>
            <p>
              Ne manquez pas l'opportunité de faire partie de quelque chose
              d'extraordinaire. Réservez votre place dès aujourd'hui et laissez
              l'aventure commencer !
            </p>
          </div>
        </div>
        <div id="auth-layout-right">
          <div id="auth-header">
            <Link to="/" id="back-home">
              <ArrowLeft size={16} />
              Accueil
            </Link>

            <Link to="/" id="auth-logo">
              <img
                src="/media/eventili/logos/logo.svg"
                alt=""
                style={{
                  height: "40px",
                  width: "auto",
                }}
              />
            </Link>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export { AuthLayout };
