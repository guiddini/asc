import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { showWorkshopById } from "../../../apis/workshop";
import WorkshopHeader from "../components/workshop-header";
import WorkshopDetailTabs from "../components/workshop-detail-tabs";
import { KTCard, KTCardBody } from "../../../../_metronic/helpers";
import { useState } from "react";
import UpdateWorkshopModal from "../components/update-workshop-modal";
import type { Workshop } from "../../../types/workshop";

function WorkshopDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateTargetId, setUpdateTargetId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["show-workshop", id],
    queryFn: () => showWorkshopById(id ?? ""),
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
      <div className="alert alert-danger">Error loading the workshop.</div>
    );
  }

  return (
    <div className="">
      <KTCard className="mb-4">
        <KTCardBody>
          <WorkshopHeader
            workshop={data?.workshop as Workshop}
            onUpdate={() => {
              setUpdateTargetId(data?.workshop.id);
              setUpdateModalOpen(true);
            }}
          />
        </KTCardBody>
      </KTCard>
      <WorkshopDetailTabs workshop={data?.workshop as Workshop} />

      <UpdateWorkshopModal
        show={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        workshopId={updateTargetId ?? ""}
      />
    </div>
  );
}

export default WorkshopDetailPage;
