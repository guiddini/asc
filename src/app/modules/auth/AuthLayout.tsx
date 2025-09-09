import { Outlet, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const AuthLayout = () => {
  return (
    <div id="auth-layout">
      <div id="auth-layout-wrapper">
        <div id="auth-layout-left">
          <div id="welcome-content">
            <h1>
              Welcome to <span id="highlight">African Startup Conference</span>
              <br />
              The place where every event begins!
            </h1>
            <p>
              The African Startup Conference is the ultimate Pan-African
              gathering for innovation and entrepreneurship. For its 4th
              edition, taking place from December 6–8, 2025 in Algiers, the
              conference will spotlight the “African Champions”: high-growth
              startups, investors, policymakers, and the diaspora all coming,
              together to build a competitive and sovereign tech ecosystem.
              Don’t miss the chance to be part of something extraordinary.
              Secure your spot today and let the journey begin!
            </p>
            {/* <p>
              Ne manquez pas l'opportunité de faire partie de quelque chose
              d'extraordinaire. Réservez votre place dès aujourd'hui et laissez
              l'aventure commencer !
            </p> */}
          </div>
        </div>
        <div id="auth-layout-right">
          <div id="auth-header">
            <Link to="/" id="back-home">
              <ArrowLeft size={16} />
              Home
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
