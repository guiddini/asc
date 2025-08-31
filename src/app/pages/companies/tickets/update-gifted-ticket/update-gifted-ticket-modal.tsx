import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Col, Modal, Row, Spinner } from "react-bootstrap";
import { useTicket } from "../../../../hooks";
import { updateGiftedUserTicket } from "../../../../apis";
import { useMutation } from "react-query";
import { errorResponse } from "../../../../types/responses";
import { KTIcon, toAbsoluteUrl } from "../../../../../_metronic/helpers";
import { errorMessage } from "../../../../helpers/errorMessage";
import { InputComponent } from "../../../../components";
import { GiftedUserProps } from "../ticket-page";
import clsx from "clsx";
import TicketItem from "../../../../modules/auth/components/complete-profile/ticket";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface UpdateGiftedUserForm {
  old_email: string;
  email: string;
  showUpdateEmail: boolean;
  showUpdateTicket: boolean;
  ticket?: {
    name: string;
    ids: number[];
    quantity: number;
    type: string;
    typeId: string;
    source: string;
    role: string;
  };
}

export const getIcon = (ticket: any) => {
  switch (ticket?.slug) {
    case "free":
      return (
        <span className="w-50px me-3">
          <span className="symbol-label" id="ticket-icon-container">
            <img
              src={toAbsoluteUrl("/media/svg/afes/tickets/free.svg")}
              className="w-100 h-100"
            />
          </span>
        </span>
      );
    case "vip":
      return (
        <span className="w-50px me-3">
          <span className="symbol-label" id="ticket-icon-container">
            <img
              src={toAbsoluteUrl("/media/svg/afes/tickets/premium.svg")}
              className="w-100 h-100"
            />
          </span>
        </span>
      );

    case "business":
      return (
        <span className="w-50px me-3">
          <span className="symbol-label" id="ticket-icon-container">
            <img
              src={toAbsoluteUrl("/media/svg/afes/tickets/business.svg")}
              className="w-100 h-100"
            />
          </span>
        </span>
      );

    case "basic":
      return (
        <span className="w-50px me-3">
          <span className="symbol-label" id="ticket-icon-container">
            <img
              src={toAbsoluteUrl("/media/svg/afes/tickets/basic.svg")}
              className="w-100 h-100"
            />
          </span>
        </span>
      );

    default:
      break;
  }
};

