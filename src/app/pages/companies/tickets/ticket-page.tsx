import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { PageLink, PageTitle } from "../../../../_metronic/layout/core";
import { TableComponent } from "../../../components";
import moment from "moment";
import { useTicket } from "../../../hooks";
import AssignTicketModal from "./assign-ticket-modal";
import { getGiftedUsersTickets } from "../../../apis";
import { Row } from "react-bootstrap";
import TicketCard from "./components/ticket-card";
import TicketActions from "./components/ticket-actions";
import UpdateGiftedTicketModal from "./update-gifted-ticket/update-gifted-ticket-modal";
import clsx from "clsx";
import UnassignedTicketAction from "./components/unassigned-ticket-action";
import { useSelector } from "react-redux";
import { UserResponse } from "../../../types/reducers";
import CreateShareLinkModal from "./create-share-link-modal";
import SharedLinksPage from "./shared-links-page";

export interface GiftedUserProps {
  avatar: string | null;
  can_create_company: "0" | "1";
  created_at: string;
  email: string;
  email_verified_at: string | null;
  fname: string;
  has_password: "0" | "1";
  id: string;
  lname: string;
  ticket_count: string;
  updated_at: string;
  user_has_ticket_id: string | null;
  userHasTicketIdFound: {
    created_at: string;
    gifted_to_user_id: string | null;
    id: string;
    is_assigned: "0" | "1";
    is_used: "0" | "1";
    role_slug: string;
    source: string;
    ticket_id: string;
    updated_at: string;
    user_id: string;
  };
}

const servicesBreadcrumbs: Array<PageLink> = [
  {
    title: "Tickets Management",
    path: "/company/tickets",
    isSeparator: false,
    isActive: false,
  },
  {
    title: "",
    path: "",
    isSeparator: true,
    isActive: false,
  },
];

export const TicketPage = () => {
  const columns = [
    {
      name: "Prénom",
      cell: (row) => (row?.fname?.length > 0 ? row?.fname : "Non assignée"),
      sortable: true,
    },
    {
      name: "Nom",
      cell: (row) => (row?.lname?.length > 0 ? row?.lname : "Non assignée"),
      sortable: true,
    },
    {
      name: "Email",
      cell: (row) => row?.email,
      sortable: true,
    },
    {
      name: "Statut",
      cell: (row) => {
        const is_used =
          row?.userHasTicketIdFound?.is_assigned === 1 ? true : false;
        if (is_used) {
          return (
            <span className="badge badge-light-success fw-bolder">
              Acceptée
            </span>
          );
        } else {
          return (
            <span className="badge badge-light-warning fw-bolder">
              En attente
            </span>
          );
        }
      },
      sortable: true,
    },
    {
      name: "Créé à",
      cell: (row) => moment(row.created_at).format("DD/MM/YYYY"),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <TicketActions
          row={row}
          setUpdate={setUpdateGiftedUser}
          refetch={refetch}
        />
      ),
      sortable: true,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const { data, refetch } = useQuery({
    queryKey: ["get-all-gifted-users-ticket"],
    queryFn: async () => await getGiftedUsersTickets(),
  });

  const {
    groupOwnedTickets,
    groupGiftedTickets,
    checkUnassignedTickets,
    groupTicketsByType,
    TICKETS,
    setUnassignedOwnedTickets,
    refetchTicketTypes,
    unassignedTicketCount,
    groupOwnedTicketsByType,
    userTickets,
    data: unassignedTickets,
  } = useTicket();

  useEffect(() => {
    groupOwnedTickets();
    groupGiftedTickets();
    checkUnassignedTickets();
    groupTicketsByType(TICKETS, setUnassignedOwnedTickets, "owned");
  }, [TICKETS?.length]);

  useEffect(() => {
    groupOwnedTicketsByType();
  }, [TICKETS]);

  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const GIFTED_USERS: GiftedUserProps[] = useMemo(
    () => data?.data,
    [data, refetchTicketTypes]
  );
  const [updateGiftedUser, setUpdateGiftedUser] =
    useState<GiftedUserProps | null>(null);

  const [selectedType, setSelectedType] = useState<string>("assigned");
  const [showShareTicketModal, setShowShareTicketModal] = useState(false);

  const { user } = useSelector((state: UserResponse) => state.user);

  const currentTicket: any = user?.ticket?.name as any;

  return (
    <>
      <PageTitle breadcrumbs={servicesBreadcrumbs}>Tickets</PageTitle>

      <Row xs={12} md={12} className="mb-4 row-gap-4">
        {userTickets?.map((ticket, index) =>
          ticket.name === "Free" ? (
            <TicketCard ticket={ticket} key={index} />
          ) : null
        )}
      </Row>

      <div className="mx-auto d-flex flex-row align-items-center justify-content-center">
        <div
          className="nav-group nav-group-outline bg-white my-4 d-flex flex-row align-items-center justify-content-center p-3"
          style={{
            width: "380px",
          }}
          data-kt-buttons="true"
        >
          <button
            className={clsx("btn btn-color-gray-600 px-6 py-2 me-2 active", {
              " btn-active btn-custom-purple-dark text-white":
                selectedType === "assigned",
            })}
            onClick={(e) => {
              e.preventDefault();
              setSelectedType("assigned");
            }}
          >
            Shared Tickets
          </button>
          <button
            className={clsx("btn btn-color-gray-600 px-6 py-2 me-2 active", {
              " btn-active btn-custom-purple-dark text-white":
                selectedType === "shared",
            })}
            onClick={(e) => {
              e.preventDefault();
              setSelectedType("shared");
            }}
          >
            Share Links
          </button>
        </div>
      </div>

      {selectedType === "assigned" ? (
        <TableComponent
          columns={columns}
          data={GIFTED_USERS}
          placeholder=""
          customPlaceholder="Create a Share Link"
          onAddClick={() => {
            if (unassignedTicketCount > 0) {
              setShowShareTicketModal(true);
            }
          }}
          showCreate={userTickets?.length > 0 ? true : false}
          showSearch={false}
          key={selectedType}
        />
      ) : (
        <SharedLinksPage />
      )}
      {showShareTicketModal && (
        <CreateShareLinkModal
          pricingData={unassignedTickets?.data}
          show={showShareTicketModal}
          onHide={() => setShowShareTicketModal(false)}
        />
      )}

      <AssignTicketModal
        isOpen={createModalOpen}
        setIsOpen={setCreateModalOpen}
        refetch={() => {
          refetchTicketTypes();
          refetch();
        }}
        key={createModalOpen.toString()}
      />
      {updateGiftedUser !== null && (
        <UpdateGiftedTicketModal
          isOpen={updateGiftedUser !== null ? true : false}
          setIsOpen={setUpdateGiftedUser}
          refetch={() => {
            refetchTicketTypes();
            refetch();
          }}
          user={updateGiftedUser}
        />
      )}
    </>
  );
};
