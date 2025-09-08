import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { KTIcon } from "../../../../_metronic/helpers";
import DevTalentDayViewModal from "./dev-talent-day-view-modal";
import { CompanyJobApplication } from "../company-job-applications";

const DevTalentDayColumn = (props: CompanyJobApplication) => {
  const [showAccept, setShowAccept] = useState<boolean>(false);

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
          <Dropdown.Item
            onClick={(e) => {
              e.preventDefault();
              setShowAccept(true);
            }}
            className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
          >
            <KTIcon
              iconName="eye"
              className={`fs-1 cursor-pointer m-0 text-primary`}
            />
            <span className="text-muted mt-1 ms-2">View</span>
          </Dropdown.Item>
        </div>
      </Dropdown.Menu>

      <DevTalentDayViewModal
        isOpen={showAccept}
        setIsOpen={setShowAccept}
        job={props}
        key={props?.id}
      />
    </Dropdown>
  );
};

export default DevTalentDayColumn;
