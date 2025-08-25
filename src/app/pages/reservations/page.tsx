import {
  ArrowRight,
  Package,
  Ticket,
  BriefcaseBusiness,
  Users,
} from "lucide-react";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { getCompanyExhibitionDemand } from "../../apis/exhibition";
import { AxiosResponse } from "axios";
import { getStandTypeLabel } from "../../utils/standsData";
import { useSelector } from "react-redux";
import { UserResponse } from "../../types/reducers";
import { companyOwner } from "../../features/userSlice";

interface ExhibitionDemand {
  id: string;
  exhibition_demand_transaction_id: string;
  company_id: string;
  user_id: string;
  stand_type: string;
  stand_size: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ExhibitionTransaction {
  id: string;
  gateway_code: string;
  status: string;
}

interface ApiResponse {
  status: string;
  demand: ExhibitionDemand;
  transaction: ExhibitionTransaction;
}

const CompanyReservationPage = () => {
  const navigate = useNavigate();

  const { user } = useSelector((state: UserResponse) => state.user);
  const companyID = user?.company?.id;
  const hasCompany = user?.company ? true : false;

  const isCompanyOwner = useSelector((state) => companyOwner(state, companyID));

  const { data, isLoading, isError, isSuccess } = useQuery<
    AxiosResponse<ApiResponse>
  >({
    queryFn: getCompanyExhibitionDemand,
    queryKey: ["company-exhibition-demand"],
  });

  const reservationData = data?.data;

  if (isLoading) {
    return (
      <div id="company-reservation-loading">
        <div id="company-reservation-loading-spinner"></div>
        <p>Chargement de vos réservations...</p>
      </div>
    );
  }

  if (isError || !reservationData) {
    return (
      <div id="company-reservation-error">
        <div id="company-reservation-error-content">
          <h1 id="company-reservation-error-title">
            Aucune demande de réservation trouvée
          </h1>
          <p id="company-reservation-error-description">
            Vous n'avez pas encore fait de demande de réservation de stand.
            Commencez par réserver votre espace d'exposition.
          </p>
          <button
            id="company-reservation-error-button"
            onClick={() => navigate("/exhibition/request")}
          >
            Réserver un stand
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="company-reservation-container">
      {isCompanyOwner && (
        <div id="company-reservation-table-card">
          <div id="company-reservation-header">
            <h1 id="company-reservation-title">Gérez vos réservations</h1>
            <p id="company-reservation-description">
              Suivez l'état de vos demandes de réservation, prenez les mesures
              nécessaires et accédez aux fonctionnalités supplémentaires
              d'Eventili en toute transparence.
            </p>
          </div>

          <div id="company-reservation-table-container">
            <table id="company-reservation-table">
              <thead>
                <tr>
                  <th>ID Réservation</th>
                  <th>Type de Stand</th>
                  <th>Taille du Stand</th>
                  <th>Status</th>
                  <th>Status Paiement</th>
                  <th>Numéro d'Autorisation</th>
                  <th>Date de Création</th>
                </tr>
              </thead>
              <tbody>
                {reservationData && (
                  <tr>
                    <td>{reservationData.demand.id.substring(0, 8)}</td>
                    <td>
                      {getStandTypeLabel(reservationData.demand.stand_type)}
                    </td>
                    <td>{reservationData.demand.stand_size} m²</td>
                    <td>
                      <span
                        id={`reservation-status-${reservationData.demand.status.toLowerCase()}`}
                      >
                        {reservationData.demand.status}
                      </span>
                    </td>
                    <td>
                      <span
                        id={`reservation-transaction-${reservationData?.transaction?.status?.toLowerCase()}`}
                      >
                        {reservationData?.transaction?.status}
                      </span>
                    </td>
                    <td>
                      {reservationData?.transaction?.gateway_code || "N/A"}
                    </td>
                    <td>
                      {new Date(
                        reservationData.demand.created_at
                      ).toLocaleDateString()}
                    </td>
                    {/* <td id="reservation-action-buttons">
                    <Button
                      size="sm"
                      variant="light"
                      disabled={reservationData.demand.status === "Accepted"}
                      onClick={() => setShowUpdateModal(true)}
                    >
                      <Pencil size={16} />
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      disabled={reservationData.demand.status === "Accepted"}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td> */}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div id="company-features-grid">
        <div id="feature-card">
          <div id="feature-icon">
            <BriefcaseBusiness size={24} />
          </div>
          <h2 id="feature-title">Offres d'emploi</h2>
          <p id="feature-description">
            Découvrez et publiez des opportunités d'emploi pour les participants
            à l'événement.
          </p>
          <Link
            to={hasCompany ? `/job-offers/${companyID}` : ""}
            id="feature-link"
          >
            Gérer les offres d'emploi
            <span id="feature-link-arrow">→</span>
          </Link>
        </div>

        <div id="feature-card">
          <div id="feature-icon">
            <Package size={24} />
          </div>
          <h2 id="feature-title">Produits et services</h2>
          <p id="feature-description">
            Présentez vos produits ou services aux autres exposants et
            participants.
          </p>
          <Link
            to={hasCompany ? `/company/${companyID}/products` : ""}
            id="feature-link"
          >
            Ajouter des produits et services
            <span id="feature-link-arrow">→</span>
          </Link>
        </div>

        <div id="feature-card">
          <div id="feature-icon">
            <Ticket size={24} />
          </div>
          <h2 id="feature-title">Gestion des tickets</h2>
          <p id="feature-description">
            Distribuez et gérez les tickets attribués à votre entreprise.
          </p>
          <Link to="/tickets" id="feature-link">
            Gérer les tickets
            <span id="feature-link-arrow">→</span>
          </Link>
        </div>

        <div id="feature-card">
          <div id="feature-icon">
            <Users size={24} />
          </div>
          <h2 id="feature-title">Gérer votre équipe</h2>
          <p id="feature-description">
            Ajouter rapidement des membres du l’équipe et contrôlez leurs
            permissions en toute simplicité.
          </p>
          <Link to={`/company/${companyID}/staff`} id="feature-link">
            Gérer mon équipe
            <span id="feature-link-arrow">→</span>
          </Link>
        </div>
      </div>

      {/* {showUpdateModal && (
        <UpdateStandReservationModal
          show={showUpdateModal}
          currentSpaceSize={reservationData?.demand.stand_size}
          currentStandType={reservationData?.demand.stand_type}
          onHide={() => setShowUpdateModal(false)}
        />
      )} */}
    </div>
  );
};

export default CompanyReservationPage;
