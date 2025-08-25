import React, { useEffect } from "react";
import { Guest } from "../../../types/guest";
import { Button, Modal, Row, Spinner } from "react-bootstrap";
import { KTIcon } from "../../../../_metronic/helpers";
import { DisableInput } from "../../../components";
import { useForm } from "react-hook-form";
import moment from "moment";
import { getUserDataApi } from "../../../apis";
import { guestPdfGenerator } from "../../../helpers/guest-pdf-generator";
import { useMutation } from "react-query";

interface ViewModalProps {
  setIsOpen: (guest: Guest) => void;
  guest: Guest;
}

export const ViewGuestModal: React.FC<ViewModalProps> = ({
  setIsOpen,
  guest,
}) => {
  const closeModal = () => setIsOpen(null);

  const { control } = useForm({
    defaultValues: guest,
  });

  const { data, isLoading, mutate } = useMutation({
    mutationFn: () => getUserDataApi(guest?.user_id),
    mutationKey: ["get-guest-data", guest?.user_id],
  });

  const is_delegated = guest?.status === "Delegated";
  const delegated = data?.data?.user;

  useEffect(() => {
    if (is_delegated) {
      mutate();
    }
  }, [is_delegated]);

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
          <h2 className="fw-bolder">View Guest</h2>

          <div
            className="btn btn-icon btn-sm btn-active-icon-primary"
            onClick={closeModal}
            style={{ cursor: "pointer" }}
          >
            <KTIcon iconName="cross" className="fs-1" />
          </div>
        </div>
        <Modal.Body className="p-12">
          {!isLoading ? (
            <Row xs={12} md={12} className="">
              <DisableInput
                control={control as any}
                label="Code"
                name="code"
                colMD={6}
                colXS={12}
                defaultValue={guest?.code}
                className="mb-4"
              />
              <DisableInput
                control={control as any}
                label="Created at"
                name="createdAt"
                colMD={6}
                colXS={12}
                defaultValue={moment(guest?.created_at).format("DD/MM/YYYY")}
                className="mb-4"
              />
              <DisableInput
                control={control as any}
                label={is_delegated ? "Delegated first name" : "Prénom"}
                name="fname"
                colMD={6}
                colXS={12}
                defaultValue={is_delegated ? delegated?.fname : guest?.fname}
                className="mb-4"
              />
              <DisableInput
                control={control as any}
                label={is_delegated ? "Delegated last name" : "Nom"}
                name="lname"
                colMD={6}
                colXS={12}
                defaultValue={is_delegated ? delegated?.lname : guest?.lname}
                className="mb-4"
              />
              <DisableInput
                control={control as any}
                label="Ticket"
                name="ticket_name"
                colMD={6}
                colXS={12}
                defaultValue={guest?.ticket_name}
                className="mb-4"
              />
              <DisableInput
                control={control as any}
                label={is_delegated ? "Delegated email" : "Email"}
                name="email"
                colMD={6}
                colXS={12}
                defaultValue={
                  is_delegated
                    ? delegated?.email
                    : guest?.email === null
                    ? "Not Assigned"
                    : guest?.email
                }
                className="mb-4"
              />
              <DisableInput
                control={control as any}
                label="Statut"
                name="status"
                colMD={6}
                colXS={12}
                defaultValue={guest?.status}
              />
            </Row>
          ) : (
            <div className="w-100 h-300px d-flex align-items-center justify-content-center">
              <Spinner animation="border" />
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            onClick={() => {
              guestPdfGenerator(guest.fname, guest.code);
            }}
          >
            <i className="fa-solid fa-file-pdf"></i>
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};
