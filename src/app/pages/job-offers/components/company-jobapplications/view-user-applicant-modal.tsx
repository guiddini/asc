import React from "react";
import { Col, Modal, Row } from "react-bootstrap";
import { KTIcon } from "../../../../../_metronic/helpers";
import { CompanyJobApplication } from "../../company-job-applications";
import clsx from "clsx";
import getMediaUrl from "../../../../helpers/getMediaUrl";
import ApplicantDetailComponent from "./applicant-detail-component";

interface ViewUserApplicantModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  jobApplication: CompanyJobApplication;
}

const ViewUserApplicantModal = ({
  isOpen,
  setIsOpen,
  jobApplication,
}: ViewUserApplicantModalProps) => {
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
          <h2 className="fw-bolder">Coordonnées du candidat</h2>

          <div
            className="btn btn-icon btn-sm btn-active-icon-primary"
            style={{ cursor: "pointer" }}
            onClick={closeModal}
          >
            <KTIcon iconName="cross" className="fs-1" />
          </div>
        </div>
        <div className="card-body p-12">
          <ApplicantDetailComponent {...jobApplication} />
          <Row className="my-7 px-12">
            <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
              <span className={`fw-bold`}>Notes</span>
            </label>
            <textarea
              defaultValue={
                jobApplication?.notes?.length > 1
                  ? jobApplication?.notes
                  : "Pas encore de notes"
              }
              disabled
              className="form-control ps-2 w-100"
            />
          </Row>
        </div>
      </div>
    </Modal>
  );
};

export default ViewUserApplicantModal;
