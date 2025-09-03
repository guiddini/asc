// attendees-table.tsx
import React from "react";
import { ConferenceAttendee } from "../../../types/conference";
import { TableComponent } from "../../../components";
import getMediaUrl from "../../../helpers/getMediaUrl";

interface AttendeesTableProps {
  attendees: ConferenceAttendee[];
}

export const AttendeesTable: React.FC<AttendeesTableProps> = ({
  attendees,
}) => {
  const columns = [
    {
      name: "",
      cell: (row: ConferenceAttendee) =>
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
      name: "Prénom",
      selector: (row: ConferenceAttendee) => row.fname,
      sortable: true,
    },
    {
      name: "Nom",
      selector: (row: ConferenceAttendee) => row.lname,
      sortable: true,
    },
  ];

  return <TableComponent columns={columns} data={attendees} />;
};
