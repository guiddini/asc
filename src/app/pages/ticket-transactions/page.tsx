import React, { useState, useMemo } from "react";
import { useQuery } from "react-query";
import { PageTitle } from "../../../_metronic/layout/core";
import { TableComponent } from "../../components";
import { getAdminTicketTransactionsApi } from "../../apis";
import clsx from "clsx";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";

export type TicketTransaction = {
  id: string;
  ticket_id: string;
  user_id: string;
  order_id: string | null;
  gateway_order_id: string | null;
  gateway_bool: boolean | null;
  gateway_response_message: string | null;
  gateway_error_code: string | null;
  gateway_code: string | null;
  status: "Free" | "Success" | string;
  email: string | null;
  quantity: number;
  total: number;
  created_at: string;
  updated_at: string;
  ticket: {
    id: string;
    name: string;
    slug: string;
    price: string;
  };
  user: {
    id: string;
    fname: string;
    lname: string;
    email: string;
    avatar: string | null;
    can_create_company: number;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    ticket_count: number;
    user_has_ticket_id: string | null;
  };
};

const TicketTransactionsPage = () => {
  const [filterTicketType, setFilterTicketType] = useState<string>("All");

  const { isLoading, data } = useQuery({
    queryFn: getAdminTicketTransactionsApi,
    queryKey: ["ticket-transactions"],
  });

  const list: TicketTransaction[] = data?.data || [];

  const ticketTypes = [
    "All",
    "Free",
    "Basic",
    "Entreprise Starter",
    "Entreprise Essenciel",
    "Entreprise All Inclusive",
  ];

  const getTicketTypeCounts = useMemo(() => {
    const counts = {
      All: list.length,
      Free: 0,
      Basic: 0,
      "Entreprise Starter": 0,
      "Entreprise Essenciel": 0,
      "Entreprise All Inclusive": 0,
    };

    list.forEach((item) => {
      if (item.ticket?.name) {
        counts[item.ticket.name] = (counts[item.ticket.name] || 0) + 1;
      }
    });

    return counts;
  }, [list]);

  const filteredList = useMemo(() => {
    if (filterTicketType === "All") return list;
    return list.filter((item) => item.ticket?.name === filterTicketType);
  }, [list, filterTicketType]);

  const formatDataForExport = (data: TicketTransaction[]) => {
    return data.map((item) => ({
      "First Name": item.user?.fname || "",
      "Last Name": item.user?.lname || "",
      Email: item.email || item.user?.email || "",
      "Ticket Type": item.ticket?.name || "",
    }));
  };

  const exportToExcel = () => {
    const exportData = formatDataForExport(filteredList);
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ticket Transactions");
    XLSX.writeFile(workbook, "Ticket_Transactions.xlsx");
  };
  const columns = [
    {
      name: "Ticket",
      selector: (row: TicketTransaction) => row?.ticket?.name,
      sortable: true,
    },
    {
      name: "First Name",
      selector: (row: TicketTransaction) => row?.user?.fname || "- -",
      sortable: true,
    },
    {
      name: "Last Name",
      selector: (row: TicketTransaction) => row?.user?.lname || "- -",
      sortable: true,
    },
    {
      name: "Email",
      selector: (row: TicketTransaction) =>
        row?.email || row?.user?.email || "- -",
      sortable: true,
    },
    {
      name: "Quantity",
      selector: (row: TicketTransaction) => row.quantity,
      sortable: true,
    },
    {
      name: "Total Amount",
      selector: (row: TicketTransaction) => row?.total,
      sortable: true,
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-end my-3">
        <CSVLink
          data={formatDataForExport(filteredList)}
          filename={"Ticket_Transactions.csv"}
          className="btn btn-primary me-2"
        >
          Export CSV
        </CSVLink>
        <button onClick={exportToExcel} className="btn btn-success">
          Export Excel
        </button>
      </div>
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
          {ticketTypes.map((type) => (
            <button
              key={type}
              className={clsx("btn btn-color-gray-600 px-4 py-2 me-2", {
                "btn-active btn-custom-purple-dark text-white":
                  filterTicketType === type,
              })}
              onClick={(e) => {
                e.preventDefault();
                setFilterTicketType(type);
              }}
            >
              {type} ({getTicketTypeCounts[type] || 0})
            </button>
          ))}
        </div>
      </div>
      <PageTitle>Ticket Transactions</PageTitle>
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
          "user.email",
          "user.fname",
          "user.lname",
          "ticket.name",
        ]}
      />
    </div>
  );
};

export default TicketTransactionsPage;
