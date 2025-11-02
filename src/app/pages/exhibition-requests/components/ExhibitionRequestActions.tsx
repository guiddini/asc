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
  adminEditExhibitionDemandApi,
} from "../../../apis/exhibition";
import { Modal, Button, Spinner, Dropdown, Form, Table } from "react-bootstrap";
import { KTIcon } from "../../../../_metronic/helpers";
import { useNavigate } from "react-router-dom";

interface ExhibitionRequestActionsProps {
  row: ExhibitionDemand;
}

const ExhibitionRequestActions = ({ row }: ExhibitionRequestActionsProps) => {
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showUnpaidModal, setShowUnpaidModal] = useState(false);
  const [showDemandModal, setShowDemandModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [unpaidNotes, setUnpaidNotes] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editExhibitionType, setEditExhibitionType] = useState<
    "connect_desk" | "premium_exhibition_space" | "scale_up_booth"
  >("connect_desk");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // --- added: normalize status helpers & constants ---
  const normalizeStatus = (s?: string) => (s || "").toLowerCase().trim();
  const STATUS_PENDING = "pending";
  const STATUS_PENDING_TRANSFER_CONFIRMATION = "pending transfer confirmation";
  const STATUS_ACCEPTED = "accepted";
  const STATUS_REFUSED = "refused";
  const STATUS_PAID = "paid";
  const STATUS_UNPAID = "unpaid";

  const rowStatus = normalizeStatus(row?.status);
  const isPending = rowStatus === STATUS_PENDING;
  const isPendingTransfer = rowStatus === STATUS_PENDING_TRANSFER_CONFIRMATION;
  const isUnpaid = rowStatus === STATUS_UNPAID;
  // helper for places where either transfer-confirmation or unpaid should show mark-as-paid
  const showMarkPaidState = isPendingTransfer || isUnpaid;
  // helper used by accept/reject handlers (pending OR pending-transfer-confirmation)
  const isPendingOrPendingTransfer = isPending || isPendingTransfer;

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

  const editDemandMutation = useMutation({
    mutationFn: (payload: {
      demand_id: string;
      notes: string;
      exhibition_type:
        | "connect_desk"
        | "premium_exhibition_space"
        | "scale_up_booth";
    }) => adminEditExhibitionDemandApi(payload),
    mutationKey: ["edit-exhibition-demand", row.id],
    onSuccess: () => {
      queryClient.invalidateQueries("exhibition-requests");
      toast.success("Exhibition demand updated successfully");
      setShowEditModal(false);
      setEditNotes("");
    },
    onError: () => {
      toast.error("Error while updating exhibition demand");
    },
  });

  const handleAccept = () => {
    if (rowStatus !== STATUS_ACCEPTED && isPendingOrPendingTransfer) {
      acceptMutation.mutate(row.id);
    }
  };

  const handleReject = () => {
    if (rowStatus !== STATUS_REFUSED && isPendingOrPendingTransfer) {
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

  // Open transfer document in a new tab (uses REACT_APP_API_URL if provided)
  const handleOpenTransferDocument = () => {
    const docPath = row?.transfer_document;
    if (!docPath) return;
    const link = `https://asc.api.eventili.com/admin/file?path=${encodeURIComponent(
      docPath
    )}`;
    window.open(link, "_blank", "noopener,noreferrer");
  };

  const disableAccept = rowStatus === STATUS_ACCEPTED;
  const disableReject = rowStatus === STATUS_REFUSED;

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

        {/* force a clean white background and subtle shadow for the dropdown */}
        <Dropdown.Menu className="bg-white rounded shadow-sm">
          {/* Show Demand Details */}
          <Dropdown.Item
            onClick={() => setShowDemandModal(true)}
            className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
          >
            <div className="cursor-pointer d-flex flex-row align-items-center">
              <KTIcon
                iconName="information"
                className="fs-1 cursor-pointer m-0 text-primary"
              />
              <span className="text-muted ms-2">Show Demand Details</span>
            </div>
          </Dropdown.Item>

          {/* Edit Demand */}
          <Dropdown.Item
            onClick={() => {
              setEditExhibitionType(
                row.exhibition_type as
                  | "connect_desk"
                  | "premium_exhibition_space"
                  | "scale_up_booth"
              );
              setEditNotes("");
              setShowEditModal(true);
            }}
            className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
          >
            <div className="cursor-pointer d-flex flex-row align-items-center">
              <KTIcon
                iconName="pencil"
                className="fs-1 cursor-pointer m-0 text-warning"
              />
              <span className="text-muted ms-2">Edit Demand</span>
            </div>
          </Dropdown.Item>

          {/* Show Founder */}
          <Dropdown.Item
            onClick={() => navigate(`/profile/${row.user_id}`)}
            disabled={!row?.user_id}
            className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
          >
            <div className="cursor-pointer d-flex flex-row align-items-center">
              <KTIcon
                iconName="user"
                className="fs-1 cursor-pointer m-0 text-info"
              />
              <span className="text-muted ms-2">Show Founder</span>
            </div>
          </Dropdown.Item>

          {/* Show Startup */}
          <Dropdown.Item
            onClick={() => navigate(`/company/${row.company_id}`)}
            disabled={!row?.company_id}
            className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
          >
            <div className="cursor-pointer d-flex flex-row align-items-center">
              <KTIcon
                iconName="building"
                className="fs-1 cursor-pointer m-0 text-secondary"
              />
              <span className="text-muted ms-2">Show Startup</span>
            </div>
          </Dropdown.Item>

          {/* View transfer document (only when present) */}
          {row?.transfer_document && (
            <Dropdown.Item
              onClick={handleOpenTransferDocument}
              className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
            >
              <div className="cursor-pointer d-flex flex-row align-items-center">
                <KTIcon
                  iconName="document"
                  className="fs-1 cursor-pointer m-0 text-info"
                />
                <span className="text-muted ms-2">View Transfer Document</span>
              </div>
            </Dropdown.Item>
          )}

          {/* Accept / Reject only for pending */}
          {isPending && (
            <>
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
            </>
          )}

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

          {/* Mark as Paid / Unpaid — show only for pending transfer confirmation OR unpaid */}
          {showMarkPaidState &&
            (rowStatus === "unpaid" ||
              rowStatus === "pending transfer confirmation") && (
              <>
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
              </>
            )}

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

          {/* View Payment Results only when paid */}
          {rowStatus === STATUS_PAID && !row?.transfer_document && (
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

      {/* Show Demand Modal */}
      <Modal
        show={showDemandModal}
        onHide={() => setShowDemandModal(false)}
        backdrop={true}
        dialogClassName="modal-dialog modal-dialog-centered modal-lg"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="fw-bolder">Exhibition Demand Details</h2>
            <div
              className="btn btn-icon btn-sm btn-active-icon-primary"
              style={{ cursor: "pointer" }}
              onClick={() => setShowDemandModal(false)}
            >
              <KTIcon iconName="cross" className="fs-1" />
            </div>
          </div>

          <Modal.Body className="pb-0 px-16 w-100">
            <Table striped bordered hover responsive>
              <tbody>
                <tr>
                  <th>ID</th>
                  <td>{row.id}</td>
                </tr>
                <tr>
                  <th>Company</th>
                  <td>{row.company?.name || "-"}</td>
                </tr>
                <tr>
                  <th>Exhibition Type</th>
                  <td>{row.exhibition_type}</td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-pill small fw-medium ${
                        row.status === "pending"
                          ? "bg-warning text-dark"
                          : row.status === "accepted"
                          ? "bg-success text-white"
                          : row.status === "refused"
                          ? "bg-danger text-white"
                          : row.status === "paid"
                          ? "bg-primary text-white"
                          : row.status === "unpaid"
                          ? "bg-secondary text-white"
                          : "bg-light text-dark"
                      }`}
                    >
                      {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>Payment Method</th>
                  <td>{row.payment_method || "-"}</td>
                </tr>
                <tr>
                  <th>Created At</th>
                  <td>{new Date(row.created_at).toLocaleString()}</td>
                </tr>
                <tr>
                  <th>Updated At</th>
                  <td>{new Date(row.updated_at).toLocaleString()}</td>
                </tr>

                {row.transfer_document && (
                  <tr>
                    <th>Transfer Document</th>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => {
                          const docPath = row.transfer_document;
                          if (!docPath) return;
                          const link = `https://asc.api.eventili.com/admin/file?path=${encodeURIComponent(
                            docPath
                          )}`;
                          window.open(link, "_blank", "noopener,noreferrer");
                        }}
                      >
                        View Document
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Modal.Body>

          <Modal.Footer className="w-100 d-flex flex-row align-items-center justify-content-end">
            <Button
              variant="secondary"
              onClick={() => setShowDemandModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </div>
      </Modal>

      {/* Edit Demand Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        backdrop={true}
        dialogClassName="modal-dialog modal-dialog-centered mw-600px"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="fw-bolder">Edit Exhibition Demand</h2>
            <div
              className="btn btn-icon btn-sm btn-active-icon-primary"
              style={{ cursor: "pointer" }}
              onClick={() => setShowEditModal(false)}
            >
              <KTIcon iconName="cross" className="fs-1" />
            </div>
          </div>

          <Modal.Body className="pb-0 px-16 w-100">
            <div className="mb-5">
              <h3>Demand Details</h3>
              <p>Company: {row.company?.name}</p>

              <Form.Group className="mb-4">
                <Form.Label>Exhibition Type</Form.Label>
                <Form.Select
                  value={editExhibitionType}
                  onChange={(e) =>
                    setEditExhibitionType(
                      e.target.value as
                        | "connect_desk"
                        | "premium_exhibition_space"
                        | "scale_up_booth"
                    )
                  }
                >
                  <option value="connect_desk">Connect Desk</option>
                  <option value="premium_exhibition_space">
                    Premium Exhibition Space
                  </option>
                  <option value="scale_up_booth">Scale Up Booth</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Enter notes here..."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                />
              </Form.Group>
            </div>
          </Modal.Body>

          <Modal.Footer className="w-100 d-flex flex-row align-items-center justify-content-between">
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (!editNotes.trim()) {
                  toast.error("Please enter notes for the edit");
                  return;
                }
                editDemandMutation.mutate({
                  demand_id: row.id,
                  notes: editNotes.trim(),
                  exhibition_type: editExhibitionType,
                });
              }}
              disabled={editDemandMutation.isLoading}
            >
              {editDemandMutation.isLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default ExhibitionRequestActions;
