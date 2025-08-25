import { Row, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { assingTicketToSelf } from "../../../../apis";
import { setUserTicket } from "../../../../features/userSlice";
import { useTicket } from "../../../../hooks";
import TicketSelect from "../../../../pages/companies/tickets/components/ticket-select";
import toast from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { errorMessage } from "../../../../helpers/errorMessage";

export type assingTicketProps = {
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

const ticketSchema = Yup.object().shape({
  ticket: Yup.object()
    .required("Vous devez sélectionner un ticket.")
    .typeError("Vous devez sélectionner un ticket"),
});

const UserTicket = ({ next }: { next: any }) => {
  const {
    assignTicket,
    loadingTickets,
    groupedGiftedTickets,
    groupedTickets,
    decreaseTicketQuantity,
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

  const { mutate, isLoading } = useMutation({
    mutationKey: ["assign-ticket"],
    mutationFn: async ({ id }: { id: string }) => {
      return await assingTicketToSelf(id);
    },
  });

  const setTicket = async (data: assingTicketProps) => {
    const ticket_id = (await assignTicket(
      data.ticket.type,
      data.ticket.source,
      data.ticket.role
    )) as string;

    mutate(
      {
        id: ticket_id,
      },
      {
        onSuccess: (res) => {
          dispatch(setUserTicket(ticket_id));
          decreaseTicketQuantity(data.ticket.type, data.ticket.source);
          toast.success("You have successfully assigned a new ticket");
          next();
        },
        onError(error) {
          toast.error("Error while assigning a ticket");
        },
      }
    );
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<assingTicketProps>({
    resolver: yupResolver(ticketSchema) as any,
  });
  const dispatch = useDispatch();

  return (
    <div className="w-100">
      <div className="pb-10 pb-lg-12">
        <h2 className="fw-bold text-dark">Détails des tickets</h2>
        <div className="text-muted fw-semibold fs-6">
          Si vous avez besoin de plus d'informations, veuillez nous contacter{" "}
          <a
            href="https://algeriafintech.com/"
            target="_blank"
            className="link-primary fw-bold"
          >
            Page d'aide
          </a>
          .
        </div>
      </div>{" "}
      {/* className="btn btn-custom-purple-dark text-white" */}
      <Row xs={12} md={12} className="gap-3">
        <div
          className="alert alert-custom-purple-dark text-white p-8"
          role="alert"
        >
          <h3 className="text-white">Important :</h3>
          Vous devez assigner un ticket pour vous-même !
          <br />
          Et si vous avez plus d'un ticket, vous devrez les assigner
          ultérieurement à votre équipe !
        </div>
        {loadingTickets && (
          <div className="h-200px d-flex align-items-center justify-content-center w-100">
            <Spinner animation="border" color="#000" />
          </div>
        )}

        {!loadingTickets && (
          <>
            <TicketSelect
              errors={errors}
              control={control as any}
              ownedTickets={groupedTickets}
              giftedTickets={groupedGiftedTickets}
            />
            {errorMessage(errors, "ticket")}
          </>
        )}
      </Row>
      <div className="d-flex flex-row align-items-center justify-content-end mt-6">
        <button
          type="button"
          id="kt_sign_in_submit"
          className="btn btn-custom-purple-dark text-white"
          disabled={isLoading}
          onClick={handleSubmit(setTicket)}
        >
          {!isLoading && <span className="indicator-label">Assigner</span>}
          {isLoading && (
            <span className="indicator-progress" style={{ display: "block" }}>
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default UserTicket;
