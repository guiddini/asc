import React from "react";
import Lottie from "react-lottie";
import Loader from "../../../../../../public/media/eventili/lotties/loader.json";

type PaymentStatus = "Pending" | "Finished";

interface PaymentStatusOverlayProps {
  status: PaymentStatus;
  onClose: () => void;
}

export const PaymentStatusOverlay: React.FC<PaymentStatusOverlayProps> = ({
  status,
  onClose,
}) => {
  const getStatusContent = () => {
    switch (status) {
      case "Pending":
        return {
          icon: Loader,
          title: "Paiement en cours",
          message:
            "Veuillez patienter pendant que nous traitons votre paiement. Ne fermez pas cette fenêtre.",
        };
      case "Finished":
        return {
          icon: (
            <svg
              className="status-icon finished"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
                fill="currentColor"
              />
            </svg>
          ),
          title: "Paiement terminé",
          message:
            "Votre paiement a été traité. Veuillez vérifier votre email pour plus de détails.",
        };
    }
  };

  const { icon, title, message } = getStatusContent();

  return (
    <div id="payment-status-overlay">
      <div id="payment-status-content">
        <Lottie
          isClickToPauseDisabled={true}
          options={{
            loop: true,
            animationData: icon,
          }}
        />
        <h2>{title}</h2>
        <p>{message}</p>
        {status === "Finished" && (
          <button id="close-status-button" onClick={onClose}>
            Fermer
          </button>
        )}
      </div>
    </div>
  );
};
