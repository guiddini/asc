import { useEffect, useState } from "react";
import { Ticket, User } from "../../../types/user";
import { Col, Modal, Row, Spinner } from "react-bootstrap";
import { KTIcon } from "../../../../_metronic/helpers";
import { useMutation } from "react-query";
import { assignAdminUserTicket, getAdminUserTickets } from "../../../apis";
import { errorMessage } from "../../../helpers/errorMessage";
import { GroupedTicket, useTicket } from "../../../hooks";
import { useForm } from "react-hook-form";
import TicketSelect from "../../companies/tickets/components/ticket-select";
import { assingTicketProps } from "../../../modules/auth/components/complete-profile/user-ticket";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import clsx from "clsx";
import getMediaUrl from "../../../helpers/getMediaUrl";
import { CustomInput } from "../../job-offers/components/company-jobapplications/applicant-detail-component";
import { InputComponent } from "../../../components";

const schema = Yup.object().shape({
  ticket: Yup.object().required("Vous devez sélectionner un ticket"),
  fname: Yup.string().required("Le prénom est obligatoire"),
  lname: Yup.string().required("Le nom est obligatoire"),
});

interface AssignTicketToUserProps {
  isOpen: boolean;
  setIsOpen: (isOpen: any) => void;
  user: User;
}

interface GiftedTicketProp extends Ticket {
  user: {
    id: string;
    fname: string;
    lname: string;
    email: string;
    avatar: string;
    can_create_company: "0" | "1"; // Assuming this property can only have values "0" or "1"
    email_verified_at: string | null; // Assuming this property can be a string or null
    created_at: string;
    updated_at: string;
    ticket_count: string;
    user_has_ticket_id: string;
    has_password: "0" | "1"; // Assuming this property can only have values "0" or "1"
  };
}

interface assignTicketToUserProps extends assingTicketProps {
  fname: string;
  lname: string;
}

