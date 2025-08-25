import { Ticket } from "../../../../types/user";
import { Dropdown } from "react-bootstrap";
import { KTIcon } from "../../../../../_metronic/helpers";
import AssignNewTicketModal from "../assign-new-ticket/assign-new-ticket-modal";
import { useState } from "react";

const UnassignedTicketAction = ({
  row,
  setUpdate,
  refetch,
}: {
  row: Ticket;
  setUpdate: any;
  refetch: any;
}) => {
  const [selectedTicketToUpdate, setSelectedTicketToUpdate] =
    useState<Ticket | null>(null);

  return (
    <Dropdown placement="top-start">
      <Dropdown.Toggle
        variant="transparent"
        color="#fff"
        id="post-dropdown"
        className="btn btn-icon btn-color-gray-500 btn-active-color-primary justify-content-end"
      >
        <i className="ki-duotone ki-dots-square fs-1">
          <span className="path1"></span>
          <span className="path2"></span>
          <span className="path3"></span>
          <span className="path4"></span>
        </i>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <div className="p-2">
          {/* RESET PASSWORD */}
          <Dropdown.Item
            onClick={(e) => {
              e.preventDefault();
              setSelectedTicketToUpdate(row);
            }}
            className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
          >
            <KTIcon
              iconName="pencil"
              className={`fs-1 cursor-pointer m-0 text-warning`}
            />
            <span className="text-muted mt-1 ms-2">Me assigner ce ticket</span>
          </Dropdown.Item>
        </div>
      </Dropdown.Menu>
      {selectedTicketToUpdate && (
        <AssignNewTicketModal
          setIsOpen={setSelectedTicketToUpdate}
          refetch={refetch}
          ticket={selectedTicketToUpdate}
          isOpen={selectedTicketToUpdate === null ? false : true}
        />
      )}
    </Dropdown>
  );
};

export default UnassignedTicketAction;
