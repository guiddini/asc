import React, { useEffect, useState } from "react";
import { TableComponent } from "../../components";
import { useMutation } from "react-query";
import { getAllConference } from "../../apis/conference";
import moment from "moment";
import getMediaUrl from "../../helpers/getMediaUrl";
import ConferenceActionColumn from "./components/conference-action-column";
import CreateConferenceModal from "./components/create-conference-modal";
import UpdateConferenceModal from "./components/update-conference-modal";
import { Conference } from "../../types/conference";

const ConferencesManagementPage = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateTargetId, setUpdateTargetId] = useState<string | null>(null);

  const conferencesMutation = useMutation({
    mutationFn: getAllConference,
    mutationKey: ["conferences"],
  });

  useEffect(() => {
    conferencesMutation.mutate();
  }, []);

  const data = conferencesMutation.data?.data || [];

  const openUpdateModal = (id: string) => {
    setUpdateTargetId(id);
    setUpdateModalOpen(true);
  };

  const columns = [
    {
      name: "",
      selector: (row: Conference) =>
        row.speakers?.[0]?.avatar ? (
          <div className="symbol symbol-circle symbol-40px overflow-hidden me-3 my-2">
            <div className="symbol-label">
              <img
                alt={`${row.speakers[0].fname} ${row.speakers[0].lname}`}
                src={getMediaUrl(row.speakers[0].avatar)}
                className="w-100"
              />
            </div>
          </div>
        ) : (
          "-"
        ),
      sortable: false,
      width: "60px",
    },
    { name: "Titre", selector: (row: Conference) => row.title, sortable: true },
    {
      name: "Lieu",
      selector: (row: Conference) => row.location,
      sortable: true,
    },
    {
      name: "Date de début",
      selector: (row: Conference) =>
        moment(row.start_time).format("DD/MM/YYYY"),
      sortable: true,
    },
    {
      name: "Date de fin",
      selector: (row: Conference) => moment(row.end_time).format("DD/MM/YYYY"),
      sortable: true,
    },
    {
      name: "Statut",
      selector: (row: Conference) => row.status,
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row: Conference) => (
        <ConferenceActionColumn
          conference={row}
          onEdit={() => openUpdateModal(row.id)}
          onDeleted={() => conferencesMutation.mutate()}
        />
      ),
      sortable: false,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <>
      <TableComponent
        columns={columns as any}
        data={data}
        placeholder="conférences"
        onAddClick={() => setCreateModalOpen(true)}
        showSearch
        canA={null}
        canI={null}
        searchKeys={["title", "location", "status"]}
        showCreate
        isLoading={conferencesMutation.isLoading}
      />

      <CreateConferenceModal
        show={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      <UpdateConferenceModal
        show={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        conferenceId={updateTargetId ?? ""}
      />
    </>
  );
};

export default ConferencesManagementPage;
