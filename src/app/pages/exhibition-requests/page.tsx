import React, { useState, useMemo } from "react";
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
    "all" | "pending" | "accepted" | "refused"
  >("all");

  const { isLoading, data } = useQuery({
    queryFn: getAllExhibitionDemandsApi,
    queryKey: ["exhibition-requests"],
  });

  const list: ExhibitionDemand[] = data?.data || [];

  const statusOptions: ("all" | "pending" | "accepted" | "refused")[] = [
    "all",
    "pending",
    "accepted",
    "refused",
  ];

  const getStatusCounts = useMemo(() => {
    const counts = { all: list.length, pending: 0, accepted: 0, refused: 0 };
    list.forEach((item) => {
      const status = item.status.toLowerCase();
      if (counts[status as keyof typeof counts] !== undefined)
        counts[status as keyof typeof counts]++;
    });
    return counts;
  }, [list]);

  const filteredList = useMemo(() => {
    if (filterStatus === "all") return list;
    return list.filter((item) => item.status.toLowerCase() === filterStatus);
  }, [list, filterStatus]);

  const getTypeLabel = (type: string) =>
    type === "connect_desk"
      ? "Connect Desk"
      : type === "premium_exhibition_space"
      ? "Premium Exhibition Space"
      : type;

  const columns = [
    {
      name: "Company",
      selector: (row: ExhibitionDemand) => row.company?.name,
      sortable: true,
      cell: (row: ExhibitionDemand) => (
        <Link
          to={`/company/${row.company?.id}`}
          className="text-decoration-none text-black"
        >
          <span className="fw-semibold text-hover-primary">
            {row.company?.name}
          </span>
        </Link>
      ),
    },
    {
      name: "Phone",
      selector: (row: ExhibitionDemand) => row.company?.phone_1 || "-",
      sortable: true,
    },
    {
      name: "Exhibition Type",
      cell: (row: ExhibitionDemand) => (
        <span className="fw-semibold">{getTypeLabel(row.exhibition_type)}</span>
      ),
      selector: (row: ExhibitionDemand) => row.exhibition_type,
      sortable: true,
    },
    {
      name: "Payment Method",
      selector: (row: ExhibitionDemand) => row.payment_method || "-",
      sortable: true,
    },
    {
      name: "Status",
      cell: (row: ExhibitionDemand) => (
        <span
          className={`px-2 py-1 rounded-pill small fw-medium ${
            row.status === "pending"
              ? "bg-warning text-dark"
              : row.status === "accepted"
              ? "bg-success text-white"
              : "bg-danger text-white"
          }`}
        >
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
      selector: (row: ExhibitionDemand) => row.status,
      sortable: true,
    },
    {
      name: "Payment Status",
      cell: (row: ExhibitionDemand) => (
        <span
          className={`px-2 py-1 rounded-pill small fw-medium ${
            row.transaction?.status === "Proccessing"
              ? "bg-warning text-dark"
              : row.transaction?.status === "Success"
              ? "bg-success text-white"
              : "bg-danger text-white"
          }`}
        >
          {row.transaction?.status || "Unpaid"}
        </span>
      ),
      selector: (row: ExhibitionDemand) => row.transaction?.status || "Unpaid",
      sortable: true,
    },
    {
      name: "Date",
      cell: (row: ExhibitionDemand) =>
        new Date(row.created_at).toLocaleDateString(),
      selector: (row: ExhibitionDemand) => row.created_at,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: ExhibitionDemand) => <ExhibitionRequestActions row={row} />,
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
            {status} ({getStatusCounts[status]})
          </button>
        ))}
      </div>

      <TableComponent
        columns={columns}
        data={filteredList}
        isLoading={isLoading}
        pagination
        showCreate={false}
        showExport={false}
        showSearch={true}
        searchKeys={[
          "company.name",
          "company.phone_1",
          "exhibition_type",
          "status",
        ]}
      />
    </div>
  );
};

export default ExhibitionRequests;
