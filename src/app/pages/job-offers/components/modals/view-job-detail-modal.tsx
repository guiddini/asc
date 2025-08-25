import { Col, Modal, Row } from "react-bootstrap";
import { KTIcon } from "../../../../../_metronic/helpers";
import { JobOffer } from "../../types/job-offer-type";
import clsx from "clsx";
import Collapse from "../collapse";

const DisableInput = ({
  colXS,
  colMD,
  colLG,
  className,
  label,
  value,
}: any) => {
  return (
    <Col
      xs={colXS || "12"}
      md={colMD || "6"}
      lg={colLG || "6"}
      className={clsx("my-2", className)}
    >
      <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
        <span className={`fw-bold`}>{label}</span>
      </label>
      <input
        className="form-control bg-transparent disabled"
        autoComplete="off"
        value={value}
        disabled={true}
      />
    </Col>
  );
};

interface ViewJobDetailModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  job: JobOffer;
}

const ViewJobDetailModal = ({
  isOpen,
  setIsOpen,
  job,
}: ViewJobDetailModalProps) => {
  const closeModal = () => setIsOpen(false);

  return (
    <Modal
      show={isOpen}
      onHide={closeModal}
      backdrop={true}
      id="kt_modal_create_app"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-1200px"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="fw-bolder">Détail de l'offre d'emploi {job.name}</h2>

          <div
            className="btn btn-icon btn-sm btn-active-icon-primary"
            style={{ cursor: "pointer" }}
            onClick={closeModal}
          >
            <KTIcon iconName="cross" className="fs-1" />
          </div>
        </div>
        <Modal.Body className="p-10 mh-90vh scroll-y">
          <Row className="">
            <DisableInput
              label="L'intitulé de poste"
              value={job.name}
              colLG={4}
            />
            <DisableInput
              label="Statut"
              value={job.job_offer_status}
              colLG={4}
            />
            <DisableInput
              label="Type de lieu de travail"
              value={job.workplace_type}
              colLG={4}
            />
            <DisableInput
              label="L'adresse du lieu de travail"
              value={job.workplace_address}
              colLG={4}
            />
            <DisableInput
              label="Type d'emploi"
              value={job.work_type}
              colLG={4}
            />
            <DisableInput
              label="La position de travail"
              value={job.work_position}
              colLG={4}
            />

            <Col md={12}>
              <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
                <span className={`fw-bold`}>Description</span>
              </label>
              <p
                dangerouslySetInnerHTML={{
                  __html: job?.description,
                }}
                className="mh-350px scroll-y border p-4 rounded-3"
              />
            </Col>

            {job?.application_receipts_emails?.length > 0 && (
              <Collapse colLG={4} label="Emails">
                <div className="d-flex flex-column w-100">
                  <div className="d-flex flex-column gap-3">
                    {job?.application_receipts_emails.map((email, index) => (
                      <div
                        className="d-flex align-items-center ps-6 mb-n1"
                        key={index}
                      >
                        <span className="bullet me-3"></span>

                        <div className="text-gray-600 fw-semibold fs-5">
                          {email}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Collapse>
            )}

            {job?.application_terms?.length > 0 && (
              <Collapse colLG={4} label="Les conditions d'application">
                <div className="d-flex flex-column w-100">
                  <div className="d-flex flex-column gap-3">
                    {job?.application_terms.map((email, index) => (
                      <div
                        className="d-flex align-items-center ps-6 mb-n1"
                        key={index}
                      >
                        <span className="bullet me-3"></span>

                        <div className="text-gray-600 fw-semibold fs-5">
                          {email}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Collapse>
            )}

            {job?.work_benefits?.length > 0 && (
              <Collapse colLG={4} label="Les avantages du travail">
                <div className="d-flex flex-column w-100">
                  <div className="d-flex flex-column gap-3">
                    {job?.work_benefits.map((email, index) => (
                      <div
                        className="d-flex align-items-center ps-6 mb-n1"
                        key={index}
                      >
                        <span className="bullet me-3"></span>

                        <div className="text-gray-600 fw-semibold fs-5">
                          {email}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Collapse>
            )}

            {job?.work_requirements?.length > 0 && (
              <Collapse colLG={4} label="L'exigence du travail">
                <div className="d-flex flex-column w-100">
                  <div className="d-flex flex-column gap-3">
                    {job?.work_requirements.map((email, index) => (
                      <div
                        className="d-flex align-items-center ps-6 mb-n1"
                        key={index}
                      >
                        <span className="bullet me-3"></span>

                        <div className="text-gray-600 fw-semibold fs-5">
                          {email}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Collapse>
            )}
            {job?.work_roles?.length > 0 && (
              <Collapse colLG={4} label="Responsabilités">
                <div className="d-flex flex-column w-100">
                  <div className="d-flex flex-column gap-3">
                    {job?.work_roles.map((email, index) => (
                      <div
                        className="d-flex align-items-center ps-6 mb-n1"
                        key={index}
                      >
                        <span className="bullet me-3"></span>

                        <div className="text-gray-600 fw-semibold fs-5">
                          {email}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Collapse>
            )}

            {job?.work_skills?.length > 0 && (
              <Collapse colLG={4} label="Compétences">
                <div className="d-flex flex-column w-100">
                  <div className="d-flex flex-column gap-3">
                    {job?.work_skills.map((email, index) => (
                      <div
                        className="d-flex align-items-center ps-6 mb-n1"
                        key={index}
                      >
                        <span className="bullet me-3"></span>

                        <div className="text-gray-600 fw-semibold fs-5">
                          {email}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Collapse>
            )}
          </Row>
        </Modal.Body>

        <Modal.Footer className="w-100">
          <div className="w-100 d-flex flex-row align-items-center justify-content-start mt-6">
            <button
              type="button"
              id="kt_sign_in_submit"
              className="btn btn-custom-blue-dark text-white"
              onClick={closeModal}
            >
              <span className="indicator-label">Retour</span>
            </button>
          </div>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default ViewJobDetailModal;
