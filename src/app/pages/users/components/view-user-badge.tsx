import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { getAdminUserBadgeApi } from "../../../apis";
import { Modal, Spinner } from "react-bootstrap";
import { KTIcon } from "../../../../_metronic/helpers";

interface AssignTicketToUserProps {
  isOpen: boolean;
  setIsOpen: (isOpen: any) => void;
  userID: string | number;
  userName: string;
}

const ViewUserBadge = ({
  isOpen,
  setIsOpen,
  userID,
  userName,
}: AssignTicketToUserProps) => {
  const [pdfSource, setPdfSource] = useState(null);
  const [loadingBadge, setLoadingBadge] = useState<boolean>(false);

  const fetchPdf = async () => {
    setLoadingBadge(true);
    try {
      // Assuming your getUserBadgeApi returns the PDF content as a blob
      const response = await getAdminUserBadgeApi(userID);

      const blob = response.data;

      if (blob instanceof Blob) {
        const file = window.URL.createObjectURL(blob);
        setPdfSource(file);
        setLoadingBadge(false);
      } else {
        console.error("Error fetching PDF: Invalid response format");
        setLoadingBadge(false);
      }
    } catch (error) {
      setLoadingBadge(false);
      console.error("Error fetching PDF:", error);
    }
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    if (userID) {
      fetchPdf();
    }
  }, [userID]);

  const handlePrintPdf = () => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = pdfSource;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow.print();
    };
  };

  const handleDownloadPdf = async () => {
    try {
      const response = await getAdminUserBadgeApi(userID);
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${userName}-badge.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };
  const closeModal = () => setIsOpen(null);

  return (
    <Modal
      show={isOpen}
      onHide={closeModal}
      backdrop={true}
      id="kt_modal_create_app"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-800px"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="fw-bolder">Badge</h2>

          <div
            className="btn btn-icon btn-sm btn-active-icon-primary"
            style={{ cursor: "pointer" }}
            onClick={closeModal}
          >
            <KTIcon iconName="cross" className="fs-1" />
          </div>
        </div>

        <Modal.Body
          style={{
            minHeight: isMobile ? "auto" : "60vh",
          }}
        >
          {loadingBadge ? (
            <div
              style={{
                minHeight: "80vh",
              }}
              className="d-flex justify-content-center align-items-center"
            >
              <Spinner animation="border" color="#000" />
            </div>
          ) : (
            <>
              {isMobile ? (
                <p className="fw-bolder fs-3">
                  Vous ne pouvez pas prévisualiser le badge, mais vous pouvez
                  l'imprimer ou le télécharger.
                </p>
              ) : (
                <>
                  {pdfSource && (
                    <iframe
                      title="PDF Viewer"
                      style={{
                        width: "100%",
                        height: "100%",
                        minHeight: "60vh",
                      }}
                      src={`${pdfSource}`}
                      allowFullScreen
                    />
                  )}
                </>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="w-100">
          <div className="w-100 d-flex flex-row align-items-center justify-content-between mt-6">
            <button
              type="button"
              id="kt_sign_in_submit"
              className="btn btn-custom-blue-dark text-white"
              onClick={closeModal}
            >
              <span className="indicator-label">Retour</span>
            </button>
            <div className="d-flex flex-row gap-2">
              <button
                type="button"
                id="kt_sign_in_submit"
                className="btn btn-custom-blue-dark text-white"
                onClick={handleDownloadPdf}
              >
                <span className="indicator-label">Télécharger</span>
              </button>
              <button
                type="button"
                onClick={handlePrintPdf}
                className="btn btn-custom-purple-dark text-white"
              >
                Imprimer
              </button>
            </div>
          </div>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default ViewUserBadge;
