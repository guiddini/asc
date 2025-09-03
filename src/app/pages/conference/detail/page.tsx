// ConferenceDetailPage.tsx
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { showConferenceById } from "../../../apis/conference";
import ConferenceHeader from "../components/conference-header";
import ConferenceDetailTabs from "../components/conference-detail-tabs";
import { KTCard, KTCardBody } from "../../../../_metronic/helpers";
import { useState } from "react";
import UpdateConferenceModal from "../components/update-conference-modal";

const ConferenceDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateTargetId, setUpdateTargetId] = useState<string | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryFn: () => showConferenceById(id ?? ""),
    queryKey: ["conferences", id],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div
          className="spinner-border text-primary"
          role="status"
          aria-label="Loading"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        Erreur lors du chargement de la conférence.
      </div>
    );
  }

  return (
    <div className="">
      <KTCard className="mb-4">
        <KTCardBody>
          <ConferenceHeader
            conference={data?.conference}
            onUpdate={() => {
              setUpdateTargetId(data?.conference.id);
              setUpdateModalOpen(true);
            }}
          />
        </KTCardBody>
      </KTCard>
      <ConferenceDetailTabs conference={data?.conference} />

      <UpdateConferenceModal
        show={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        conferenceId={updateTargetId ?? ""}
      />
    </div>
  );
};

export default ConferenceDetailPage;
