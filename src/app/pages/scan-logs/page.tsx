import React, { useMemo, useRef, useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useTable, Column } from "react-table";
import { getAllQrLogsApi } from "../../apis/qr-code";
import { getAllUsersApi } from "../../apis";
import { KTCardBody, KTIcon } from "../../../_metronic/helpers";
import {
  AllLogsResponse,
  AllLogsItem,
  AllLogsParams,
} from "../../types/qr-code";
import { useNavigate } from "react-router-dom";
import Select, { components } from "react-select";
import getMediaUrl from "../../helpers/getMediaUrl";

type UserOption = {
  value: string;
  label: string;
  avatar?: string | null;
};

const AdminQrLogsPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<AllLogsParams>({
    type: undefined,
    date_from: undefined,
    date_to: undefined,
    user_id: undefined,
  });

  const perPage = 15;

  const { data: logsData, isLoading } = useQuery(
    ["admin-qr-logs", currentPage, filters],
    () =>
      getAllQrLogsApi({
        ...filters,
        page: currentPage,
        per_page: perPage,
      }),
    { keepPreviousData: true }
  );

  const logsResponse = logsData as AllLogsResponse | undefined;
  const logs = logsResponse?.data || [];
  const totalLogs = logsResponse?.total || 0;
  const totalPages = logsResponse?.last_page || 1;

  const handleFilterChange = (key: keyof AllLogsParams, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      type: undefined,
      date_from: undefined,
      date_to: undefined,
      user_id: undefined,
    });
    setCurrentPage(1);
  };

  const getScannableName = (item: AllLogsItem) => {
    if (!item.scannable) return "N/A";
    if ("fname" in item.scannable)
      return `${item.scannable.fname} ${item.scannable.lname}`;
    return item.scannable.name || item.scannable.company_name || "N/A";
  };

  const getScannableType = (item: AllLogsItem) => {
    if (!item.scannable) return "N/A";
    return "fname" in item.scannable ? "User" : "Company";
  };

  // Debounced user search
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const term = searchTerm.trim();
      if (!term) {
        setOptions([]);
        return;
      }

      setLoading(true);
      try {
        const isEmail = term.includes("@");
        const res = await getAllUsersApi({
          nameFilter: isEmail ? "" : term,
          emailFilter: isEmail ? term : "",
          offset: 0,
        });

        const list = (res || []).map((u: any) => ({
          value: String(u.id),
          label:
            `${u.fname || ""} ${u.lname || ""}`.trim() ||
            u.email ||
            String(u.id),
          avatar: u.avatar ?? null,
        }));

        setOptions(list);
      } catch {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  }, [searchTerm]);

  const selectedUserOption = filters.user_id
    ? options.find((o) => o.value === filters.user_id) || {
        value: filters.user_id,
        label: `User ID: ${filters.user_id}`,
        avatar: null,
      }
    : null;

  const columns: Column<AllLogsItem>[] = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
        Cell: ({ value }) => (
          <span className="badge badge-light-primary">{value}</span>
        ),
      },
      {
        Header: "Scanner",
        accessor: (row) =>
          row.scanner ? `${row.scanner.fname} ${row.scanner.lname}` : "Unknown",
        id: "scanner",
        Cell: ({ row }) => {
          const s = row.original.scanner;
          return (
            <div className="d-flex align-items-center">
              {s?.avatar ? (
                <div
                  className="symbol symbol-35px me-3"
                  style={{
                    backgroundImage: `url(${s.avatar})`,
                    backgroundSize: "cover",
                  }}
                />
              ) : (
                <div className="symbol symbol-35px me-3">
                  <span className="symbol-label bg-light-primary text-primary fw-bold">
                    {s?.fname?.[0]}
                    {s?.lname?.[0]}
                  </span>
                </div>
              )}
              <div>
                <div className="fw-bold">
                  {s ? `${s.fname} ${s.lname}` : "Unknown"}
                </div>
                {s?.email && <div className="text-muted fs-7">{s.email}</div>}
              </div>
            </div>
          );
        },
      },
      {
        Header: "Scanned",
        accessor: (row) => getScannableName(row),
        id: "scannable",
        Cell: ({ row }) => {
          const sc = row.original.scannable;
          const type = getScannableType(row.original);
          const img =
            "avatar" in sc && sc.avatar
              ? sc.avatar
              : "logo" in sc && sc.logo
              ? sc.logo
              : null;
          return (
            <div className="d-flex align-items-center">
              {img ? (
                <div
                  className="symbol symbol-35px me-3"
                  style={{
                    backgroundImage: `url(${img})`,
                    backgroundSize: "cover",
                  }}
                />
              ) : (
                <div className="symbol symbol-35px me-3">
                  <span className="symbol-label bg-light-info text-info fw-bold">
                    {type[0]}
                  </span>
                </div>
              )}
              <div>
                <div className="fw-bold">{getScannableName(row.original)}</div>
                <div className="text-muted fs-7">{type}</div>
              </div>
            </div>
          );
        },
      },
      {
        Header: "Type",
        accessor: "type",
        Cell: ({ value }) => (
          <span
            className={`badge ${
              value === "networking"
                ? "badge-light-success"
                : "badge-light-info"
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Scanned At",
        accessor: "scanned_at",
        Cell: ({ row }) => {
          const d = new Date(row.original.scanned_at);
          return (
            <div>
              <div className="fw-semibold">{d.toLocaleDateString()}</div>
              <div className="text-muted fs-7">{d.toLocaleTimeString()}</div>
            </div>
          );
        },
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="d-flex gap-2">
            {row.original.scanner && (
              <button
                className="btn btn-sm btn-light-primary"
                onClick={() => navigate(`/profile/${row.original.scanner.id}`)}
              >
                <KTIcon iconName="user" className="fs-4" />
              </button>
            )}
            {row.original.scannable && (
              <button
                className="btn btn-sm btn-light-info"
                onClick={() => {
                  const type = getScannableType(row.original);
                  const id =
                    "id" in row.original.scannable
                      ? row.original.scannable.id
                      : "";
                  navigate(
                    type === "User" ? `/profile/${id}` : `/company/${id}`
                  );
                }}
              >
                <KTIcon iconName="eye" className="fs-4" />
              </button>
            )}
          </div>
        ),
      },
    ],
    [navigate]
  );

  const data = useMemo(() => logs, [logs]);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  const hasActiveFilters = Object.values(filters).some(
    (v) => v != null && v !== ""
  );

  const Option = (props: any) => (
    <components.Option {...props}>
      <div className="d-flex align-items-center gap-2">
        {props.data.avatar ? (
          <img
            src={getMediaUrl(props.data.avatar)}
            alt=""
            className="rounded-circle"
            width={24}
            height={24}
          />
        ) : (
          <div
            className="bg-light rounded-circle"
            style={{ width: 24, height: 24 }}
          />
        )}
        <span>{props.data.label}</span>
      </div>
    </components.Option>
  );

  const SingleValue = (props: any) => (
    <components.SingleValue {...props}>
      <div className="d-flex align-items-center gap-2">
        {props.data.avatar ? (
          <img
            src={getMediaUrl(props.data.avatar)}
            alt=""
            className="rounded-circle"
            width={20}
            height={20}
          />
        ) : (
          <div
            className="bg-light rounded-circle"
            style={{ width: 20, height: 20 }}
          />
        )}
        <span>{props.data.label}</span>
      </div>
    </components.SingleValue>
  );

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row mb-5">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <div>
            <h1 className="fw-bold mb-1">
              <KTIcon iconName="scan-barcode" className="fs-1 me-2" />
              QR Scan Logs
            </h1>
            <p className="text-muted mb-0">
              Monitor all QR code scanning activity
            </p>
          </div>
          <div className="badge bg-light-primary text-primary fs-6 px-4 py-3">
            {totalLogs} Total Scans
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-white py-4">
              <h3 className="card-title fw-bold mb-0">
                <KTIcon iconName="filter" className="fs-3 me-2" />
                Filters
              </h3>
            </div>
            <div className="card-body">
              <div className="row g-4">
                <div className="col-md-3">
                  <label className="form-label fw-bold">Scan Type</label>
                  <select
                    className="form-select"
                    value={filters.type || ""}
                    onChange={(e) =>
                      handleFilterChange("type", e.target.value || undefined)
                    }
                  >
                    <option value="">All Types</option>
                    <option value="networking">Networking</option>
                    <option value="exhibition">Exhibition</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-bold">From Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={filters.date_from || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "date_from",
                        e.target.value || undefined
                      )
                    }
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-bold">To Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={filters.date_to || ""}
                    onChange={(e) =>
                      handleFilterChange("date_to", e.target.value || undefined)
                    }
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-bold">User</label>
                  <Select
                    isClearable
                    isLoading={loading}
                    options={options}
                    value={selectedUserOption}
                    onInputChange={setSearchTerm}
                    onChange={(opt) =>
                      handleFilterChange("user_id", opt?.value)
                    }
                    components={{ Option, SingleValue }}
                    placeholder="Search by name or email..."
                    styles={{
                      control: (base) => ({ ...base, minHeight: 40 }),
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    menuPortalTarget={document.body}
                  />
                </div>
              </div>

              {hasActiveFilters && (
                <div className="mt-4">
                  <button
                    className="btn btn-light-danger btn-sm"
                    onClick={clearFilters}
                  >
                    <KTIcon iconName="cross" className="fs-4 me-1" />
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-white py-4">
              <h3 className="card-title fw-bold mb-0">All Scan Logs</h3>
            </div>
            <KTCardBody className="py-4">
              {isLoading ? (
                <div className="text-center py-10">
                  <div className="spinner-border text-primary" />
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table
                      className="table table-hover align-middle gs-3"
                      {...getTableProps()}
                    >
                      <thead className="bg-light">
                        <tr className="text-uppercase text-muted fs-7">
                          {headers.map((column) => (
                            <th key={column.id} className="py-3 px-4">
                              {column.render("Header")}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody {...getTableBodyProps()}>
                        {rows.length > 0 ? (
                          rows.map((row) => {
                            prepareRow(row);
                            return (
                              <tr key={row.id}>
                                {row.cells.map((cell) => (
                                  <td
                                    key={cell.column.id}
                                    className="py-3 px-4"
                                  >
                                    {cell.render("Cell")}
                                  </td>
                                ))}
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center py-10">
                              <div className="d-flex flex-column align-items-center">
                                <i className="bi bi-inbox fs-1 text-muted mb-3" />
                                <h5 className="text-muted">No logs found</h5>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center mt-5 flex-wrap gap-3">
                      <div className="text-muted fs-7">
                        Showing {(currentPage - 1) * perPage + 1} to{" "}
                        {Math.min(currentPage * perPage, totalLogs)} of{" "}
                        {totalLogs}
                      </div>
                      <nav>
                        <ul className="pagination mb-0">
                          <li
                            className={`page-item ${
                              currentPage === 1 ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage((p) => p - 1)}
                              disabled={currentPage === 1}
                            >
                              ←
                            </button>
                          </li>
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((p) => (
                            <li
                              key={p}
                              className={`page-item ${
                                p === currentPage ? "active" : ""
                              }`}
                            >
                              <button
                                className="page-link"
                                onClick={() => setCurrentPage(p)}
                              >
                                {p}
                              </button>
                            </li>
                          ))}
                          <li
                            className={`page-item ${
                              currentPage === totalPages ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage((p) => p + 1)}
                              disabled={currentPage === totalPages}
                            >
                              →
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </KTCardBody>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminQrLogsPage;
