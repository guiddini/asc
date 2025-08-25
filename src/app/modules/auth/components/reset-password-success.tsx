import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const ResetPasswordSuccess = () => {
  return (
    <div className="reset-success-container">
      <img src="/media/eventili/illustrations/success.svg" alt="" width={200} />

      <h1>Mot de passe mis à jour avec succès ! 🎉</h1>

      <p>
        Votre mot de passe a été changé avec succès.
        <br />
        Vous pouvez maintenant vous connecter avec votre nouveau mot de passe
        pour accéder
        <br />à votre compte en toute sécurité.
      </p>

      <div className="buttons-container">
        <Link to="/auth/login" className="primary-button">
          Connectez-vous à votre compte
          <ArrowRight size={20} />
        </Link>

        <Link to="/" className="secondary-button">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordSuccess;
