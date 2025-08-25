import React, { useState } from "react";
import { Check, Printer, Download, Mail, LogIn } from "lucide-react";
import { SubscriptionTransaction } from "../page";
import {
  sendTicketTransactionEmailApi,
  downloadTicketTransactionReceiptApi,
} from "../../../../../apis";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { UserResponse } from "../../../../../types/reducers";

// Define Yup validation schema with French messages
const schema = yup.object().shape({
  email: yup
    .string()
    .email("L'email doit être valide")
    .required("L'email est requis"),
});

interface PaymentSuccessProps {
  subscriptionData: SubscriptionTransaction | null;
}

const SuccessPayment: React.FC<PaymentSuccessProps> = ({
  subscriptionData,
}) => {
  const { user } = useSelector((state: UserResponse) => state.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const { transactionID } = useParams();

  const handlePrint = () => {
    if (subscriptionData) {
    }
  };

  const handleDownload = async () => {
    if (subscriptionData) {
      try {
        const response = await downloadTicketTransactionReceiptApi({
          transactionId: String(subscriptionData.id),
        });

        // Create a Blob URL and download the file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `receipt_${subscriptionData.id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        toast.error("Erreur lors du téléchargement du reçu !");
      }
    }
  };

  const handleSendEmail = async (data: { email: string }) => {
    try {
      const res = await sendTicketTransactionEmailApi({
        transactionId: String(transactionID),
        email: data.email,
      });

      // Success toast
      toast.success("Le reçu a été envoyé avec succès !");
    } catch (error) {
      // Error toast
      toast.error("Erreur lors de l'envoi de l'email !");
    }
  };

  return (
    <div id="payment-success">
      <div className="container">
        <div id="success-header">
          <div className="check-icon">
            <Check size={64} color="#50D7A0" />
          </div>
          <h1>{subscriptionData?.gateway_response_message}</h1>
          <p>
            Votre paiement a été traité avec succès. Merci pour votre achat !
          </p>

          {user && (
            <button
              style={{
                marginTop: "8px",
              }}
              onClick={() => {
                navigate("/welcome");
              }}
              className="action-button download"
            >
              Retour au tableau de bord
              <LogIn size={20} />
            </button>
          )}
        </div>

        <div id="transaction-details">
          <h2>Détails de la transaction</h2>
          <div className="details-container">
            <div className="detail-row">
              <span className="detail-label">Numéro de commande</span>
              <span className="detail-value">{subscriptionData?.order_id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">ID de transaction</span>
              <span className="detail-value">
                {subscriptionData?.gateway_order_id}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Numéro d'autorisation</span>
              <span className="detail-value">
                {subscriptionData?.gateway_code}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Méthode de paiement</span>
              <span className="detail-value">CIB/EDAHABIA</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Date et heure</span>
              <span className="detail-value">
                {subscriptionData?.updated_at || "N/A"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Montant total</span>
              <span className="detail-value">{subscriptionData?.total} DA</span>
            </div>
          </div>
        </div>

        <div id="receipt-actions">
          <div className="action-buttons">
            <button onClick={handlePrint} className="action-button print">
              <Printer size={20} />
              Imprimer
            </button>
            <button onClick={handleDownload} className="action-button download">
              <Download size={20} />
              Télécharger
            </button>
          </div>
          <div className="email-section">
            <form
              className="email-input-container"
              onSubmit={handleSubmit(handleSendEmail)}
            >
              <input
                type="email"
                placeholder="Entrez votre email"
                {...register("email")}
              />
              {errors.email && (
                <span className="error-text">{errors.email.message}</span>
              )}
              <button type="submit" className="action-button email">
                <Mail size={20} />
                Envoyer par email
              </button>
            </form>
          </div>
        </div>

        <div id="support-message">
          <p>En cas de problème, veuillez contacter SATIM</p>
          <img
            src="/media/eventili/satim.png"
            alt="SATIM"
            className="satim-logo"
          />
        </div>
      </div>
    </div>
  );
};

export default SuccessPayment;
