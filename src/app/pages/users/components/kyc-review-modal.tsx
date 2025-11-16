import React, { useEffect } from "react";
import { Modal, Spinner, Badge } from "react-bootstrap";
import { useMutation } from "react-query";
import getMediaUrl from "../../../helpers/getMediaUrl";
import {
  showUserKyc,
  setKycStatus,
  KycStatus,
  KycDecision,
  serveKycFile,
  KycInfoResponse,
} from "../../../apis/kyc";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  userId: string | number;
  userName: string;
  currentStatus: KycStatus | "" | null;
  onStatusChange: (status: KycStatus) => void;
};

const KycReviewModal: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  userId,
  userName,
  currentStatus,
  onStatusChange,
}) => {
  // Store full KYC info and preview state (no URL shown to user)
  const [kycInfo, setKycInfo] = React.useState<KycInfoResponse | null>(null);
  // Explicitly type the document kind to avoid string widening
  type DocumentKind = "identity" | "passport";
  const [selectedDoc, setSelectedDoc] = React.useState<DocumentKind | null>(
    null
  );
  const [fileBlob, setFileBlob] = React.useState<Blob | null>(null);
  const [fileUrl, setFileUrl] = React.useState<string | null>(null);
  const [isPreviewLoading, setPreviewLoading] = React.useState<boolean>(false);
  const [status, setStatus] = React.useState<KycStatus | "" | null>(
    currentStatus || ""
  );

  const { mutate: fetchKyc, isLoading } = useMutation(
    async (id: string | number) => {
      const info = await showUserKyc(id);

      // Narrow the default document type to the literal union
      const defaultDoc: DocumentKind | null = info.identity_url
        ? "identity"
        : info.passport_url
        ? "passport"
        : null;

      let blob: Blob | null = null;
      if (defaultDoc) {
        const remoteUrl =
          defaultDoc === "identity" ? info.identity_url! : info.passport_url!;
        blob = await serveKycFile(remoteUrl);
      }

      return { info, blob, defaultDoc };
    },
    {
      onSuccess: ({ info, blob, defaultDoc }) => {
        // Update KYC details and status
        setKycInfo(info);
        if (info.kyc_status) {
          setStatus(info.kyc_status);
        }

        // Revoke previous object URL if any
        if (fileUrl) {
          URL.revokeObjectURL(fileUrl);
        }
        // Set default doc and preview
        setSelectedDoc(defaultDoc);
        if (blob) {
          const objectUrl = URL.createObjectURL(blob);
          setFileBlob(blob);
          setFileUrl(objectUrl);
        } else {
          setFileBlob(null);
          setFileUrl(null);
        }
      },
    }
  );

  const { mutate: updateStatus, isLoading: isUpdating } = useMutation(
    async (decision: KycDecision) => {
      const res = await setKycStatus(userId, decision);
      return res.kyc_status;
    },
    {
      onSuccess: (newStatus: KycStatus) => {
        setStatus(newStatus);
        onStatusChange(newStatus);
      },
    }
  );

  useEffect(() => {
    if (isOpen && userId) {
      fetchKyc(userId as any);
    }
  }, [isOpen, userId, fetchKyc]);

  // Re-fetch blob when switching between identity/passport (if both exist)
  useEffect(() => {
    const loadPreview = async () => {
      if (!kycInfo || !selectedDoc) return;
      const srcUrl =
        selectedDoc === "identity"
          ? kycInfo.identity_url
          : kycInfo.passport_url;
      if (!srcUrl) {
        setFileBlob(null);
        if (fileUrl) URL.revokeObjectURL(fileUrl);
        setFileUrl(null);
        return;
      }
      setPreviewLoading(true);
      try {
        const blob = await serveKycFile(srcUrl);
        const objectUrl = URL.createObjectURL(blob);
        // Revoke previous URL and set new
        if (fileUrl) URL.revokeObjectURL(fileUrl);
        setFileBlob(blob);
        setFileUrl(objectUrl);
      } finally {
        setPreviewLoading(false);
      }
    };
    loadPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDoc]);

  const handleClose = () => {
    setIsOpen(false);
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }
    setFileUrl(null);
    setFileBlob(null);
    setKycInfo(null);
    setSelectedDoc(null);
  };

  const disabledAccept = status === "accepted";
  const disabledRefuse = status === "refused";

  const renderStatusBadge = () => {
    const s = status || "";
    if (s === "accepted") return <Badge bg="success">Accepted</Badge>;
    if (s === "refused") return <Badge bg="danger">Refused</Badge>;
    if (s === "pending")
      return (
        <Badge bg="warning" text="dark">
          Pending
        </Badge>
      );
    return (
      <Badge bg="light" text="dark">
        Unknown
      </Badge>
    );
  };

  const renderPreview = () => {
    if (isPreviewLoading) {
      return (
        <div className="d-flex align-items-center justify-content-center py-3">
          <Spinner animation="border" size="sm" />
        </div>
      );
    }
    if (!fileBlob || !fileUrl) {
      return (
        <div className="text-muted">No document available for preview</div>
      );
    }
    const type = fileBlob.type || "";
    if (type.startsWith("image/")) {
      return (
        <img
          src={fileUrl}
          alt="KYC document"
          className="img-fluid rounded border"
          style={{ maxHeight: 600, objectFit: "contain" }}
        />
      );
    }
    if (type.includes("pdf")) {
      return (
        <object
          data={fileUrl}
          type="application/pdf"
          width="100%"
          height="600px"
        >
          <p className="text-muted">
            PDF preview is not available in this browser.
          </p>
        </object>
      );
    }
    return (
      <div className="text-muted">
        Preview not supported for type: {type || "unknown"}.
      </div>
    );
  };

  return (
    <Modal show={isOpen} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          KYC Review
          <span className="ms-2 small text-muted">— {userName}</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {isLoading ? (
          <div className="d-flex align-items-center justify-content-center py-5">
            <Spinner animation="border" size="sm" />
          </div>
        ) : (
          <>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="d-flex align-items-center gap-2">
                <span className="fw-bold">Current Status:</span>
                {renderStatusBadge()}
              </div>
              {/* Toggle between Identity/Passport preview when both exist */}
              {kycInfo && (kycInfo.identity_url || kycInfo.passport_url) && (
                <div
                  className="btn-group btn-group-sm"
                  role="group"
                  aria-label="Document selector"
                >
                  <button
                    type="button"
                    className={`btn ${
                      selectedDoc === "identity" ? "btn-primary" : "btn-light"
                    }`}
                    onClick={() => setSelectedDoc("identity")}
                    disabled={!kycInfo.identity_url}
                  >
                    Identity
                  </button>
                  <button
                    type="button"
                    className={`btn ${
                      selectedDoc === "passport" ? "btn-primary" : "btn-light"
                    }`}
                    onClick={() => setSelectedDoc("passport")}
                    disabled={!kycInfo.passport_url}
                  >
                    Passport
                  </button>
                </div>
              )}
            </div>

            {/* KYC details (no URLs shown) */}
            <div className="row g-4 mb-5">
              <div className="col-md-6">
                <h6 className="fw-bold mb-2">Identity</h6>
                <div className="mb-1">
                  <span className="text-muted">Number: </span>
                  {kycInfo?.identity_number ? (
                    <span className="fw-semibold">
                      {kycInfo.identity_number}
                    </span>
                  ) : (
                    <span className="text-muted">No identity number</span>
                  )}
                </div>
                <div>
                  <span className="text-muted">File: </span>
                  {kycInfo?.identity_path ? (
                    <Badge bg="success">Uploaded</Badge>
                  ) : (
                    <Badge bg="secondary" className="text-white">
                      Not uploaded
                    </Badge>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <h6 className="fw-bold mb-2">Passport</h6>
                <div className="mb-1">
                  <span className="text-muted">Number: </span>
                  {kycInfo?.passport_number ? (
                    <span className="fw-semibold">
                      {kycInfo.passport_number}
                    </span>
                  ) : (
                    <span className="text-muted">No passport number</span>
                  )}
                </div>
                <div>
                  <span className="text-muted">File: </span>
                  {kycInfo?.passport_path ? (
                    <Badge bg="success">Uploaded</Badge>
                  ) : (
                    <Badge bg="secondary" className="text-white">
                      Not uploaded
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Inline preview */}
            {renderPreview()}
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <button
          type="button"
          className="btn btn-light"
          onClick={handleClose}
          disabled={isUpdating}
        >
          Close
        </button>
        <button
          type="button"
          className="btn btn-danger"
          disabled={disabledRefuse || isUpdating}
          onClick={() => updateStatus("refused")}
        >
          Refuse
        </button>
        <button
          type="button"
          className="btn btn-success"
          disabled={disabledAccept || isUpdating}
          onClick={() => updateStatus("accepted")}
        >
          Accept
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default KycReviewModal;
