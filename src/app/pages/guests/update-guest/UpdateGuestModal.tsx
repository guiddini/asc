import React from "react";
import { Row, Spinner } from "react-bootstrap";
import { InputComponent } from "../../../components";
import { UpdateGuest } from "../../../apis";
import { useEffect } from "react";
import { KTIcon } from "../../../../_metronic/helpers";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Modal } from "react-bootstrap";
import { Guest } from "../../../types/guest";
import { TicketTypesSelect } from "../../../components/common/ticket-types-select";

const UpdateGuestSchema = Yup.object().shape({
  fname: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Prénom is required"),
  lname: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Nom is required"),
  ticket_name: Yup.object()
    .required("Ticket is required")
    .typeError("Ticket is required"),
});

type GuestProps = {
  fname: string;
  lname: string;
  code: string;
  ticket_name: {
    label: string;
    value: string;
  };
};

type UpdateGuestProps = {
  fname: string;
  lname: string;
  code: string;
  ticket_name: string;
};

interface CreateGuestModalProps {
  setIsOpen: (guest: Guest) => void;
  guest: Guest;
  refetch: () => void;
}

const UpdateGuestModal: React.FC<CreateGuestModalProps> = ({
  setIsOpen,
  guest,
  refetch,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<any>({
    resolver: yupResolver(UpdateGuestSchema),
    defaultValues: {
      fname: guest?.fname,
      lname: guest?.lname,
      code: guest?.code,
      ticket_name: {
        label: guest?.ticket_name,
        value: guest?.ticket_name,
      },
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationKey: ["update-guest"],
    mutationFn: async (data: UpdateGuestProps) => await UpdateGuest(data),
  });

  const closeModal = () => setIsOpen(null);

  const UpdateGuestFN = async (data: GuestProps) => {
    const req = {
      fname: data?.fname,
      lname: data?.lname,
      code: guest?.code,
      ticket_name: data?.ticket_name?.value,
    };

    mutate(req, {
      onSuccess(data) {
        refetch();
        closeModal();
      },
      onError(error, variables, context) {},
    });
  };

  useEffect(() => {
    if (reset) {
      reset(guest);
    }

    setValue("ticket_name", {
      label: guest?.ticket_name,
      value: guest?.ticket_name,
    });
  }, [reset, guest]);

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
          <h2 className="fw-bolder">Update Guest</h2>

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
            <Row xs={12} md={12}>
              <InputComponent
                control={control}
                label="Prénom"
                errors={errors}
                name="fname"
                type="text"
                colMD={12}
                colXS={12}
                defaultValue={guest?.fname}
              />
              <InputComponent
                control={control}
                label="Nom"
                errors={errors}
                name="lname"
                type="text"
                colMD={12}
                colXS={12}
                defaultValue={guest.lname}
              />
              <TicketTypesSelect
                control={control}
                errors={errors}
                colMD={12}
                colXS={12}
                defaultValue={{
                  label: guest.ticket_name,
                  value: guest.ticket_name,
                }}
              />
            </Row>
          ) : (
            <Spinner animation="border" />
          )}
        </Modal.Body>

        <Modal.Footer className="w-100">
          <div className="w-100 d-flex flex-row align-items-center justify-content-between mt-6">
            <button
              type="button"
              id="kt_sign_in_submit"
              className="btn btn-primary"
              onClick={closeModal}
            >
              <span className="indicator-label">Retour</span>
            </button>
            <button
              type="button"
              id="kt_sign_in_submit"
              className="btn btn-success"
              disabled={isLoading}
              onClick={handleSubmit(UpdateGuestFN)}
            >
              {!isLoading && <span className="indicator-label">Update</span>}
              {isLoading && (
                <span
                  className="indicator-progress"
                  style={{ display: "block" }}
                >
                  Please wait...
                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              )}
            </button>
          </div>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default UpdateGuestModal;
