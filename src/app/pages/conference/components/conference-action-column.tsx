import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Conference } from "../../../types/conference";
import DeleteConfirmationModal from "./delete-conference-modal";
import CancelConfirmationModal from "./cancel-conference-modal";
import { Link } from "react-router-dom";

interface ConferenceActionColumnProps {
  conference: Conference;
  onEdit: () => void;
  onDeleted: () => void;
  showView?: boolean;
}

const ConferenceActionColumn: React.FC<ConferenceActionColumnProps> = ({
  conference,
  onEdit,
  onDeleted,
  showView = false,
}) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle id="dropdown-basic">Actions</Dropdown.Toggle>

        <Dropdown.Menu>
          {showView && (
            <Dropdown.Item
              as={Link}
              to={`/conferences-management/${conference.id}`}
              className="d-flex align-items-center"
            >
              Voir
            </Dropdown.Item>
          )}
          <Dropdown.Item onClick={onEdit} className="d-flex align-items-center">
            Modifier
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => setOpenCancelModal(true)}
            className="d-flex align-items-center"
          >
            Annuler la conférence
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => setOpenDeleteModal(true)}
            className="d-flex align-items-center"
          >
            Supprimer
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        show={openDeleteModal}
        onHide={() => setOpenDeleteModal(false)}
        conferenceId={conference.id}
        conferenceTitle={conference.title}
        onDeleted={onDeleted}
      />

      {/* Cancel Confirmation Modal */}
      <CancelConfirmationModal
        show={openCancelModal}
        onHide={() => setOpenCancelModal(false)}
        conferenceId={conference.id}
        conferenceTitle={conference.title}
        onDeleted={onDeleted}
      />
    </>
  );
};

export default ConferenceActionColumn;
