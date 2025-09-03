import moment from "moment";
import { Conference } from "../../../types/conference";
import DeleteConfirmationModal from "./delete-conference-modal";
import CancelConfirmationModal from "./cancel-conference-modal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ConferenceHeader = ({
  conference,
  onUpdate,
}: {
  conference: Conference;
  onUpdate: () => void;
}) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);

  const navigation = useNavigate();

  return (
    <section aria-labelledby="conference-title">
      <div className="d-flex justify-content-between align-items-start flex-wrap mb-3 gap-3">
        <h2 id="conference-title" className="mb-0 flex-grow-1">
          {conference.title}
        </h2>
        <div className="d-flex gap-2 flex-wrap">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onUpdate}
          >
            Modifier
          </button>
          <button
            type="button"
            className="btn btn-outline-warning btn-sm"
            onClick={() => setOpenCancelModal(true)}
          >
            Annuler la conférence
          </button>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => setOpenDeleteModal(true)}
          >
            Supprimer
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="card-text mb-3">{conference.description}</p>

        <dl className="row mb-0">
          <dt className="col-sm-3 fw-semibold">Lieu :</dt>
          <dd className="col-sm-9">{conference.location}</dd>

          <dt className="col-sm-3 fw-semibold">Date de début :</dt>
          <dd className="col-sm-9">
            {moment(conference.start_time).format("DD/MM/YYYY HH:mm")}
          </dd>

          <dt className="col-sm-3 fw-semibold">Date de fin :</dt>
          <dd className="col-sm-9">
            {moment(conference.end_time).format("DD/MM/YYYY HH:mm")}
          </dd>

          <dt className="col-sm-3 fw-semibold">Statut :</dt>
          <dd className="col-sm-9 text-capitalize">{conference.status}</dd>
        </dl>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        show={openDeleteModal}
        onHide={() => setOpenDeleteModal(false)}
        conferenceId={conference.id}
        conferenceTitle={conference.title}
        onDeleted={() => {
          navigation("/conferences-management");
        }}
      />

      {/* Cancel Confirmation Modal */}
      <CancelConfirmationModal
        show={openCancelModal}
        onHide={() => setOpenCancelModal(false)}
        conferenceId={conference.id}
        conferenceTitle={conference.title}
        onDeleted={() => setOpenCancelModal(false)}
      />
    </section>
  );
};

export default ConferenceHeader;
