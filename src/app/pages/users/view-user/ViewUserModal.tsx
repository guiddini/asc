import React from "react";
import { User } from "../../../types/user";
import { Modal, Row, Spinner } from "react-bootstrap";
import { KTIcon } from "../../../../_metronic/helpers";
import { DisableInput } from "../../../components";
import { useForm } from "react-hook-form";
import moment from "moment";

interface ViewModalProps {
  setIsOpen: (guest: User) => void;
  guest: any;
}

export const ViewUserModal: React.FC<ViewModalProps> = ({
  setIsOpen,
  guest,
}) => {
  const closeModal = () => setIsOpen(null);

  const { control } = useForm({
    defaultValues: guest,
  });

  return (
    <Modal
      show={guest !== null ? true : false}
      onHide={closeModal}
      backdrop={true}
      id="kt_modal_create_app"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-900px"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="fw-bolder">View User</h2>

          <div
            className="btn btn-icon btn-sm btn-active-icon-primary"
            onClick={closeModal}
            style={{ cursor: "pointer" }}
          >
            <KTIcon iconName="cross" className="fs-1" />
          </div>
        </div>
        <Modal.Body className="p-12">
          {guest ? (
            <Row xs={12} md={12} className="">
              <DisableInput
                control={control as any}
                label="Code"
                name="code"
                colMD={6}
                colXS={12}
                defaultValue={guest?.code}
              />
              <DisableInput
                control={control as any}
                label="Created at"
                name="createdAt"
                colMD={6}
                colXS={12}
                defaultValue={moment(guest.created_at).format("DD/MM/YYYY")}
              />
              <DisableInput
                control={control as any}
                label="Prénom"
                name="fname"
                colMD={6}
                colXS={12}
                defaultValue={guest?.fname}
              />
              <DisableInput
                control={control as any}
                label="Nom"
                name="lname"
                colMD={6}
                colXS={12}
                defaultValue={guest.lname}
              />
              <DisableInput
                control={control as any}
                label="Ticket"
                name="ticket_name"
                colMD={6}
                colXS={12}
                defaultValue={guest.ticket_name}
              />
              <DisableInput
                control={control as any}
                label="Email"
                name="email"
                colMD={6}
                colXS={12}
                defaultValue={
                  guest.email === null ? "Not Assigned" : guest.email
                }
              />
              <DisableInput
                control={control as any}
                label="Statut"
                name="status"
                colMD={6}
                colXS={12}
                defaultValue={guest.status}
              />
            </Row>
          ) : (
            <Spinner animation="border" />
          )}
        </Modal.Body>
      </div>
    </Modal>
  );
};
