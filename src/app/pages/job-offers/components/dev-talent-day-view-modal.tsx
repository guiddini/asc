import { Modal, Row, Spinner } from "react-bootstrap";
import { KTIcon } from "../../../../_metronic/helpers";
import { CompanyJobApplication } from "../company-job-applications";
import ApplicantDetailComponent from "./company-jobapplications/applicant-detail-component";

interface DevTalentDayViewModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  job: CompanyJobApplication;
}

const DevTalentDayViewModal = ({
  isOpen,
  job,
  setIsOpen,
}: DevTalentDayViewModalProps) => {
  const closeModal = () => setIsOpen(false);

  return (
    <Modal
      show={isOpen}
      onHide={closeModal}
      backdrop={true}
      id="kt_modal_create_app"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-600px"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="fw-bolder">Détails du candidat</h2>

          <div
            className="btn btn-icon btn-sm btn-active-icon-primary"
            style={{ cursor: "pointer" }}
            onClick={closeModal}
          >
            <KTIcon iconName="cross" className="fs-1" />
          </div>
        </div>

        <Modal.Body className="pb-0 px-16 w-100">
          <ApplicantDetailComponent {...job} />
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default DevTalentDayViewModal;
