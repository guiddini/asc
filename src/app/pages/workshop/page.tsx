import { useEffect, useState } from "react";
import { TableComponent } from "../../components";
import { useMutation } from "react-query";
import { getAllWorkshops } from "../../apis/workshop";
import moment from "moment";
import getMediaUrl from "../../helpers/getMediaUrl";
import WorkshopActionColumn from "./components/workshop-action-column";
import CreateWorkshopModal from "./components/create-workshop-modal";
import UpdateWorkshopModal from "./components/update-workshop-modal";
import { Workshop } from "../../types/workshop";

function WorkshopsManagementPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateTargetId, setUpdateTargetId] = useState<string | null>(null);

  const workshopsMutation = useMutation({
    mutationFn: getAllWorkshops,
    mutationKey: ["workshops"],
  });

  useEffect(() => {
    workshopsMutation.mutate();
  }, []);

  const data = workshopsMutation.data?.data || [];

  const openUpdateModal = (id: string) => {
    setUpdateTargetId(id);
    setUpdateModalOpen(true);
  };

  const columns = [
    {
      name: "",
      selector: (row: Workshop) =>
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
    { name: "Title", selector: (row: Workshop) => row.title, sortable: true },
    {
      name: "Location",
      selector: (row: Workshop) => row.location,
      sortable: true,
    },
    {
      name: "Start Date",
      selector: (row: Workshop) => moment(row.start_time).format("DD/MM/YYYY"),
      sortable: true,
    },
    {
      name: "End Date",
      selector: (row: Workshop) => moment(row.end_time).format("DD/MM/YYYY"),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row: Workshop) => row.status,
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row: Workshop) => (
        <WorkshopActionColumn
          showView={true}
          conference={row}
          onEdit={() => openUpdateModal(row.id)}
          onDeleted={() => workshopsMutation.mutate()}
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
        placeholder="workshops"
        onAddClick={() => setCreateModalOpen(true)}
        showSearch
        searchKeys={["title", "location", "status"]}
        showCreate
        isLoading={workshopsMutation.isLoading}
      />

      <CreateWorkshopModal
        show={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      <UpdateWorkshopModal
        show={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        workshopId={updateTargetId ?? ""}
      />
    </>
  );
}

export default WorkshopsManagementPage;
