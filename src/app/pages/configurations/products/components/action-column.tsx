import React from "react";
import { KTIcon } from "../../../../../_metronic/helpers";

const ActionColumn = ({
  openAcceptModal,
  openViewModal,
  openDelete,
  hidePublishButton,
  hideRefusButton,
}: {
  openAcceptModal: (any) => any;
  openViewModal: (any) => any;
  openDelete: (any) => any;
  hidePublishButton?: boolean;
  hideRefusButton?: boolean;
}) => {
  return (
    <div className="d-flex gap-4">
      <div className="cursor-pointer" onClick={openViewModal}>
        <KTIcon
          iconName="eye"
          className="fs-1 cursor-pointer m-0 text-success"
        />
      </div>

      <div className="cursor-pointer" onClick={openAcceptModal}>
        <KTIcon
          iconName="check-square"
          className={`fs-1 cursor-pointer m-0 text-primary ${
            hidePublishButton && "opacity-25"
          }`}
        />
      </div>
      <div className="cursor-pointer" onClick={openDelete}>
        <KTIcon
          iconName="cross-square"
          className={`fs-1 cursor-pointer m-0 text-danger ${
            hideRefusButton && "opacity-25"
          }`}
        />
      </div>
    </div>
  );
};
export default ActionColumn;