const AssignTicketToUser = ({
  isOpen,
  setIsOpen,
  user,
}: AssignTicketToUserProps) => {
  const closeModal = () => setIsOpen(null);

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fname: user?.fname,
      lname: user?.lname,
    },
  });

  const [ownedTickets, setOwnedTickets] = useState<GroupedTicket[] | null>(
    null
  );
  const [giftedTickets, setGiftedTickets] = useState<GroupedTicket[] | null>(
    null
  );

  const assignTicket = (
    selectedType: string,
    source: string,
    selectedRole: string
  ) => {
    try {
      if (source === "owned") {
        return new Promise((resolve) => {
          setOwnedTickets((prevGroupedTickets) => {
            const updatedGroupedTickets = prevGroupedTickets?.map(
              (group: GroupedTicket) => {
                const selectedGroup = prevGroupedTickets?.find(
                  (group: GroupedTicket) =>
                    group?.type === selectedType &&
                    group?.source === source &&
                    group?.role === selectedRole
                );
                if (selectedGroup) {
                  const userHasTicketID = selectedGroup?.ids?.shift();
                  if (userHasTicketID !== undefined) {
                    resolve(userHasTicketID);
                  }
                }
                return group;
              }
            );
            return updatedGroupedTickets;
          });
        }).catch((err) => {});
      } else {
        return new Promise((resolve) => {
          setGiftedTickets((prevGroupedTickets) => {
            const updatedGroupedTickets = prevGroupedTickets?.map(
              (group: GroupedTicket) => {
                const selectedGroup = prevGroupedTickets?.find(
                  (group: GroupedTicket) =>
                    group?.type === selectedType &&
                    group?.source === source &&
                    group?.role === selectedRole
                );
                if (selectedGroup) {
                  const userHasTicketID = selectedGroup.ids.shift();
                  if (userHasTicketID !== undefined) {
                    resolve(userHasTicketID);
                  }
                }
                return group;
              }
            );
            return updatedGroupedTickets;
          });
        }).catch((err) => {});
      }
    } catch (error) {}
  };

  const { groupTickets } = useTicket();

  const {
    data: tickets,
    isLoading: gettingTickets,
    mutate: getTickets,
  } = useMutation({
    mutationFn: async () => await getAdminUserTickets(user?.id),
    mutationKey: ["get-admin-unassigned-tickets", user?.id],
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: async ({
      id,
      ticket_id,
      fname,
      lname,
    }: {
      id: string | number;
      ticket_id: string | number;
      fname: string;
      lname: string;
    }) =>
      await assignAdminUserTicket({
        id,
        ticket_id,
        fname,
        lname,
      }),
  });

  const ticketsResponse: {
    giftedTickets: GiftedTicketProp | null;
    ownedTickets: Ticket[] | null;
  } = tickets?.data;

  useEffect(() => {
    getTickets();
  }, [user?.id]);

  useEffect(() => {
    if (ticketsResponse) {
      if (ticketsResponse?.giftedTickets) {
        // group gifted tickets
        const req = {
          ...ticketsResponse?.giftedTickets,
          role: ticketsResponse?.giftedTickets?.role_slug,
        };
        groupTickets([req], setGiftedTickets, "gifted");
      }
      if (ticketsResponse?.ownedTickets) {
        // group owned tickets
        groupTickets(
          ticketsResponse?.ownedTickets?.map((ticket) => ({
            ...ticket,
            role: ticket.role_slug,
          })),
          setOwnedTickets,
          "owned"
        );
      }
    }
  }, [user?.id, tickets]);

  const submit = async (data: assignTicketToUserProps) => {
    const ticket_id = (await assignTicket(
      data.ticket.type,
      data.ticket.source,
      data.ticket.role
    )) as string;
    mutate(
      {
        id: user?.id,
        ticket_id: ticket_id,
        fname: data.fname,
        lname: data.lname,
      },
      {
        onSuccess(data, variables, context) {
          toast.success(
            `Ticket has been assigned to ${user?.fname} ${user?.lname} successfully`
          );
          closeModal();
        },
        onError(error, variables, context) {
          toast.error(`Error while assigning ticket to ${user?.fname}`);
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
          <h2 className="fw-bolder">Assigner un ticket</h2>

          <div
            className="btn btn-icon btn-sm btn-active-icon-primary"
            style={{ cursor: "pointer" }}
            onClick={closeModal}
          >
            <KTIcon iconName="cross" className="fs-1" />
          </div>
        </div>

        <Modal.Body>
          {gettingTickets ? (
            <div
              style={{
                height: "30vh",
              }}
              className="w-100 d-flex justify-content-center align-items-center bg-white gap-3"
            >
              <Spinner animation="border" color="#000" />
              Chargement...
            </div>
          ) : (
            <Row>
              {ticketsResponse?.giftedTickets !== null && (
                <>
                  <h2>Offert par</h2>
                  <Row className="mb-4 d-flex flex-column flex-md-row align-items-center justify-content-center">
                    <Col
                      xs={3}
                      md={3}
                      className="d-flex flex-row align-items-start align-items-lg-center justify-content-start"
                    >
                      <div
                        className={clsx(
                          "symbol w-100px h-100px symbol-fixed position-relative"
                        )}
                      >
                        <img
                          src={getMediaUrl(
                            ticketsResponse?.giftedTickets?.user?.avatar
                          )}
                          alt={`Photo de profile de ${user?.fname}`}
                          className="object-fit-cover w-100 h-100"
                        />
                      </div>
                    </Col>
                    <Col
                      xs={9}
                      md={9}
                      className="d-flex flex-column align-items-start justify-content-start gap-1"
                    >
                      <CustomInput
                        label="Nom"
                        value={`${ticketsResponse?.giftedTickets?.user?.fname} ${ticketsResponse?.giftedTickets?.user?.lname}`}
                      />
                      <CustomInput
                        label="Email"
                        value={ticketsResponse?.giftedTickets?.user?.email}
                      />
                    </Col>
                    <Col
                      xs={9}
                      md={9}
                      className="d-flex flex-row align-items-start align-items-lg-center justify-content-start px-0 mt-2"
                    ></Col>
                  </Row>
                </>
              )}
              <Row className="mb-4">
                <InputComponent
                  control={control as any}
                  errors={errors}
                  name="fname"
                  type="text"
                  className=""
                  label="Prénom"
                />
                <InputComponent
                  control={control as any}
                  errors={errors}
                  name="lname"
                  type="text"
                  className=""
                  label="Nom"
                />
              </Row>
              <TicketSelect
                errors={errors}
                control={control as any}
                ownedTickets={ownedTickets}
                giftedTickets={giftedTickets}
              />
              {errorMessage(errors, "ticket")}
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
                onClick={handleSubmit(submit)}
              >
                {!isLoading && (
                  <span className="indicator-label">Assigner</span>
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

export default AssignTicketToUser;
