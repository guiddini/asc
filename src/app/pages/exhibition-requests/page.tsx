import React, { useState, useMemo } from "react";
import { PageTitle } from "../../../_metronic/layout/core";
import { TableComponent } from "../../components";
import { useQuery } from "react-query";
import { getAllExhibitionDemandsApi } from "../../apis/exhibition";
import type { ExhibitionDemand } from "../../types/exhibition";
import clsx from "clsx";
import { getStandTypeLabel } from "../../utils/standsData";
import ExhibitionRequestActions from "./components/ExhibitionRequestActions";

const ExhibitionRequests = () => {
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Pending" | "Accepted" | "Refused"
  >("All");

  const { isLoading, data } = useQuery({
    queryFn: getAllExhibitionDemandsApi,
    queryKey: ["exhibition-requests"],
  });

  const list: ExhibitionDemand[] = data?.data || [];

  const statusOptions: ("All" | "Pending" | "Accepted" | "Refused")[] = [
    "All",
    "Pending",
    "Accepted",
    "Refused",
  ];

  const getStatusCounts = useMemo(() => {
    const counts = {
      All: list.length,
      Pending: 0,
      Accepted: 0,
      Refused: 0,
    };
    list.forEach((item) => {
      counts[item.status]++;
    });
    return counts;
  }, [list]);

  const filteredList = useMemo(() => {
    if (filterStatus === "All") return list;
    return list.filter((item) => item.status === filterStatus);
  }, [list, filterStatus]);

  const columns = [
    {
      name: "Company",
      selector: (row: ExhibitionDemand) => row.company?.name,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row: ExhibitionDemand) => row.company?.phone_1,
      sortable: true,
    },
    {
      name: "Stand Type",
      selector: (row: ExhibitionDemand) => getStandTypeLabel(row.stand_type),
      sortable: true,
    },
    {
      name: "Stand Size",
      selector: (row: ExhibitionDemand) => `${row.stand_size} m²`,
      sortable: true,
    },
    {
      name: "Payment Type",
      cell: (row: ExhibitionDemand) => row?.transaction?.payment_type,
      selector: (row: ExhibitionDemand) => row.status,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row: ExhibitionDemand) => (
        <span
          className={`px-2 py-1 rounded-pill small fw-medium ${
            row.status === "Pending"
              ? "bg-warning text-dark"
              : row.status === "Accepted"
              ? "bg-success"
              : "bg-danger text-white"
          }`}
        >
          {row.status}
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
              ? "bg-success"
              : "bg-danger text-white"
          }`}
        >
          {row?.transaction?.status || "Unpaid"}
        </span>
      ),
      selector: (row: ExhibitionDemand) => row.status,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row: ExhibitionDemand) => row.created_at,
      cell: (row: ExhibitionDemand) =>
        new Date(row.created_at).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: ExhibitionDemand) => <ExhibitionRequestActions row={row} />,
      sortable: false,
    },
  ];

  return (
    <div>
      <div className="mx-auto d-flex flex-row align-items-center justify-content-center">
        <div
          className="nav-group nav-group-outline bg-white my-4 d-flex flex-row align-items-center justify-content-center p-3"
          style={{
            width: "auto",
            maxWidth: "100%",
            overflowX: "auto",
          }}
          data-kt-buttons="true"
        >
          {statusOptions.map((status) => (
            <button
              key={status}
              className={clsx("btn btn-color-gray-600 px-4 py-2 me-2", {
                "btn-active btn-custom-purple-dark text-white":
                  filterStatus === status,
              })}
              onClick={(e) => {
                e.preventDefault();
                setFilterStatus(status);
              }}
            >
              {status} ({getStatusCounts[status]})
            </button>
          ))}
        </div>
      </div>

      <PageTitle>Exhibition Requests</PageTitle>
      <TableComponent
        columns={columns}
        data={filteredList}
        showCreate={false}
        showExport={false}
        isLoading={isLoading}
        pagination
        showSearch={true}
        searchKeys={[
          "company.name",
          "company.phone_1",
          "stand_type",
          "stand_size",
          "status",
        ]}
      />
    </div>
  );
};

export default ExhibitionRequests;
