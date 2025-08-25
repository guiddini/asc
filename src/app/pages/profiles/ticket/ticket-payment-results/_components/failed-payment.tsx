import React from "react";
import { XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { SubscriptionTransaction } from "../page";

interface PaymentSuccessProps {
  subscriptionData: SubscriptionTransaction | null;
}

const FailedPayment = ({ subscriptionData }: PaymentSuccessProps) => {
  return (
    <div id="ticket-payment-confirmation" className="failed">
      <XCircle size={64} color="#ef4444" />
      <h2>Paiement échoué</h2>
      <p>{subscriptionData?.gateway_response_message}</p>

      <div className="support-message">
        <p>En cas de problème, veuillez contacter SATIM</p>
        <img
          alt="satim"
          src="/media/eventili/satim.png"
          className="satim-logo"
        />
      </div>

      <Link to="/profiles/afes/tickets" className="retry-button">
        Retour à la page des tickets
      </Link>
    </div>
  );
};

export default FailedPayment;
