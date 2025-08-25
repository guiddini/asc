import { Modal, Button } from "react-bootstrap";
import { KTIcon } from "../../../../_metronic/helpers";
import { useMutation } from "react-query";
import { addUserToStaffApi } from "../../../apis";
import toast from "react-hot-toast";
import QRCode from "react-qr-code";

const ShowUserQrCodeModal = ({ isOpen, setIsOpen, userName, userId }) => {
  const closeModal = () => setIsOpen(false);

  return (
    <Modal
      show={isOpen}
      onHide={closeModal}
      backdrop={true}
      id="kt_modal_add_staff"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-650px"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="fw-bolder">QRCODE de {userName}</h2>
          <div
            className="btn btn-icon btn-sm btn-active-icon-primary"
            onClick={closeModal}
            style={{ cursor: "pointer" }}
          >
            <KTIcon iconName="cross" className="fs-1" />
          </div>
        </div>

        <Modal.Body className="w-100 h-100 d-flex align-items-center justify-content-center">
          <QRCode id="qrcode" value={userId} size={400} level="H" />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="light" onClick={closeModal}>
            Annuler
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default ShowUserQrCodeModal;
