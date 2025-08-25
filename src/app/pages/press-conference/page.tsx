import React, { useState, useMemo } from "react";
import { useQuery } from "react-query";
import { listAllPressConferenceRegistrationsApi } from "../../apis/press-conference";
import { PageTitle } from "../../../_metronic/layout/core";
import { TableComponent } from "../../components";
import PressConferenceActions from "./components/press-conference-actions";
import clsx from "clsx";
import ExportMenu from "../../components/export-menu";

export type PressConference = {
  id: string;
  fname: string;
  lname: string;
  email: string;
  phone_number: string;
  occupation: string;
  occupation_place: string;
  created_at: string;
  updated_at: string;
  status: "Pending" | "Accepted" | "Refused";
};

const PressConferencePage = () => {
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Pending" | "Accepted" | "Refused"
  >("All");

  const { isLoading, data } = useQuery({
    queryFn: listAllPressConferenceRegistrationsApi,
    queryKey: ["press-conference-registrations"],
  });

  const list: PressConference[] = data?.data || [];

  const filteredList = useMemo(() => {
    if (filterStatus === "All") return list;
    return list.filter((item) => item.status === filterStatus);
  }, [list, filterStatus]);

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

  const columns = [
    {
      name: "Name",
      selector: (row: PressConference) => row.fname + " " + row.lname,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row: PressConference) => row.email,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row: PressConference) => row?.phone_number,
      sortable: true,
    },
    {
      name: "Occupation",
      selector: (row: PressConference) => row?.occupation,
      sortable: true,
    },
    {
      name: "Institution",
      selector: (row: PressConference) => row?.occupation_place,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: PressConference) => <PressConferenceActions row={row} />,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const statusOptions: ("All" | "Pending" | "Accepted" | "Refused")[] = [
    "All",
    "Pending",
    "Accepted",
    "Refused",
  ];

  return (
    <div>
      <div className="mx-auto d-flex flex-row align-items-center justify-content-center">
        <div
          className="nav-group nav-group-outline bg-white my-4 d-flex flex-row align-items-center justify-content-center p-3"
          style={{
            width: "500px",
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

      <PageTitle>Conférence de Presse</PageTitle>
      <ExportMenu<PressConference>
        data={filteredList}
        columns={columns}
        filename="press-conference-registrations"
      />
      <TableComponent
        columns={columns}
        data={filteredList}
        showCreate={false}
        showExport={false}
        isLoading={isLoading}
        pagination
        showSearch={true}
        searchKeys={[
          "email",
          "fname",
          "lname",
          "phone_number",
          "occupation",
          "occupation_place",
        ]}
      />
    </div>
  );
};

export default PressConferencePage;
