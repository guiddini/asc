import React from "react";
import { KTIcon } from "../../../../../_metronic/helpers";

const StaffTableActionColumn = ({
  openEditModal,
  openViewModal,
  openDeleteModal,
}: {
  openEditModal?: (any) => any;
  openViewModal?: (any) => any;
  openDeleteModal?: (any) => any;
}) => {
  return (
    <div className="d-flex gap-4">
      {/* <div className="cursor-pointer" onClick={openViewModal}>
        <KTIcon
          iconName="eye"
          className="fs-1 cursor-pointer m-0 text-success"
        />
      </div> */}

      {/* <div className="cursor-pointer disabled " onClick={openEditModal}>
        <KTIcon
          iconName="pencil"
          className={`fs-1 cursor-pointer m-0 text-primary disabled`}
        />
      </div> */}
      <div className="cursor-pointer" onClick={openDeleteModal}>
        <KTIcon
          iconName="trash"
          className="fs-1 cursor-pointer m-0 text-danger"
        />
      </div>
    </div>
  );
};

export default StaffTableActionColumn;
