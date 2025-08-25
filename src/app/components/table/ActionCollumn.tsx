import { KTIcon } from "../../../_metronic/helpers";

const ActionCollumn = ({
  openEditModal,
  openViewModal,
  disableUpdate = false,
}: {
  openEditModal: (any) => any;
  openViewModal: (any) => any;
  disableUpdate?: boolean;
}) => {
  return (
    <div className="d-flex gap-4">
      <div className="cursor-pointer" onClick={openViewModal}>
        <KTIcon
          iconName="eye"
          className="fs-1 cursor-pointer m-0 text-success"
        />
      </div>

      <div className="cursor-pointer disabled " onClick={openEditModal}>
        <KTIcon
          iconName="pencil"
          className={`fs-1 cursor-pointer m-0 text-primary disabled ${
            disableUpdate && "opacity-50 cursor-not-allowed"
          }`}
        />
      </div>
      <div className="cursor-pointer">
        <KTIcon
          iconName="trash"
          className="fs-1 cursor-pointer m-0 text-danger"
        />
      </div>
    </div>
  );
};

export { ActionCollumn };
