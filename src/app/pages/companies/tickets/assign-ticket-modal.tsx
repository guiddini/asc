import React, { useEffect, useMemo, useState } from "react";
import { Modal, Row, Spinner } from "react-bootstrap";
import { KTIcon } from "../../../../_metronic/helpers";
import { useForm } from "react-hook-form";
import { InputComponent } from "../../../components";
import { useMutation } from "react-query";
import { assingTicketToOtherUser } from "../../../apis";
import TicketSelect from "./components/ticket-select";
import { useTicket } from "../../../hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { assignTicketSchema } from "./validation/assign-ticket-validation";
import { errorMessage } from "../../../helpers/errorMessage";
import toast from "react-hot-toast";
import { errorResponse } from "../../../types/responses";

interface AssignTicketModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  refetch: () => void;
}

type userItem = {
  email: string;
  ticket: {
    name: string;
    ids: number[];
    quantity: number;
    type: string;
    typeId: string;
    source: string;
    role: string;
  };
};

const AssignTicketModal: React.FC<AssignTicketModalProps> = ({
  isOpen,
  refetch: REFRESH_USERS,
  setIsOpen,
}) => {
  const closeModal = () => setIsOpen(false);

  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm({
    defaultValues: {
      email: null,
      ticket: null,
    },
    resolver: yupResolver(assignTicketSchema),
  });

  const {
    assignTicket,
    groupedTickets,
    loadingTickets,
    decreaseTicketQuantity,
    refetch,
    groupOwnedTickets,
    groupGiftedTickets,
    checkUnassignedTickets,
    groupTicketsByType,
    TICKETS,
    setUnassignedOwnedTickets,
  } = useTicket();

  useEffect(() => {
    groupOwnedTickets();
    groupGiftedTickets();
    checkUnassignedTickets();
    groupTicketsByType(TICKETS, setUnassignedOwnedTickets, "owned");
  }, [TICKETS]);

  const { mutate, isLoading, isError, error, isSuccess, data } = useMutation({
    mutationKey: ["assign-ticket-to-user"],
    mutationFn: async ({ id, email }: { id: string | number; email: string }) =>
      await assingTicketToOtherUser(id, email),
  });

  const assignTicketFunction = async (data: userItem) => {
    const userHasTicketID = (await assignTicket(
      data.ticket.type,
      data.ticket.source,
      data.ticket.role
    )) as string;

    mutate(
      {
        email: data.email,
        id: userHasTicketID,
      },
      {
        onSuccess: () => {
          // remove(index);
          console.log("ticket has been assigned successfully");
          REFRESH_USERS();
          refetch();
          toast.success("Le ticket a été attribué avec succès");
          decreaseTicketQuantity(data.ticket.type, data.ticket.source);
        },
        onError(error: errorResponse) {
          toast.error(
            `Erreur lors de l'attribution du ticket à l'utilisateur ${error.response?.data?.error}`
          );
        },
      }
    );
  };

  const Tickets = useMemo(
    () => groupedTickets,
    [groupedTickets, loadingTickets]
  );

  useEffect(() => {
    if (isError) {
      const err = error as errorResponse;
      setError("email", {
        message: err?.response?.data?.error,
      });
    }
  }, [isError]);

  const link = data?.data;

  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    toast.success("Le lien d'invitation a été copié");
    setIsCopied(true);
    // Reset isCopied to false after 3 seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  return (
    <Modal
      show={isOpen}
      onHide={closeModal}
      backdrop={true}
      id="kt_modal_create_app"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-900px"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="fw-bolder">Offrir un ticket</h2>

          <div
            className="btn btn-icon btn-sm btn-active-icon-primary"
            style={{ cursor: "pointer" }}
            onClick={closeModal}
          >
            <KTIcon iconName="cross" className="fs-1" />
          </div>
        </div>
        <Modal.Body className="p-10">
          {isSuccess ? (
            <Row className="my-2">
              <div className="notice d-flex rounded border-light border border-dashed p-6 bg-custom-blue-dark">
                <div className="d-flex flex-column align-items-start flex-stack flex-grow-1 flex-wrap flex-md-nowrap">
                  <h3 className="text-white">
                    L'email contenant le lien d'inscription a été envoyé avec
                    succès.
                    <br />
                    vous pouvez copier le lien d'inscription et l'envoyer
                    manuellement si vous le souhaitez
                  </h3>

                  <div className="d-flex flex-row align-items-center justify-content-start gap-8 w-100 my-4">
                    <span className="link-primary fs-3 w-50 text-truncate">
                      {link}
                    </span>
                    <button
                      type="button"
                      id="kt_sign_in_submit"
                      className="btn btn-sm btn-custom-purple-dark text-white"
                      onClick={handleCopy}
                    >
                      <span className="indicator-label">
                        {isCopied ? "Copié" : "Copie"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </Row>
          ) : (
            <Row className="my-2">
              {loadingTickets ? (
                <div className="h-200px d-flex align-items-center justify-content-center w-100">
                  <Spinner animation="border" color="#000" />
                </div>
              ) : (
                <TicketSelect control={control as any} ownedTickets={Tickets} />
              )}
              {errorMessage(errors, "ticket")}

              <InputComponent
                control={control as any}
                name="email"
                errors={errors}
                label="Addresse Email"
                className="mt-3"
                type="email"
                colMD={12}
                colXS={12}
              />
            </Row>
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
            <div>
              <button
                type="button"
                id="kt_sign_in_submit"
                className="btn btn-custom-purple-dark text-white"
                disabled={isLoading}
                onClick={handleSubmit(assignTicketFunction)}
              >
                {!isLoading && <span className="indicator-label">Offrir</span>}
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

export default AssignTicketModal;
