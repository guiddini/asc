import { useState } from "react";
import { PageTitle } from "../../../_metronic/layout/core";
import { TableComponent } from "../../components";
import { useQuery } from "react-query";
import { getAllExhibitionDemandsApi } from "../../apis/exhibition";
import type { ExhibitionDemand } from "../../types/exhibition";
import clsx from "clsx";
import ExhibitionRequestActions from "./components/ExhibitionRequestActions";
import { Link } from "react-router-dom";

const ExhibitionRequests = () => {
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "accepted" | "refused" | "paid" | "unpaid"
  >("all");

  // Fetch filtered list from API based on selected status
  const { isLoading, data } = useQuery({
    queryFn: () => getAllExhibitionDemandsApi({ status: filterStatus }),
    queryKey: ["exhibition-requests", filterStatus],
    keepPreviousData: true,
  });

  // API now returns a bare array; no nested `data` field
  const list: ExhibitionDemand[] = (data as ExhibitionDemand[]) || [];

  const statusOptions: (
    | "all"
    | "pending"
    | "accepted"
    | "refused"
    | "paid"
    | "unpaid"
  )[] = ["all", "pending", "accepted", "refused", "paid", "unpaid"];

  const getTypeLabel = (type: string) =>
    type === "connect_desk"
      ? "Connect Desk"
      : type === "premium_exhibition_space"
      ? "Premium Exhibition Space"
      : type === "scale_up_booth"
      ? "Scale Up Booth"
      : type;

  const formatCurrency = (value: number | string | null) => {
    if (value === null) return "-";
    const numeric = typeof value === "string" ? Number(value) : value;
    if (numeric === null || Number.isNaN(numeric)) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(numeric);
  };

  const columns = [
    {
      name: "Actions",
      minWidth: "100px",
      wrap: true,
      cell: (row: ExhibitionDemand) => (
        <div>
          <ExhibitionRequestActions row={row} />
        </div>
      ),
    },
    {
      name: "Company",
      selector: (row: ExhibitionDemand) => row.company?.name,
      sortable: true,
      minWidth: "180px",
      wrap: true,
      cell: (row: ExhibitionDemand) => (
        <div>
          <Link
            to={`/company/${row.company?.id}`}
            className="text-decoration-none text-black"
          >
            <span className="fw-semibold text-hover-primary">
              {row.company?.name}
            </span>
          </Link>
        </div>
      ),
    },
    {
      name: "Phone",
      selector: (row: ExhibitionDemand) => row.company?.phone_1 || "-",
      sortable: true,
      minWidth: "140px",
      wrap: true,
      cell: (row: ExhibitionDemand) => <div>{row.company?.phone_1 || "-"}</div>,
    },
    {
      name: "Country",
      selector: (row: ExhibitionDemand) => row.company?.country?.name_en || "-",
      sortable: true,
      minWidth: "140px",
      wrap: true,
      cell: (row: ExhibitionDemand) => (
        <div>{row.company?.country?.name_en || "-"}</div>
      ),
    },
    {
      name: "Founded",
      selector: (row: ExhibitionDemand) => {
        if (!row.company?.founded_date) return "-";
        return new Date(row.company.founded_date).getFullYear().toString();
      },
      sortable: true,
      minWidth: "110px",
      wrap: true,
      cell: (row: ExhibitionDemand) => (
        <div>
          {row.company?.founded_date
            ? new Date(row.company.founded_date).getFullYear()
            : "-"}
        </div>
      ),
    },
    {
      name: "Revenue 2024",
      selector: (row: ExhibitionDemand) => row.company?.revenue_2024 || 0,
      sortable: true,
      minWidth: "200px",
      wrap: true,
      cell: (row: ExhibitionDemand) => (
        <div>{formatCurrency(row.company?.revenue_2024)}</div>
      ),
    },
    {
      name: "Revenue 2025",
      selector: (row: ExhibitionDemand) => row.company?.revenue_2025 || 0,
      sortable: true,
      minWidth: "200px",
      wrap: true,
      cell: (row: ExhibitionDemand) => (
        <div>{formatCurrency(row.company?.revenue_2025)}</div>
      ),
    },
    {
      name: "Total Funds Raised",
      selector: (row: ExhibitionDemand) => row.company?.total_funds_raised || 0,
      sortable: true,
      minWidth: "200px",
      wrap: true,
      cell: (row: ExhibitionDemand) => (
        <div>{formatCurrency(row.company?.total_funds_raised)}</div>
      ),
    },
    {
      name: "Exhibition Type",
      selector: (row: ExhibitionDemand) => row.exhibition_type,
      sortable: true,
      minWidth: "180px",
      wrap: true,
      cell: (row: ExhibitionDemand) => (
        <div>
          <span className="fw-semibold">
            {getTypeLabel(row.exhibition_type)}
          </span>
        </div>
      ),
    },
    {
      name: "Payment Method",
      selector: (row: ExhibitionDemand) => row.payment_method || "-",
      sortable: true,
      minWidth: "160px",
      wrap: true,
      cell: (row: ExhibitionDemand) => <div>{row.payment_method || "-"}</div>,
    },
    {
      name: "Status",
      selector: (row: ExhibitionDemand) => row.status,
      sortable: true,
      minWidth: "120px",
      wrap: true,
      cell: (row: ExhibitionDemand) => (
        <div>
          <span
            className={`px-2 py-1 rounded-pill small fw-medium ${
              row.status === "pending"
                ? "bg-warning text-dark"
                : row.status === "accepted"
                ? "bg-success text-white"
                : row.status === "refused"
                ? "bg-danger text-white"
                : row.status === "paid"
                ? "bg-primary text-white"
                : row.status === "unpaid"
                ? "bg-secondary text-white"
                : "bg-light text-dark"
            }`}
          >
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </span>
        </div>
      ),
    },
    {
      name: "Date",
      selector: (row: ExhibitionDemand) => row.created_at,
      sortable: true,
      minWidth: "120px",
      wrap: true,
      cell: (row: ExhibitionDemand) => (
        <div>{new Date(row.created_at).toLocaleDateString()}</div>
      ),
    },
  ];

  return (
    <div className="container-fluid">
      <PageTitle>Exhibition Requests</PageTitle>

      <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
        {statusOptions.map((status) => (
          <button
            key={status}
            className={clsx(
              "btn btn-sm fw-semibold text-capitalize px-4 py-2 border",
              filterStatus === status
                ? "btn-custom-purple-dark text-white"
                : "btn-light"
            )}
            onClick={() => setFilterStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>

      <TableComponent
        columns={columns}
        data={list}
        isLoading={isLoading}
        pagination
        showCreate={false}
        showExport={false}
        showSearch={true}
        searchKeys={[
          "company.name",
          "company.phone_1",
          "company.country.name_en",
          "company.revenue_2024",
          "company.revenue_2025",
          "company.total_funds_raised",
          "exhibition_type",
          "status",
        ]}
      />
    </div>
  );
};

export default ExhibitionRequests;
