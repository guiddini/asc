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
    "all" | "pending" | "accepted" | "refused" | "paid" | "unpaid"
  >("all");

  const { isLoading, data } = useQuery({
    queryFn: getAllExhibitionDemandsApi,
    queryKey: ["exhibition-requests"],
  });

  const list: ExhibitionDemand[] = data?.data || [];

  const statusOptions: (
    | "all"
    | "pending"
    | "accepted"
    | "refused"
    | "paid"
    | "unpaid"
  )[] = ["all", "pending", "accepted", "refused", "paid", "unpaid"];

  const getStatusCounts = useMemo(() => {
    const counts = {
      all: list.length,
      pending: 0,
      accepted: 0,
      refused: 0,
      paid: 0,
      unpaid: 0,
    };
    list.forEach((item) => {
      const status = item.status.toLowerCase();
      if (counts[status as keyof typeof counts] !== undefined) {
        counts[status as keyof typeof counts]++;
      }
      const isPaid = item.transaction?.status === "Success";
      if (isPaid) counts.paid++;
      else counts.unpaid++;
    });
    return counts;
  }, [list]);

  const filteredList = useMemo(() => {
    if (filterStatus === "all") return list;
    if (filterStatus === "paid")
      return list.filter((item) => item.transaction?.status === "Success");
    if (filterStatus === "unpaid")
      return list.filter((item) => item.transaction?.status !== "Success");
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
              : row.status === "rejected"
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
      ),
      selector: (row: ExhibitionDemand) => row.status,
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
