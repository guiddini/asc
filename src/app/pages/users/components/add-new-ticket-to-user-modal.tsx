import { useMemo } from "react";
import { Form, Modal } from "react-bootstrap";
import { KTIcon } from "../../../../_metronic/helpers";
import TicketForm from "./TicketForm";
import { errorMessage } from "../../../helpers/errorMessage";
import { useForm } from "react-hook-form";
import { useTicket } from "../../../hooks";
import { useMutation, useQuery } from "react-query";
import { addNewTicketsToUser, getAllRolesApi } from "../../../apis";
import { Role } from "../../../types/roles";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { User } from "../../../types/user";
import toast from "react-hot-toast";

const schema = Yup.object().shape({
  tickets: Yup.array().of(
    Yup.object().shape({
      quantity: Yup.number()
        .required("La quantité est requise")
        .min(1, "La quantité doit être d'au moins 1")
        .positive("La quantité doit être positive")
        .typeError("La quantité est requise"),
      ticket_role: Yup.object()
        .required("Le rôle du ticket est requis")
        .typeError("Le rôle du ticket est requis"),
      ticket_type: Yup.object()
        .required("Le type du ticket est requis")
        .typeError("Le type du ticket est requis"),
    })
  ),
});

interface AddNewTicketToUserModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: any) => void;
  user: User;
}

const AddNewTicketToUserModal = ({
  isOpen,
  setIsOpen,
  user,
}: AddNewTicketToUserModalProps) => {
  const closeModal = () => setIsOpen(null);

  const { TICKET_TYPES } = useTicket();

  const TICKETS: {
    label: string;
    value: string;
    roles: string[];
  }[] = useMemo(
    () =>
      TICKET_TYPES?.map((ticket) => {
        return {
          label: ticket?.name || "",
          value: ticket?.slug || "",
          roles: [],
        };
      }) || [],
    [TICKET_TYPES]
  );

  const { data } = useQuery({
    queryKey: ["roles"],
    queryFn: getAllRolesApi,
  });

  const ROLES: {
    label: string;
    value: string;
  }[] = useMemo(
    () =>
      data?.data?.map((r: Role) => {
        return {
          label: r.display_name || "",
          value: r.name || "",
        };
      }) || [],
    [data]
  );

  const {
    control,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      tickets: [
        {
          quantity: 0,
          ticket_role: null,
          ticket_type: null,
        },
      ],
    },
    resolver: yupResolver(schema),
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: async (data: FormData) => await addNewTicketsToUser(data),
    mutationKey: ["add-new-tickets-to-user", user?.id],
  });

  const addTicket = async (data: {
    tickets: {
      quantity: number;
      ticket_type: any;
      ticket_role: any;
    }[];
  }) => {
    const formdata = new FormData();
    data?.tickets?.forEach((ticket, index) => {
      formdata.append(
        `tickets[${index}][ticket_type]`,
        ticket?.ticket_type?.value
      );
      formdata.append(`tickets[${index}][quantity]`, String(ticket?.quantity));
      formdata.append(
        `tickets[${index}][role_slug]`,
        ticket?.ticket_role?.value
      );
    });
    formdata.append("user_id", String(user?.id));
    mutate(formdata, {
      onSuccess(data, variables, context) {
        toast.success("Ticket ajouté avec succès");
        closeModal();
      },
      onError(error, variables, context) {},
    });
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
          <h2 className="fw-bolder">Ajouter tickets :</h2>

          <div
            className="btn btn-icon btn-sm btn-active-icon-primary"
            style={{ cursor: "pointer" }}
            onClick={closeModal}
          >
            <KTIcon iconName="cross" className="fs-1" />
          </div>
        </div>

        <Modal.Body className="py-0">
          <TicketForm
            ROLES={ROLES}
            TICKETS={TICKETS}
            control={control as any}
            setValue={setValue}
            errors={errors}
          />
          {errorMessage(errors, "tickets")}
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
                onClick={handleSubmit(addTicket)}
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

export default AddNewTicketToUserModal;
