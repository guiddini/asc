import { useState } from "react";
import { useQuery } from "react-query";
import { VisaDemand, VisaDemandStatus } from "../../types/visa-demand";
import { getVisaDemands } from "../../apis/visa-demand";
import { TableComponent } from "../../components/table/TableComponent";
import AcceptVisaDemandModal from "./components/accept-visa-demand-modal";
import RefuseVisaDemandModal from "./components/refuse-visa-demand-modal";
import DeleteVisaDemandModal from "./components/delete-visa-demand-modal";
import moment from "moment";

export default function VisaDemandsManagementPage() {
  const [status, setStatus] = useState<VisaDemandStatus | "all">("all");

  const { data, isLoading } = useQuery({
    queryKey: ["visa-demands", { status }],
    queryFn: () =>
      status === "all" ? getVisaDemands() : getVisaDemands({ status }),
    keepPreviousData: true,
    retry: 1,
  });

  const demands: VisaDemand[] = data?.data ?? [];

  const [currentId, setCurrentId] = useState<string | null>(null);
  const [showView, setShowView] = useState(false);
  const [showAccept, setShowAccept] = useState(false);
  const [showRefuse, setShowRefuse] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const columns = [
    {
      name: "Applicant",
      selector: (row: VisaDemand) => `${row.first_name} ${row.last_name}`,
      sortable: true,
    },
    {
      name: "Company",
      selector: (row: VisaDemand) => row.company_name ?? "-",
      sortable: true,
    },
    {
      name: "Profession",
      selector: (row: VisaDemand) => row.profession ?? "-",
      sortable: true,
    },
    {
      name: "Passport No.",
      selector: (row: VisaDemand) => row.passport_number ?? "-",
      sortable: true,
    },
    {
      name: "Passport Expiry",
      selector: (row: VisaDemand) =>
        row.passport_expiration_date
          ? moment(row.passport_expiration_date).format("DD/MM/YYYY")
          : "-",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row: VisaDemand) => row.status ?? "-",
      sortable: true,
      cell: (row: VisaDemand) => {
        const s = row.status;
        if (s === "pending") {
          return (
            <span className="badge badge-light-warning fw-bolder text-capitalize">
              {s}
            </span>
          );
        } else if (s === "accepted") {
          return (
            <span className="badge badge-light-success fw-bolder text-capitalize">
              {s}
            </span>
          );
        } else if (s === "refused") {
          return (
            <span className="badge badge-light-danger fw-bolder text-capitalize">
              {s}
            </span>
          );
        } else if (s === "cancelled") {
          return (
            <span className="badge badge-light-secondary fw-bolder text-capitalize">
              {s}
            </span>
          );
        }
        return <span className="text-capitalize">{s ?? "-"}</span>;
      },
    },
    {
      name: "Created At",
      selector: (row: VisaDemand) =>
        row.created_at
          ? moment(row.created_at).format("DD/MM/YYYY HH:mm")
          : "-",
      sortable: true,
    },
    {
      name: "Updated At",
      selector: (row: VisaDemand) =>
        row.updated_at
          ? moment(row.updated_at).format("DD/MM/YYYY HH:mm")
          : "-",
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row: VisaDemand) => {
        return (
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-success btn-sm"
              onClick={() => {
                setCurrentId(row.id);
                setShowAccept(true);
              }}
              disabled={row?.status === "accepted"}
            >
              Accept
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => {
                setCurrentId(row.id);
                setShowRefuse(true);
              }}
              disabled={row?.status === "refused"}
            >
              Refuse
            </button>
          </div>
        );
      },
      sortable: false,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "320px",
    },
  ];

  const header = (
    <div className="d-flex align-items-center justify-content-between w-100">
      <h3 className="m-0 fw-bold">Visa Demands</h3>
      <div className="d-flex gap-2">
        <select
          className="form-select form-select-solid"
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as VisaDemandStatus | "all")
          }
          style={{ width: 220 }}
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="refused">Refused</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  );

  return (
    <>
      <TableComponent
        columns={columns as any}
        data={demands}
        placeholder="Visa Demand"
        showCreate={false}
        showExport={false}
        isLoading={isLoading}
        customFullHeader={header}
        pagination={true}
        searchKeys={[
          // removed "id" per request
          "first_name",
          "last_name",
          "company_name",
          "profession",
          "passport_number",
          "passport_expiry_date",
          "status",
          "created_at",
          "updated_at",
        ]}
      />

      <AcceptVisaDemandModal
        show={showAccept}
        demandId={currentId}
        onHide={() => setShowAccept(false)}
      />
      <RefuseVisaDemandModal
        show={showRefuse}
        demandId={currentId}
        onHide={() => setShowRefuse(false)}
      />
      <DeleteVisaDemandModal
        show={showDelete}
        demandId={currentId}
        onHide={() => setShowDelete(false)}
      />
    </>
  );
}
