import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Conference } from "../../../types/conference";
import DeleteWorkshopModal from "./delete-workshop-modal";
import CancelWorkshopModal from "./cancel-workshop-modal";
import { Link } from "react-router-dom";

interface WorkshopActionColumnProps {
  conference: Conference;
  onEdit: () => void;
  onDeleted: () => void;
  showView?: boolean;
}

const WorkshopActionColumn: React.FC<WorkshopActionColumnProps> = ({
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
              to={`/workshop-management/${conference.id}`}
              className="d-flex align-items-center"
            >
              View
            </Dropdown.Item>
          )}
          <Dropdown.Item onClick={onEdit} className="d-flex align-items-center">
            Edit
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => setOpenCancelModal(true)}
            className="d-flex align-items-center"
          >
            Cancel workshop
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => setOpenDeleteModal(true)}
            className="d-flex align-items-center"
          >
            Delete
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <DeleteWorkshopModal
        show={openDeleteModal}
        onHide={() => setOpenDeleteModal(false)}
        conferenceId={conference.id}
        conferenceTitle={conference.title}
        onDeleted={onDeleted}
      />

      <CancelWorkshopModal
        show={openCancelModal}
        onHide={() => setOpenCancelModal(false)}
        conferenceId={conference.id}
        conferenceTitle={conference.title}
        onDeleted={onDeleted}
      />
    </>
  );
};

export default WorkshopActionColumn;
