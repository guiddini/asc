import React from "react";
import { Modal } from "react-bootstrap";
import { CreateCompanyForm } from "../../../components";
import { KTIcon } from "../../../../_metronic/helpers";

interface CreateCompanyModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const CreateCompanyModal: React.FC<CreateCompanyModalProps> = (props) => {
  return (
    <Modal
      show={props.isOpen}
      onHide={() => props.setIsOpen(false)}
      backdrop={true}
      id="kt_modal_create_app"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-900px"
    >
      <div className="modal-header">
        <h2>Add company details</h2>
        {/* begin::Close */}
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={() => props.setIsOpen(false)}
        >
          <KTIcon className="fs-1" iconName="cross" />
        </div>
        {/* end::Close */}
      </div>

      <div className="modal-body py-lg-10 px-lg-10">
        <div className="flex-row-fluid ">
          <CreateCompanyForm next={() => props.setIsOpen(false)} />
        </div>
      </div>
    </Modal>
  );
};

export default CreateCompanyModal;
