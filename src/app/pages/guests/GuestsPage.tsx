import { PageLink, PageTitle } from "../../../_metronic/layout/core";
import { TableComponent } from "../../components";
import { CreateGuestModal } from "./create-guest/CreateGuestModal";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { getAllGuests } from "../../apis";
import moment from "moment";
import { ActionCollumn } from "../../components/table/ActionCollumn";
import { Guest } from "../../types/guest";
import UpdateGuestModal from "./update-guest/UpdateGuestModal";
import { ViewGuestModal } from "./view-guest/ViewGuestModal";
import toast from "react-hot-toast";
import { Can } from "../../utils/ability-context";

const guestsBreadcrumbs: Array<PageLink> = [
  {
    title: "Guest Management",
    path: "/guests",
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

const GuestsPage = () => {
  const columns = [
    {
      name: "Prénom",
      selector: (row) => row.fname,
      sortable: true,
    },
    {
      name: "Nom",
      selector: (row) => row.lname,
      sortable: true,
    },
    {
      name: "Code",
      selector: (row) => row.code,
      sortable: true,
    },
    {
      name: "Ticket",
      selector: (row) => row?.ticket_name,
      sortable: true,
    },
    {
      name: "Statut",
      selector: (row) => (
        <span className="badge badge-light-success fw-bolder">
          {row.status}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Créé à",
      selector: (row) => moment(row.created_at).format("DD/MM/YYYY"),
      sortable: true,
    },
    {
      name: "",
      selector: (row) => (
        <ActionCollumn
          openEditModal={() => {
            if (row.status !== "Pending") {
              toast.error(
                "The guest has already accepted the invitation , you can't update"
              );
            } else {
              setUpdateGuest(row);
            }
          }}
          openViewModal={() => {
            setGuest(row);
          }}
          disableUpdate={row.status === "Pending" ? false : true}
        />
      ),
      sortable: true,
    },
  ];

  const { data, refetch } = useQuery({
    queryKey: ["get-all-guests"],
    queryFn: async () => await getAllGuests(),
  });

  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [updateGuest, setUpdateGuest] = useState<Guest | null>(null);
  const [guest, setGuest] = useState<Guest | null>(null);
  const GUESTS_DATA = useMemo(
    () => data?.data,
    [data, updateGuest, createModalOpen]
  );

  return (
    <Can I="list" a="guests">
      <PageTitle breadcrumbs={guestsBreadcrumbs}>Guests list</PageTitle>
      <TableComponent
        columns={columns}
        data={GUESTS_DATA}
        placeholder="guest"
        onAddClick={() => {
          setCreateModalOpen(true);
        }}
      />

      <Can I="create" a="guests">
        <CreateGuestModal
          isOpen={createModalOpen}
          setIsOpen={setCreateModalOpen}
          refetch={refetch}
        />
      </Can>

      <Can I="update" a="guests">
        <UpdateGuestModal
          guest={updateGuest}
          setIsOpen={setUpdateGuest}
          refetch={refetch}
        />
      </Can>
      <Can I="view" a="guests">
        <ViewGuestModal guest={guest} setIsOpen={setGuest} />
      </Can>
    </Can>
  );
};

export { GuestsPage };
