// speakers-table.tsx (workshop)
import React, { useState } from "react";
import { TableComponent } from "../../../components";
import { WorkshopSpeaker } from "../../../types/workshop";
import getMediaUrl from "../../../helpers/getMediaUrl";
import AddSpeakerToWorkshopModal from "./add-speaker-to-workshop";
import RemoveSpeakerFromWorkshopModal from "./remove-speaker-workshop-modal";

interface SpeakersTableProps {
  workshopId: string;
  speakers: WorkshopSpeaker[];
}

export const SpeakersTable: React.FC<SpeakersTableProps> = ({
  workshopId,
  speakers,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<WorkshopSpeaker | null>(null);

  const columns = [
    {
      name: "",
      cell: (row: WorkshopSpeaker) =>
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
      selector: (row: WorkshopSpeaker) => row.fname,
      sortable: true,
    },
    {
      name: "Last Name",
      selector: (row: WorkshopSpeaker) => row.lname,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: WorkshopSpeaker) => (
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => setRemoveTarget(row)}
        >
          Remove
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <>
      <div className="d-flex justify-content-end mb-3">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => setShowAddModal(true)}
        >
          Add Speaker
        </button>
      </div>

      <TableComponent columns={columns} data={speakers} />

      <AddSpeakerToWorkshopModal
        workshopId={workshopId}
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdded={() => setShowAddModal(false)}
      />
      <RemoveSpeakerFromWorkshopModal
        workshopId={workshopId}
        speaker={removeTarget}
        show={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onRemoved={() => setRemoveTarget(null)}
      />
    </>
  );
};