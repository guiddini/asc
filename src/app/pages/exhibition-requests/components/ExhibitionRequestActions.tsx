import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { ExhibitionDemand } from "../../../types/exhibition";
import {
  acceptExhibitionDemandApi,
  refuseExhibitionDemandApi,
  markExhibitionDemandAsPaidApi,
  markExhibitionDemandAsUnpaidApi,
} from "../../../apis/exhibition";
import { Modal, Button, Spinner, Dropdown, Form } from "react-bootstrap";
import { KTIcon } from "../../../../_metronic/helpers";
import { useNavigate } from "react-router-dom";

interface ExhibitionRequestActionsProps {
  row: ExhibitionDemand;
}

const ExhibitionRequestActions = ({ row }: ExhibitionRequestActionsProps) => {
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showUnpaidModal, setShowUnpaidModal] = useState(false);
  const [unpaidNotes, setUnpaidNotes] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

  const markPaidMutation = useMutation({
    mutationFn: (id: string) => markExhibitionDemandAsPaidApi(id),
    mutationKey: ["mark-exhibition-demand-paid", row.id],
    onSuccess: () => {
      queryClient.invalidateQueries("exhibition-requests");
      toast.success("Marked as paid successfully");
    },
    onError: () => {
      toast.error("Error while marking as paid");
    },
  });

  const markUnpaidMutation = useMutation({
    mutationFn: (payload: { id: string; notes: string }) =>
      markExhibitionDemandAsUnpaidApi(payload.id, payload.notes),
    mutationKey: ["mark-exhibition-demand-unpaid", row.id],
    onSuccess: () => {
      queryClient.invalidateQueries("exhibition-requests");
      toast.success("Marked as unpaid successfully");
      setShowUnpaidModal(false);
      setUnpaidNotes("");
    },
    onError: () => {
      toast.error("Error while marking as unpaid");
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

  const handleMarkPaid = () => {
    markPaidMutation.mutate(row.id);
  };

  const handleOpenUnpaidModal = () => {
    setShowUnpaidModal(true);
  };

  const handleConfirmUnpaid = () => {
    const notes = unpaidNotes.trim();
    if (!notes) {
      toast.error("Please enter notes for marking as unpaid.");
      return;
    }
    markUnpaidMutation.mutate({ id: row.id, notes });
  };

  const handleRedirectToPaymentResults = () => {
    navigate(`/payment/results/${row.id}`);
  };

  const disableAccept = row?.status === "accepted";
  const disableReject = row?.status === "refused";

  return (
    <>
      {/* Actions Dropdown */}
      <Dropdown placement="top-start">
        <Dropdown.Toggle
          variant="transparent"
          color="#fff"
          id="exhibition-request-actions-dropdown"
          className="btn btn-icon btn-color-gray-500 btn-active-color-primary justify-content-end"
        >
          <i className="ki-duotone ki-dots-square fs-1">
            <span className="path1"></span>
            <span className="path2"></span>
            <span className="path3"></span>
            <span className="path4"></span>
          </i>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item
            onClick={() => setShowAcceptModal(true)}
            disabled={disableAccept}
            className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
          >
            <div className="cursor-pointer d-flex flex-row align-items-center">
              <KTIcon
                iconName="check"
                className="fs-1 cursor-pointer m-0 text-success"
              />
              <span className="text-muted ms-2">Accept Request</span>
            </div>
          </Dropdown.Item>

          <Dropdown.Item
            onClick={() => setShowRejectModal(true)}
            disabled={disableReject}
            className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
          >
            <div className="cursor-pointer d-flex flex-row align-items-center">
              <KTIcon
                iconName="cross"
                className="fs-1 cursor-pointer m-0 text-danger"
              />
              <span className="text-muted ms-2">Reject Request</span>
            </div>
          </Dropdown.Item>

          <Dropdown.Item
            onClick={handleMarkPaid}
            disabled={markPaidMutation.isLoading}
            className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
          >
            <div className="cursor-pointer d-flex flex-row align-items-center">
              <KTIcon
                iconName="credit-cart"
                className="fs-1 cursor-pointer m-0 text-primary"
              />
              <span className="text-muted ms-2">
                {markPaidMutation.isLoading
                  ? "Marking as Paid..."
                  : "Mark as Paid"}
              </span>
            </div>
          </Dropdown.Item>

          <Dropdown.Item
            onClick={handleOpenUnpaidModal}
            disabled={markUnpaidMutation.isLoading}
            className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
          >
            <div className="cursor-pointer d-flex flex-row align-items-center">
              <KTIcon
                iconName="credit-cart"
                className="fs-1 cursor-pointer m-0 text-warning"
              />
              <span className="text-muted ms-2">
                {markUnpaidMutation.isLoading
                  ? "Marking as Unpaid..."
                  : "Mark as Unpaid"}
              </span>
            </div>
          </Dropdown.Item>

          {row?.status === "paid" && (
            <Dropdown.Item
              onClick={handleRedirectToPaymentResults}
              className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
            >
              <div className="cursor-pointer d-flex flex-row align-items-center">
                <KTIcon
                  iconName="eye"
                  className="fs-1 cursor-pointer m-0 text-warning"
                />
                <span className="text-muted ms-2">View Payment Results</span>
              </div>
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>

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

      {/* Mark as Unpaid Modal */}
      <Modal
        show={showUnpaidModal}
        onHide={() => setShowUnpaidModal(false)}
        backdrop={true}
        dialogClassName="modal-dialog modal-dialog-centered mw-600px"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="fw-bolder">Mark as Unpaid</h2>
            <div
              className="btn btn-icon btn-sm btn-active-icon-primary"
              style={{ cursor: "pointer" }}
              onClick={() => setShowUnpaidModal(false)}
            >
              <KTIcon iconName="cross" className="fs-1" />
            </div>
          </div>

          <Modal.Body className="pb-0 px-16 w-100">
            <div className="mb-5">
              <h3>Notes</h3>
              <p className="text-muted">
                Add a reason or context for setting this request to unpaid.
              </p>
              <Form.Group controlId="unpaidNotes">
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Enter notes here..."
                  value={unpaidNotes}
                  onChange={(e) => setUnpaidNotes(e.target.value)}
                />
              </Form.Group>
            </div>
          </Modal.Body>

          <Modal.Footer className="w-100 d-flex flex-row align-items-center justify-content-between">
            <Button
              variant="secondary"
              onClick={() => setShowUnpaidModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="warning"
              onClick={handleConfirmUnpaid}
              disabled={markUnpaidMutation.isLoading}
            >
              {markUnpaidMutation.isLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Confirm Unpaid"
              )}
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default ExhibitionRequestActions;
