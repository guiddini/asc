import { useMutation } from "react-query";
import { assingNewTicket } from "../../../../apis";
import { Col, Modal, Row } from "react-bootstrap";
import { Ticket } from "../../../../types/user";
import { KTIcon } from "../../../../../_metronic/helpers";
import clsx from "clsx";
import { getIcon } from "../update-gifted-ticket/update-gifted-ticket-modal";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { UserResponse } from "../../../../types/reducers";

export const checkTicketUpgrade = ({
  oldTicket,
  newTicket,
}: {
  oldTicket: string;
  newTicket: string;
}) => {
  const ticketTypes = ["free", "basic", "business", "vip"];
  const oldIndex = ticketTypes.indexOf(oldTicket);
  const newIndex = ticketTypes.indexOf(newTicket);

  if (oldIndex === -1 || newIndex === -1) {
    return "Invalid ticket type";
  }

  if (oldIndex < newIndex) {
    return "Êtes-vous sûr de vouloir surclasser votre ticket ?";
  } else if (oldIndex > newIndex) {
    return "Êtes-vous sûr de vouloir déclasser votre ticket ?";
  } else {
    return "Êtes-vous sûr de vouloir changer votre ticket ?";
  }
};

interface AssignNewTicketProps {
  isOpen: boolean;
  setIsOpen: (isOpen: any) => void;
  refetch: () => void;
  ticket: Ticket;
}

const AssignNewTicketModal = ({
  isOpen,
  refetch,
  setIsOpen,
  ticket,
}: AssignNewTicketProps) => {
  const closeModal = () => setIsOpen(null);
  const { mutate, isLoading } = useMutation({
    mutationFn: async ({ id }: { id: string | number }) =>
      await assingNewTicket(id),
  });

  const { user } = useSelector((state: UserResponse) => state.user);

  const user_ticket: {
    id: string;
    name: string;
    price: string;
    slug: string;
  } = user?.ticket as any;

  const assignNewTicket = async () => {
    mutate(
      {
        id: ticket.id,
      },
      {
        onSuccess() {
          toast.success("Votre ticket a été modifié avec succès");
        },
        onError(error) {
          toast.error("Erreur lors du changement de ticket");
        },
      }
    );
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
          <h2 className="fw-bolder">
            {checkTicketUpgrade({
              newTicket: ticket.type?.slug,
              oldTicket: user_ticket?.slug,
            })}
          </h2>

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
            <h2 className="mb-0 fs-3">Ticket actuel</h2>
            <Col xs={12} md={12} className="mt-3">
              <label className="d-flex align-items-center justify-content-between cursor-pointer mb-6">
                <span className="d-flex align-items-center me-20">
                  {getIcon(user_ticket)}
                  <span className="d-flex flex-column">
                    <span className="fw-bolder fs-6 ">{user_ticket.name}</span>
                    <span className="text-black">
                      Rôle du ticket : {user_ticket?.slug}
                    </span>
                  </span>
                </span>

                <span className="form-check form-check-custom form-check-solid">
                  <input
                    className={clsx("form-check-input")}
                    type="radio"
                    value={user_ticket.name}
                    checked={true}
                    disabled={true}
                  />
                </span>
              </label>
            </Col>
            <div className="w-100 d-flex align-items-center justify-content-center">
              <i className="fa-solid fa-repeat text-custom-purple-light fs-1"></i>
            </div>
            <h2 className="mb-0 fs-3">Nouveau Ticket</h2>
            <Col xs={12} md={12} className="mt-3">
              <label className="d-flex align-items-center justify-content-between cursor-pointer mb-6">
                <span className="d-flex align-items-center me-20">
                  {getIcon({
                    slug: ticket?.type?.slug,
                  })}
                  <span className="d-flex flex-column">
                    <span className="fw-bolder fs-6 ">{ticket.type?.name}</span>
                    <span className="text-black">
                      Rôle du ticket : {ticket?.role_slug}
                    </span>
                  </span>
                </span>

                <span className="form-check form-check-custom form-check-solid">
                  <input
                    className={clsx("form-check-input")}
                    type="radio"
                    value={ticket.type?.name}
                    checked={true}
                    disabled={true}
                  />
                </span>
              </label>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="w-100">
          <div className="w-100 d-flex flex-row align-items-center justify-content-between">
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
                onClick={assignNewTicket}
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

export default AssignNewTicketModal;
