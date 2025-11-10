import { useState } from "react";
import { useQuery } from "react-query";
import { ProgramEvent } from "../../types/program-event";
import { getAllProgramEvents } from "../../apis/program-event";
import { TableComponent } from "../../components/table/TableComponent";
import CreateProgramEventModal from "./components/create-program-event-modal";
import DeleteProgramEventModal from "./components/delete-program-event-modal";
import EditProgramEventModal from "./components/edit-program-event-modal";
import moment from "moment";

export default function ProgramEventManagementPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["program-events"],
    queryFn: () => getAllProgramEvents(),
    keepPreviousData: true,
    retry: 1,
  });

  const events: ProgramEvent[] = data ?? [];

  const [currentId, setCurrentId] = useState<string | null>(null);
  const [currentEvent, setCurrentEvent] = useState<ProgramEvent | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const columns = [
    {
      name: "Title",
      selector: (row: ProgramEvent) => row.title,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row: ProgramEvent) => row.status ?? "-",
      sortable: true,
    },
    {
      name: "Start Time",
      selector: (row: ProgramEvent) =>
        row.start_time
          ? moment(row.start_time).format("DD/MM/YYYY HH:mm")
          : "-",
      sortable: true,
    },
    {
      name: "End Time",
      selector: (row: ProgramEvent) =>
        row.end_time ? moment(row.end_time).format("DD/MM/YYYY HH:mm") : "-",
      sortable: true,
    },
    {
      name: "Location",
      selector: (row: ProgramEvent) => row.location ?? "-",
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row: ProgramEvent) =>
        row.created_at
          ? moment(row.created_at).format("DD/MM/YYYY HH:mm")
          : "-",
      sortable: true,
    },
    {
      name: "Updated At",
      selector: (row: ProgramEvent) =>
        row.updated_at
          ? moment(row.updated_at).format("DD/MM/YYYY HH:mm")
          : "-",
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row: ProgramEvent) => {
        return (
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                setCurrentId(row.id);
                setCurrentEvent(row);
                setShowEdit(true);
              }}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => {
                setCurrentId(row.id);
                setShowDelete(true);
              }}
            >
              Delete
            </button>
          </div>
        );
      },
      sortable: false,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "150px",
    },
  ];

  return (
    <>
      <TableComponent
        columns={columns as any}
        data={events}
        placeholder="Program Event"
        showCreate={true}
        onAddClick={() => setShowCreate(true)}
        showExport={false}
        isLoading={isLoading}
        pagination={true}
        searchKeys={[
          "title",
          "description",
          "location",
          "start_time",
          "end_time",
          "created_at",
          "updated_at",
        ]}
      />
      <CreateProgramEventModal
        show={showCreate}
        onHide={() => setShowCreate(false)}
        onSuccess={() => refetch()}
      />
      <EditProgramEventModal
        show={showEdit}
        event={currentEvent}
        onHide={() => setShowEdit(false)}
        onSuccess={() => refetch()}
      />
      <DeleteProgramEventModal
        show={showDelete}
        eventId={currentId}
        onHide={() => setShowDelete(false)}
        onSuccess={() => refetch()}
      />
    </>
  );
}
