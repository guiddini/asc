import React, { useState } from "react";
import { ConferenceSpeaker } from "../../../types/conference";
import { TableComponent } from "../../../components";
import getMediaUrl from "../../../helpers/getMediaUrl";
import AddSpeakerToConferenceModal from "./add-speaker-to-conference";
import RemoveSpeakerFromConferenceModal from "./remove-speaker-conference-modal";

interface SpeakersTableProps {
  conferenceId: string;
  speakers: ConferenceSpeaker[];
  // Optionally: onSpeakersUpdated?: () => void;
}

export const SpeakersTable: React.FC<SpeakersTableProps> = ({
  conferenceId,
  speakers,
}) => {
  const [showAddSpeakerModal, setShowAddSpeakerModal] = useState(false);
  const [showRemoveSpeakerModal, setShowRemoveSpeakerModal] = useState(false);
  const [speakerToRemove, setSpeakerToRemove] =
    useState<ConferenceSpeaker | null>(null);

  const handleRemoveBtnClick = (speaker: ConferenceSpeaker) => {
    setSpeakerToRemove(speaker);
    setShowRemoveSpeakerModal(true);
  };

  const columns = [
    {
      name: "",
      cell: (row: ConferenceSpeaker) =>
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
      selector: (row: ConferenceSpeaker) => row.fname,
      sortable: true,
    },
    {
      name: "Nom",
      selector: (row: ConferenceSpeaker) => row.lname,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: ConferenceSpeaker) => (
        <button
          onClick={() => handleRemoveBtnClick(row)}
          type="button"
          className="btn btn-danger btn-sm"
        >
          Retirer
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "100px",
    },
  ];

  return (
    <>
      <TableComponent
        columns={columns}
        data={speakers}
        canA={null}
        canI={null}
        showCreate
        onAddClick={() => setShowAddSpeakerModal(true)}
        placeholder="intervenant"
      />

      {showAddSpeakerModal && (
        <AddSpeakerToConferenceModal
          conferenceId={conferenceId}
          show={showAddSpeakerModal}
          onClose={() => setShowAddSpeakerModal(false)}
          onAdded={() => {}}
        />
      )}

      {showRemoveSpeakerModal && (
        <RemoveSpeakerFromConferenceModal
          conferenceId={conferenceId}
          speaker={speakerToRemove}
          show={showRemoveSpeakerModal}
          onClose={() => setShowRemoveSpeakerModal(false)}
          onRemoved={() => {
            setShowRemoveSpeakerModal(false);
            setSpeakerToRemove(null);
            // Optionally: call onSpeakersUpdated if needed
          }}
        />
      )}
    </>
  );
};
