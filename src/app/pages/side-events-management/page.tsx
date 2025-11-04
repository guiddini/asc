import { useEffect } from "react";
import { TableComponent } from "../../components";
import { useMutation } from "react-query";
import { getAllSideEvents } from "../../apis/side-event";
import moment from "moment";
import getMediaUrl from "../../helpers/getMediaUrl";
import { SideEvent } from "../../types/side-event";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { KTIcon } from "../../../_metronic/helpers";
import { deleteSideEvent } from "../../apis/side-event";

const SideEventsManagement = () => {
  const navigate = useNavigate();

  const sideEventsMutation = useMutation({
    mutationFn: getAllSideEvents,
    mutationKey: ["side-events"],
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSideEvent,
    onSuccess: () => {
      sideEventsMutation.mutate();
    },
  });

  useEffect(() => {
    sideEventsMutation.mutate();
  }, []);

  const data = sideEventsMutation.data || [];

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this side event?")) {
      deleteMutation.mutate(id);
    }
  };

  const columns = [
    {
      name: "",
      selector: (row: SideEvent) =>
        row.logo ? (
          <div className="symbol symbol-circle symbol-40px overflow-hidden me-3 my-2">
            <div className="symbol-label">
              <img
                alt={row.name}
                src={getMediaUrl(row.logo)}
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
    { name: "Name", selector: (row: SideEvent) => row.name, sortable: true },
    {
      name: "Location",
      selector: (row: SideEvent) => row.location || "-",
      sortable: true,
    },
    {
      name: "Date",
      selector: (row: SideEvent) =>
        row.date ? moment(row.date).format("DD/MM/YYYY") : "-",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row: SideEvent) => (
        <span
          className={`badge badge-light-${
            row.status === "published" ? "success" : "warning"
          }`}
        >
          {row.status}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row: SideEvent) => (
        <div className="d-flex gap-2">
          <Button
            variant="light-primary"
            size="sm"
            onClick={() => navigate(`/side-events-management/${row.id}`)}
          >
            <KTIcon iconName="eye" className="fs-3" />
          </Button>
          <Button
            variant="light-warning"
            size="sm"
            onClick={() => navigate(`/side-events-management/update/${row.id}`)}
          >
            <KTIcon iconName="pencil" className="fs-3" />
          </Button>
          <Button
            variant="light-danger"
            size="sm"
            onClick={() => handleDelete(row.id)}
          >
            <KTIcon iconName="trash" className="fs-3" />
          </Button>
        </div>
      ),
      sortable: false,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <TableComponent
      columns={columns as any}
      data={data}
      placeholder="side events"
      onAddClick={() => navigate("/side-events-management/create")}
      showSearch
      searchKeys={["name", "location", "status"]}
      showCreate
      showExport
      isLoading={sideEventsMutation.isLoading}
    />
  );
};

export default SideEventsManagement;