const updateGiftedUserSchema = Yup.object({
  ticket: Yup.object().when("showUpdateTicket", {
    is: (e) => e === true,
    then: (schema) =>
      schema.required("Le ticket est requis").typeError("Le ticket est requis"),
    otherwise: (schema) => schema.notRequired(),
  }),
  email: Yup.string().when("showUpdateEmail", {
    is: (e) => e === true,
    then: (schema) =>
      schema
        .email()
        .required("L'email est requis")
        .typeError("Adresse email invalide"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

interface updateGiftedUserProps {
  isOpen: boolean;
  setIsOpen: (isOpen: any) => void;
  refetch: () => void;
  user: GiftedUserProps;
}

const UpdateGiftedTicketModal = ({
  isOpen,
  refetch,
  setIsOpen,
  user,
}: updateGiftedUserProps) => {
  const closeModal = () => setIsOpen(null);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    register,
    watch,
    setValue,
  } = useForm<UpdateGiftedUserForm>({
    defaultValues: {
      old_email: user?.email,
      email: "",
      showUpdateEmail: true,
      showUpdateTicket: false,
    },
    resolver: yupResolver(updateGiftedUserSchema) as any,
  });

  const showUpdateEmail = watch("showUpdateEmail");
  const showUpdateTicket = watch("showUpdateTicket");

  const {
    assignTicket,
    groupedTickets,
    loadingTickets,
    decreaseTicketQuantity,
    groupOwnedTickets,
    groupGiftedTickets,
    checkUnassignedTickets,
    groupTicketsByType,
    TICKETS,
    setUnassignedOwnedTickets,
    TICKET_TYPES,
  } = useTicket();

  useEffect(() => {
    groupOwnedTickets();
    groupGiftedTickets();
    checkUnassignedTickets();
    groupTicketsByType(TICKETS, setUnassignedOwnedTickets, "owned");
  }, [TICKETS]);

  const { mutate, isLoading, isError, error } = useMutation({
    mutationKey: ["update-gifted-user-ticket"],
    mutationFn: async (formdata: FormData) =>
      await updateGiftedUserTicket(formdata),
  });

  const ticket: {
    id: string;
    name: string;
    price: string;
    slug: string;
  } = TICKET_TYPES?.find(
    (ticket) => ticket.id === user?.userHasTicketIdFound?.ticket_id
  );

  const updateGiftedUserTicketFunction: SubmitHandler<
    UpdateGiftedUserForm
  > = async (data) => {
    const isTheSameTicket =
      ticket?.slug === data?.ticket?.type &&
      user?.userHasTicketIdFound?.role_slug === data?.ticket?.role;

    if (isTheSameTicket) {
      toast.error(
        "Veuillez sélectionner un type et un rôle de ticket différents"
      );
    } else {
      const formdata = new FormData();
      if (data?.email?.length > 3 && data?.email !== user?.email) {
        formdata.append("email", data.email);
      }
      formdata.append("old_email", user?.email);

      if (data.showUpdateTicket && data.ticket) {
        const userHasNewTicketID = (await assignTicket(
          data.ticket.type,
          data.ticket.source,
          data.ticket.role
        )) as string;
        formdata.append("user_has_new_ticket_id", userHasNewTicketID);
      }

      mutate(formdata, {
        onSuccess: () => {
          refetch();
          toast.success("Le ticket a été attribué avec succès");
          if (data.showUpdateTicket && data.ticket) {
            decreaseTicketQuantity(data.ticket.type, data.ticket.source);
          }
          reset(user);
          closeModal();
        },
        onError(error: errorResponse) {
          toast.error(
            `Erreur lors de l'attribution du ticket à l'utilisateur ${error.response?.data?.error}`
          );
        },
      });
    }
  };

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
          <h2 className="fw-bolder">Que souhaitez-vous modifier ?</h2>

          <div
            className="btn btn-icon btn-sm btn-active-icon-primary"
            style={{ cursor: "pointer" }}
            onClick={closeModal}
          >
            <KTIcon iconName="cross" className="fs-1" />
          </div>
        </div>
        <Modal.Body className="p-12 py-6 pb-0">
          <Row className="gap-2">
            <div className="w-full d-flex flex-row align-items-center flex-wrap justify-content-center pb-4">
              <div className="d-flex flex-row align-items-center flex-wrap w-auto gap-3 flex-wrap">
                {/* Email */}
                <label className="form-check form-check-custom form-check-solid align-items-start">
                  <input
                    className="form-check-input me-3"
                    type="checkbox"
                    onChange={() =>
                      setValue("showUpdateTicket", !showUpdateTicket)
                    }
                    defaultChecked={showUpdateTicket}
                    checked={showUpdateTicket}
                  />
                  <span className="fw-bold fs-5 mb-0">Le ticket</span>
                </label>

                {/* Ticket */}
                <label className="form-check form-check-custom form-check-solid align-items-start">
                  <input
                    className="form-check-input me-3"
                    type="checkbox"
                    onChange={() =>
                      setValue("showUpdateEmail", !showUpdateEmail)
                    }
                    defaultChecked={showUpdateEmail}
                    checked={showUpdateEmail}
                  />
                  <span className="fw-bold fs-5 mb-0">L'email</span>
                </label>
              </div>
            </div>
            {showUpdateTicket && (
              <>
                <h2 className="mb-0 fs-3">Ticket actuel</h2>
                <Col xs={12} md={12} className="mt-3">
                  <label className="d-flex align-items-center justify-content-between cursor-pointer mb-6">
                    <span className="d-flex align-items-center me-20">
                      {getIcon(ticket)}
                      <span className="d-flex flex-column">
                        <span className="fw-bolder fs-6 ">{ticket.name}</span>
                        <span className="text-black">
                          Rôle du ticket :{" "}
                          {user?.userHasTicketIdFound?.role_slug}
                        </span>
                      </span>
                    </span>

                    <span className="form-check form-check-custom form-check-solid">
                      <input
                        className={clsx("form-check-input")}
                        type="radio"
                        value={ticket.name}
                        checked={true}
                        disabled={true}
                      />
                    </span>
                  </label>
                </Col>

                <div className="separator my-2" />
                {loadingTickets ? (
                  <div className="h-200px d-flex align-items-center justify-content-center w-100">
                    <Spinner animation="border" color="#000" />
                  </div>
                ) : (
                  <>
                    <div className="mb-3">
                      <h2 className="mb-0 fs-3">
                        Sélectionnez un nouveau ticket
                      </h2>
                      <span className="text-danger mt-0 fs-8">
                        uniquement si vous souhaitez mettre à jour le ticket
                      </span>
                    </div>
                    {groupedTickets?.map((ticket, index) => (
                      <TicketItem
                        key={index}
                        ticket={ticket}
                        control={control as any}
                        errors={errors}
                      />
                    ))}
                  </>
                )}
                {errorMessage(errors, "ticket")}
              </>
            )}

            {showUpdateEmail && (
              <>
                <div className="separator my-1" />
                <Row className="my-3 mb-4">
                  <InputComponent
                    control={control as any}
                    name="old_email"
                    errors={errors}
                    label="Ancienne adresse e-mail"
                    type="email"
                    colMD={6}
                    colXS={12}
                    defaultValue={user?.email}
                    disabled
                  />

                  <Col xs={12} md={6}>
                    <label className="fw-bold w-100 d-flex flex-row align-items-center mb-2">
                      <span>Nouvelle adresse e-mail</span>
                    </label>
                    <input
                      placeholder="Nouvelle adresse e-mail"
                      {...register("email")}
                      autoComplete="off"
                      className={clsx("form-control bg-transparent")}
                    />

                    {errorMessage(errors, "email")}
                  </Col>
                </Row>
              </>
            )}
          </Row>
        </Modal.Body>

        <Modal.Footer className="w-100">
          <div className="w-100 d-flex flex-row align-items-center justify-content-end">
            <div>
              <button
                type="button"
                id="kt_sign_in_submit"
                className="btn btn-custom-purple-dark text-white"
                disabled={isLoading}
                onClick={handleSubmit(updateGiftedUserTicketFunction)}
              >
                {!isLoading && (
                  <span className="indicator-label">Soumettre</span>
                )}
                {isLoading && (
                  <span
                    className="indicator-progress"
                    style={{ display: "block" }}
                  >
                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                  </span>
                )}
              </button>
            </div>
          </div>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default UpdateGiftedTicketModal;
