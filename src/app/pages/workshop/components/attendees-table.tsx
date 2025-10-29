// attendees-table.tsx (workshop)
import React from "react";
import { WorkshopAttendee } from "../../../types/workshop";
import { TableComponent } from "../../../components";
import getMediaUrl from "../../../helpers/getMediaUrl";

interface AttendeesTableProps {
  attendees: WorkshopAttendee[];
}

export const AttendeesTable: React.FC<AttendeesTableProps> = ({
  attendees,
}) => {
  const columns = [
    {
      name: "",
      cell: (row: WorkshopAttendee) =>
        row.avatar ? (
          <img
            src={getMediaUrl(row.avatar)}
            alt={`${row.fname} ${row.lname}`}
            className="rounded-circle"
            style={{ width: "40px", height: "40px", objectFit: "cover" }}
          />
        ) : (
          <div
            className="bg-secondary text-white rounded-circle d-flex justify-content-center align-items-center"
            style={{ width: "40px", height: "40px" }}
            aria-label={`${row.fname} ${row.lname} avatar placeholder`}
          >
            {row.fname[0]}
            {row.lname[0]}
          </div>
        ),
      width: "60px",
    },
    {
      name: "First Name",
      selector: (row: WorkshopAttendee) => row.fname,
      sortable: true,
    },
    {
      name: "Last Name",
      selector: (row: WorkshopAttendee) => row.lname,
      sortable: true,
    },
  ];

  return <TableComponent columns={columns} data={attendees} />;
};