import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const ResetPasswordSuccess = () => {
  return (
    <div className="reset-success-container">
      <img src="/media/eventili/illustrations/success.svg" alt="" width={200} />

      <h1>Password updated successfully! 🎉</h1>

      <p>
        Your password has been changed successfully.
        <br />
        You can now log in with your new password to access
        <br />
        your account securely.
      </p>

      <div className="buttons-container">
        <Link to="/auth/login" className="primary-button">
          Sign in to your account
          <ArrowRight size={20} />
        </Link>

        <Link to="/" className="secondary-button">
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordSuccess;
