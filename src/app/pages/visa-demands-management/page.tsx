import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { VisaDemand, VisaDemandStatus } from "../../types/visa-demand";
import { getVisaDemands } from "../../apis/visa-demand";
import { TableComponent } from "../../components/table/TableComponent";
import AcceptVisaDemandModal from "./components/accept-visa-demand-modal";
import RefuseVisaDemandModal from "./components/refuse-visa-demand-modal";
import DeleteVisaDemandModal from "./components/delete-visa-demand-modal";
import moment from "moment";
import { Modal } from "react-bootstrap";

export default function VisaDemandsManagementPage() {
  const [status, setStatus] = useState<VisaDemandStatus | "all">("all");

  const [page, setPage] = useState(1);
  const perPage = 20;

  const { data, isLoading } = useQuery({
    queryKey: ["visa-demands", { status }, page, perPage],
    queryFn: () =>
      status === "all"
        ? getVisaDemands({ page, per_page: perPage })
        : getVisaDemands({ status, page, per_page: perPage }),
    keepPreviousData: true,
    retry: 1,
  });

  const demands: VisaDemand[] = data?.data ?? [];
  const total = data?.total ?? 0;
  const lastPage = data?.last_page ?? 1;

  useEffect(() => {
    setPage(1);
  }, [status]);

  const [currentId, setCurrentId] = useState<string | null>(null);
  const [showView, setShowView] = useState(false);
  const [showAccept, setShowAccept] = useState(false);
  const [showRefuse, setShowRefuse] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const current = demands.find((d) => d.id === currentId) || null;

  const columns = [
    {
      name: "Applicant",
      selector: (row: VisaDemand) => `${row.first_name} ${row.last_name}`,
      sortable: true,
    },
    {
      name: "Startup",
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
      <div className="card">
        <div className="card-header border-0 pt-6">{header}</div>
        <div className="card-body p-4">
          {isLoading ? (
            <div className="d-flex align-items-center justify-content-center py-4">
              <span className="spinner-border"></span>
            </div>
          ) : (
            <div
              style={{
                minHeight: "65vh",
                overflowY: "auto",
                maxHeight: "65vh",
              }}
            >
              <table className="table align-middle table-row-dashed fs-6 gy-5">
                <thead>
                  <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                    <th className="min-w-150px">Applicant</th>
                    <th className="min-w-150px">Startup</th>
                    <th className="min-w-150px">Profession</th>
                    <th className="min-w-150px">Passport No.</th>
                    <th className="min-w-150px">Authorities Passport</th>
                    <th className="min-w-150px">Passport Issue</th>
                    <th className="min-w-150px">Passport Expiry</th>
                    <th className="min-w-120px">Status</th>
                    <th className="min-w-150px">Created At</th>
                    <th className="min-w-150px">Updated At</th>
                    <th className="text-end min-w-220px">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 fw-semibold">
                  {demands.map((row: VisaDemand) => (
                    <tr key={String(row.id)}>
                      <td>{`${row.first_name} ${row.last_name}`}</td>
                      <td>{row.company_name ?? "-"}</td>
                      <td>{row.profession ?? "-"}</td>
                      <td>{row.passport_number ?? "-"}</td>
                      <td>{row.authorities_password ?? "-"}</td>
                      <td>
                        {row.passport_issue_date
                          ? moment(row.passport_issue_date).format("DD/MM/YYYY")
                          : "-"}
                      </td>
                      <td>
                        {row.passport_expiration_date
                          ? moment(row.passport_expiration_date).format(
                              "DD/MM/YYYY"
                            )
                          : "-"}
                      </td>
                      <td>
                        {row.status === "pending" ? (
                          <span className="badge badge-light-warning fw-bolder text-capitalize">
                            {row.status}
                          </span>
                        ) : row.status === "accepted" ? (
                          <span className="badge badge-light-success fw-bolder text-capitalize">
                            {row.status}
                          </span>
                        ) : row.status === "refused" ? (
                          <span className="badge badge-light-danger fw-bolder text-capitalize">
                            {row.status}
                          </span>
                        ) : row.status === "cancelled" ? (
                          <span className="badge badge-light-secondary fw-bolder text-capitalize">
                            {row.status}
                          </span>
                        ) : (
                          <span className="text-capitalize">
                            {row.status ?? "-"}
                          </span>
                        )}
                      </td>
                      <td>
                        {row.created_at
                          ? moment(row.created_at).format("DD/MM/YYYY HH:mm")
                          : "-"}
                      </td>
                      <td>
                        {row.updated_at
                          ? moment(row.updated_at).format("DD/MM/YYYY HH:mm")
                          : "-"}
                      </td>
                      <td className="text-end">
                        <div className="d-flex gap-2 justify-content-end">
                          <button
                            type="button"
                            className="btn btn-light-info btn-sm"
                            onClick={() => {
                              setCurrentId(row.id);
                              setShowView(true);
                            }}
                          >
                            View
                          </button>
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
                          <button
                            type="button"
                            className="btn btn-light-danger btn-sm"
                            onClick={() => {
                              setCurrentId(row.id);
                              setShowDelete(true);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between mt-4">
        <div className="text-muted">Total: {total}</div>
        <div className="d-flex gap-2 align-items-center">
          <button
            type="button"
            className="btn btn-light"
            disabled={page <= 1 || isLoading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <span className="mx-2">
            Page {page} of {lastPage}
          </span>
          <button
            type="button"
            className="btn btn-light"
            disabled={page >= lastPage || isLoading}
            onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
          >
            Next
          </button>
        </div>
      </div>

      <Modal show={showView} onHide={() => setShowView(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Visa Demand Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {current ? (
            <div className="row g-4">
              <div className="col-md-6">
                <strong>Applicant:</strong> {current.first_name}{" "}
                {current.last_name}
              </div>
              <div className="col-md-6">
                <strong>Startup:</strong> {current.company_name ?? "-"}
              </div>
              <div className="col-md-6">
                <strong>Profession:</strong> {current.profession ?? "-"}
              </div>
              <div className="col-md-6">
                <strong>Passport No.:</strong> {current.passport_number ?? "-"}
              </div>
              <div className="col-md-6">
                <strong>Authorities Password:</strong>{" "}
                {current.authorities_password ?? "-"}
              </div>
              <div className="col-md-6">
                <strong>Issue Date:</strong>{" "}
                {current.passport_issue_date
                  ? moment(current.passport_issue_date).format("DD/MM/YYYY")
                  : "-"}
              </div>
              <div className="col-md-6">
                <strong>Expiry Date:</strong>{" "}
                {current.passport_expiration_date
                  ? moment(current.passport_expiration_date).format(
                      "DD/MM/YYYY"
                    )
                  : "-"}
              </div>
              <div className="col-md-6">
                <strong>Status:</strong> {current.status}
              </div>
              <div className="col-md-6">
                <strong>Created At:</strong>{" "}
                {current.created_at
                  ? moment(current.created_at).format("DD/MM/YYYY HH:mm")
                  : "-"}
              </div>
              <div className="col-md-6">
                <strong>Updated At:</strong>{" "}
                {current.updated_at
                  ? moment(current.updated_at).format("DD/MM/YYYY HH:mm")
                  : "-"}
              </div>
            </div>
          ) : (
            <div className="text-muted">No data</div>
          )}
        </Modal.Body>
      </Modal>

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
