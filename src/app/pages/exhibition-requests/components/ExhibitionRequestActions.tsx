import { useState } from "react";
import { Check, X, AlertTriangle } from "lucide-react";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { ExhibitionDemand } from "../../../types/exhibition";
import {
  acceptExhibitionDemandApi,
  refuseExhibitionDemandApi,
} from "../../../apis/exhibition";
import { Modal, Button, Spinner } from "react-bootstrap";
import { KTIcon } from "../../../../_metronic/helpers";
import { useForm } from "react-hook-form";

interface ExhibitionRequestActionsProps {
  row: ExhibitionDemand;
}

const ExhibitionRequestActions = ({ row }: ExhibitionRequestActionsProps) => {
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const queryClient = useQueryClient();

  const { register, handleSubmit, watch, reset } = useForm<{
    role: string;
    refusal_reason?: string;
  }>({
    defaultValues: { role: "exhibitor" },
  });

  const acceptMutation = useMutation({
    mutationFn: ({ role, id }: { id: string; role: string }) =>
      acceptExhibitionDemandApi(id, role),
    mutationKey: ["accept-exhibition-demand", row.id],
    onSuccess: () => {
      queryClient.invalidateQueries("exhibition-requests");
      toast.success("Demande acceptée avec succès");
      setShowAcceptModal(false);
      reset();
    },
    onError: () => {
      toast.error("Erreur lors de l'acceptation de la demande");
    },
  });

  const rejectMutation = useMutation(refuseExhibitionDemandApi, {
    onSuccess: () => {
      queryClient.invalidateQueries("exhibition-requests");
      toast.success("Demande rejetée avec succès");
      setShowRejectModal(false);
      reset();
    },
    onError: () => {
      toast.error("Erreur lors du rejet de la demande");
    },
  });

  const handleAccept = (data: { role: string }) => {
    if (row.status === "Pending") {
      acceptMutation.mutate({ id: row.id, role: data.role });
    }
  };

  const handleReject = () => {
    if (row.status === "Pending") {
      rejectMutation.mutate(row.id);
    }
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-center gap-3">
        <button
          onClick={() => setShowAcceptModal(true)}
          className={`btn btn-sm btn-icon ${
            row?.status === "Pending" ? "btn-light-success" : "btn-light"
          }`}
        >
          <Check
            size={16}
            color={row.status === "Pending" ? "#59efb2" : "#ccc"}
            onClick={() => row.status === "Pending" && setShowAcceptModal(true)}
            role="button"
            style={{
              cursor: row.status === "Pending" ? "pointer" : "not-allowed",
            }}
          />
        </button>
        <button
          onClick={() => setShowRejectModal(true)}
          className={`btn btn-sm btn-icon ${
            row?.status === "Pending" ? "btn-light-danger" : "btn-light"
          }`}
        >
          <X
            size={16}
            color={row.status === "Pending" ? "#f8285a" : "#ccc"}
            onClick={() => row.status === "Pending" && setShowRejectModal(true)}
            role="button"
            style={{
              cursor: row.status === "Pending" ? "pointer" : "not-allowed",
            }}
          />
        </button>
      </div>

      {/* Accept Modal */}
      <Modal
        show={showAcceptModal}
        onHide={() => setShowAcceptModal(false)}
        backdrop={true}
        id="kt_modal_accept_exhibition"
        tabIndex={-1}
        aria-hidden="true"
        dialogClassName="modal-dialog modal-dialog-centered mw-600px"
      >
        <form onSubmit={handleSubmit(handleAccept)} className="modal-content">
          <div className="modal-header">
            <h2 className="fw-bolder">Accepter la demande d'exposition</h2>
            <div
              className="btn btn-icon btn-sm btn-active-icon-primary"
              style={{ cursor: "pointer" }}
              onClick={() => setShowAcceptModal(false)}
            >
              <KTIcon iconName="cross" className="fs-1" />
            </div>
          </div>

          <Modal.Body className="pb-0 px-16 w-100">
            <div className="mb-5">
              <h3>Détails de la demande</h3>
              <p>Entreprise: {row.company?.name}</p>
              <p>Type de stand: {row.stand_type}</p>
              <p>Taille du stand: {row.stand_size} m²</p>
            </div>

            <div className="spearator my-4" />

            <h3>Role :</h3>
            <div className="d-flex flex-column flex-md-row align-items-center gap-4 my-8">
              <div className="form-check form-check-custom form-check-solid">
                <input
                  {...register("role")}
                  className="form-check-input"
                  type="radio"
                  value="exhibitor"
                  id="exhibitorRadio"
                />
                <label className="form-check-label" htmlFor="exhibitorRadio">
                  Exhibitor
                </label>
              </div>

              <div className="form-check form-check-custom form-check-solid">
                <input
                  {...register("role")}
                  className="form-check-input"
                  type="radio"
                  value="sponsor"
                  id="sponsorRadio"
                />
                <label className="form-check-label" htmlFor="sponsorRadio">
                  Sponsor
                </label>
              </div>

              <div className="form-check form-check-custom form-check-solid">
                <input
                  {...register("role")}
                  className="form-check-input"
                  type="radio"
                  value="startup"
                  id="startupRadio"
                />
                <label className="form-check-label" htmlFor="startupRadio">
                  Startup
                </label>
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer className="w-100 d-flex flex-row align-items-center justify-content-between">
            <Button
              variant="secondary"
              onClick={() => setShowAcceptModal(false)}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={acceptMutation.isLoading}
            >
              {acceptMutation.isLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Confirmer"
              )}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* Reject Modal */}
      <Modal
        show={showRejectModal}
        onHide={() => setShowRejectModal(false)}
        backdrop={true}
        id="kt_modal_reject_exhibition"
        tabIndex={-1}
        aria-hidden="true"
        dialogClassName="modal-dialog modal-dialog-centered mw-600px"
      >
        <form onSubmit={handleSubmit(handleReject)} className="modal-content">
          <div className="modal-header">
            <h2 className="fw-bolder">Refuser la demande d'exposition</h2>
            <div
              className="btn btn-icon btn-sm btn-active-icon-primary"
              style={{ cursor: "pointer" }}
              onClick={() => setShowRejectModal(false)}
            >
              <KTIcon iconName="cross" className="fs-1" />
            </div>
          </div>

          <Modal.Body className="pb-0 px-16 w-100">
            <div className="notice d-flex bg-light-warning rounded border-warning border border-dashed mb-12 p-6">
              <AlertTriangle className="text-warning me-4" />
              <div className="d-flex flex-stack flex-grow-1">
                <div className="fw-semibold">
                  <h4 className="text-gray-900 fw-bold">Attention</h4>
                  <div className="fs-6 text-gray-700">
                    Êtes-vous sûr de vouloir refuser cette demande d'exposition
                    ? Cette action est irréversible.
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-5">
              <h3>Détails de la demande</h3>
              <p>Entreprise: {row.company?.name}</p>
              <p>Type de stand: {row.stand_type}</p>
              <p>Taille du stand: {row.stand_size} m²</p>
            </div>
          </Modal.Body>

          <Modal.Footer className="w-100 d-flex flex-row align-items-center justify-content-between">
            <Button
              variant="secondary"
              onClick={() => setShowRejectModal(false)}
            >
              Annuler
            </Button>
            <Button
              variant="danger"
              type="submit"
              disabled={rejectMutation.isLoading}
            >
              {rejectMutation.isLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Refuser la demande"
              )}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default ExhibitionRequestActions;
