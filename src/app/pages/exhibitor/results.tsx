import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  X,
  Download,
  Printer,
  RefreshCcw,
} from "lucide-react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { getExhibitionDemandTransactionApi } from "../../apis/exhibition";
import { getStandTypeLabel } from "../../utils/standsData";

interface TransactionData {
  id: string;
  order_id: string;
  gateway_order_id: string;
  gateway_code: string | null;
  gateway_bool: string;
  gateway_error_code: string;
  gateway_response_message: string;
  status: string;
  total: number;
  total_after_tax: number;
  updated_at: string;
  stand_type: string | null;
  stand_size: string | null;
  advertising_fee: number;
  cleaning_fee: number;
  registration_fee: number;
  stand_cost: number;
  tax_value: number;
}

const ExhibitorOnlinePaymentResults: React.FC = () => {
  const navigate = useNavigate();
  const { transactionID } = useParams<{ transactionID: string }>();

  const { data, isLoading, isError } = useQuery<{ data: TransactionData }>({
    queryFn: () => getExhibitionDemandTransactionApi(transactionID!),
    queryKey: ["exhibition-demand-transaction", transactionID],
    enabled: !!transactionID,
  });

  const transactionData = data?.data;
  const isSuccessPayment = transactionData?.status === "Success";

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast.success("Téléchargement du reçu initié");
  };

  const handleRetry = () => {
    navigate(`/exhibition/request`);
  };

  if (isLoading) {
    return (
      <div id="payment-result-page">
        <div id="payment-result-container">
          <div id="payment-result-content">
            <div id="loading-spinner"></div>
            <p>Chargement des détails de la transaction...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !transactionData) {
    return (
      <div id="payment-result-page">
        <div id="payment-result-container">
          <div id="payment-result-content">
            <div id="status-icon" className="error">
              <X size={32} />
            </div>
            <h1 id="status-title">Erreur de chargement</h1>
            <p id="status-message">
              Impossible de charger les détails de la transaction. Veuillez
              réessayer.
            </p>
            <button id="retry-button" onClick={() => window.location.reload()}>
              Recharger la page
              <RefreshCcw size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="payment-result-page">
      <div id="payment-result-container">
        <div id="payment-result-header">
          <Link to="/home" id="back-button">
            <ArrowLeft size={20} />
            Retour au tableau de bord
          </Link>
          <img
            src="/media/eventili/logos/logo-bg-dark.svg"
            alt="Eventili"
            id="logo"
          />
        </div>

        <div id="payment-result-content">
          <div
            id="status-icon"
            className={isSuccessPayment ? "success" : "error"}
          >
            {isSuccessPayment ? <Check size={32} /> : <X size={32} />}
          </div>

          <h1 id="status-title">
            {isSuccessPayment
              ? "Votre Paiement a été accepté"
              : "Paiement échoué"}
          </h1>

          <p id="status-message">
            {isSuccessPayment
              ? "Votre stand a été réservé et vous êtes désormais à un pas de présenter votre entreprise lors de l'événement."
              : transactionData.gateway_response_message ||
                "Une erreur s'est produite lors du paiement. Veuillez réessayer."}
          </p>

          <div id="transaction-details">
            <h2>Détails de la transaction</h2>
            <table id="transaction-table">
              <tbody>
                <tr>
                  <td>Numéro de commande</td>
                  <td>{transactionData.order_id}</td>
                </tr>
                <tr>
                  <td>ID de transaction</td>
                  <td>{transactionData.gateway_order_id}</td>
                </tr>
                {transactionData.gateway_code && (
                  <tr>
                    <td>Numéro d'autorisation</td>
                    <td>{transactionData.gateway_code}</td>
                  </tr>
                )}
                <tr>
                  <td>Méthode de paiement</td>
                  <td>CIB / Edahabia</td>
                </tr>
                <tr>
                  <td>Date et heure</td>
                  <td>
                    {new Date(transactionData.updated_at).toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td>Montant Total</td>
                  <td>{transactionData.total_after_tax.toLocaleString()} DA</td>
                </tr>
                {transactionData.stand_type && (
                  <tr>
                    <td>Type de stand</td>
                    <td>{getStandTypeLabel(transactionData.stand_type)}</td>
                  </tr>
                )}
                {transactionData.stand_size && (
                  <tr>
                    <td>Taille du stand</td>
                    <td>{transactionData.stand_size} m²</td>
                  </tr>
                )}
              </tbody>
            </table>

            {isSuccessPayment ? (
              <div id="action-buttons">
                <button id="print-button" onClick={handlePrint}>
                  <Printer size={20} />
                  Imprimer
                </button>
                <button id="download-button" onClick={handleDownload}>
                  <Download size={20} />
                  Télécharger
                </button>
              </div>
            ) : (
              <button id="retry-button" onClick={handleRetry}>
                Réessayer le paiement
                <RefreshCcw size={20} />
              </button>
            )}
          </div>

          <div id="support-section">
            <p>
              Si vous rencontrez un problème avec le paiement, contactez la
              SATIM
            </p>
            <div id="support-number">
              <img src="/media/eventili/satim.png" alt="SATIM" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExhibitorOnlinePaymentResults;
