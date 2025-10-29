import moment from "moment";
import { Workshop } from "../../../types/workshop";
import DeleteConfirmationModal from "./delete-workshop-modal";
import CancelConfirmationModal from "./cancel-workshop-modal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ConferenceHeader = ({
  workshop,
  onUpdate,
}: {
  workshop: Workshop;
  onUpdate: () => void;
}) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);

  const navigation = useNavigate();

  return (
    <section aria-labelledby="workshop-title">
      <div className="d-flex justify-content-between align-items-start flex-wrap mb-3 gap-3">
        <h2 id="workshop-title" className="mb-0 flex-grow-1">
          {workshop.title}
        </h2>
        <div className="d-flex gap-2 flex-wrap">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onUpdate}
          >
            Edit
          </button>
          <button
            type="button"
            className="btn btn-outline-warning btn-sm"
            onClick={() => setOpenCancelModal(true)}
          >
            Cancel Workshop
          </button>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => setOpenDeleteModal(true)}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="card-text mb-3">{workshop.description}</p>

        <dl className="row mb-0">
          <dt className="col-sm-3 fw-semibold">Location:</dt>
          <dd className="col-sm-9">{workshop.location}</dd>

          <dt className="col-sm-3 fw-semibold">Start Date:</dt>
          <dd className="col-sm-9">
            {moment(workshop.start_time).format("DD/MM/YYYY HH:mm")}
          </dd>

          <dt className="col-sm-3 fw-semibold">End Date:</dt>
          <dd className="col-sm-9">
            {moment(workshop.end_time).format("DD/MM/YYYY HH:mm")}
          </dd>

          <dt className="col-sm-3 fw-semibold">Status:</dt>
          <dd className="col-sm-9 text-capitalize">{workshop.status}</dd>
        </dl>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        show={openDeleteModal}
        onHide={() => setOpenDeleteModal(false)}
        workshopId={workshop.id}
        workshopTitle={workshop.title}
        onDeleted={() => {
          navigation("/workshop-management");
        }}
      />

      {/* Cancel Confirmation Modal */}
      <CancelConfirmationModal
        show={openCancelModal}
        onHide={() => setOpenCancelModal(false)}
        workshopId={workshop.id}
        workshopTitle={workshop.title}
        onDeleted={() => setOpenCancelModal(false)}
      />
    </section>
  );
};

export default ConferenceHeader;
