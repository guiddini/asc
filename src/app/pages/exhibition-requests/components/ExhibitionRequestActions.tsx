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

interface ExhibitionRequestActionsProps {
  row: ExhibitionDemand;
}

const ExhibitionRequestActions = ({ row }: ExhibitionRequestActionsProps) => {
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const queryClient = useQueryClient();

  const acceptMutation = useMutation({
    mutationFn: (id: string) => acceptExhibitionDemandApi(id),
    mutationKey: ["accept-exhibition-demand", row.id],
    onSuccess: () => {
      queryClient.invalidateQueries("exhibition-requests");
      toast.success("Request accepted successfully");
      setShowAcceptModal(false);
    },
    onError: () => {
      toast.error("Error while accepting the request");
    },
  });

  const rejectMutation = useMutation(refuseExhibitionDemandApi, {
    onSuccess: () => {
      queryClient.invalidateQueries("exhibition-requests");
      toast.success("Request rejected successfully");
      setShowRejectModal(false);
    },
    onError: () => {
      toast.error("Error while rejecting the request");
    },
  });

  const handleAccept = () => {
    if (row.status !== "accepted") {
      acceptMutation.mutate(row.id);
    }
  };

  const handleReject = () => {
    if (row.status !== "refused") {
      rejectMutation.mutate(row.id);
    }
  };

  const disableAccept = row?.status === "accepted";
  const disableReject = row?.status === "refused";

  return (
    <>
      <div className="d-flex align-items-center justify-content-center gap-3">
        <button
          disabled={disableAccept}
          onClick={() => setShowAcceptModal(true)}
          className={`btn btn-sm btn-icon ${
            !disableAccept ? "btn-light-success" : "btn-light"
          }`}
        >
          <Check
            size={16}
            color={!disableAccept ? "#00c4c4" : "#ccc"}
            role="button"
            style={{
              cursor: !disableAccept ? "pointer" : "not-allowed",
            }}
          />
        </button>
        <button
          disabled={disableReject}
          onClick={() => setShowRejectModal(true)}
          className={`btn btn-sm btn-icon ${
            !disableReject ? "btn-light-danger" : "btn-light"
          }`}
        >
          <X
            size={16}
            color={!disableReject ? "#f8285a" : "#ccc"}
            role="button"
            style={{
              cursor: !disableReject ? "pointer" : "not-allowed",
            }}
          />
        </button>
      </div>

      {/* Accept Modal */}
      <Modal
        show={showAcceptModal}
        onHide={() => setShowAcceptModal(false)}
        backdrop={true}
        dialogClassName="modal-dialog modal-dialog-centered mw-600px"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="fw-bolder">Accept Exhibition Request</h2>
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
              <h3>Request Details</h3>
              <p>Company: {row.company?.name}</p>
              <p>Exhibition Type: {row.exhibition_type}</p>
              <p>Status: {row.status}</p>
            </div>
          </Modal.Body>

          <Modal.Footer className="w-100 d-flex flex-row align-items-center justify-content-between">
            <Button
              variant="secondary"
              onClick={() => setShowAcceptModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAccept}
              disabled={acceptMutation.isLoading}
            >
              {acceptMutation.isLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Confirm"
              )}
            </Button>
          </Modal.Footer>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        show={showRejectModal}
        onHide={() => setShowRejectModal(false)}
        backdrop={true}
        dialogClassName="modal-dialog modal-dialog-centered mw-600px"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="fw-bolder">Reject Exhibition Request</h2>
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
                  <h4 className="text-gray-900 fw-bold">Warning</h4>
                  <div className="fs-6 text-gray-700">
                    Are you sure you want to reject this exhibition request?
                    This action cannot be undone.
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-5">
              <h3>Request Details</h3>
              <p>Company: {row.company?.name}</p>
              <p>Exhibition Type: {row.exhibition_type}</p>
            </div>
          </Modal.Body>

          <Modal.Footer className="w-100 d-flex flex-row align-items-center justify-content-between">
            <Button
              variant="secondary"
              onClick={() => setShowRejectModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleReject}
              disabled={rejectMutation.isLoading}
            >
              {rejectMutation.isLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Reject Request"
              )}
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default ExhibitionRequestActions;
