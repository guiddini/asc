import React from "react";
import { Modal, Button, Spinner, Alert, Badge } from "react-bootstrap";
import { useQuery } from "react-query";
import { getMyPitchDeck, downloadMyPitchDeck } from "../../../apis/pitch-deck";
import type { PitchDeckStatus } from "../../../types/pitch-deck";

type Props = {
  show: boolean;
  onHide: () => void;
};

function statusVariant(s: PitchDeckStatus) {
  switch (s) {
    case "accepted":
      return "success";
    case "pending":
      return "warning";
    case "refused":
      return "danger";
    default:
      return "secondary";
  }
}

const PitchDeckDetailsModal: React.FC<Props> = ({ show, onHide }) => {
  const { data, isLoading, isError, refetch } = useQuery(
    ["my-pitch-deck"],
    getMyPitchDeck,
    { enabled: show }
  );

  const deck = data?.pitch_deck || null;
  const fileUrl = data?.file_url || null;

  // Do not serve the file inline; provide a direct download action instead.
  const [downloading, setDownloading] = React.useState(false);

  const handleDownload = React.useCallback(async () => {
    try {
      setDownloading(true);
      const blob = await downloadMyPitchDeck();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      // Derive a sensible filename from title or path
      const ext = deck?.file_path?.match(/\.[a-z0-9]+$/i)?.[0] || "";
      const name = (deck?.title?.trim() || "pitch-deck") + ext || "pitch-deck";
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 0);
    } catch (e) {
      console.error("Failed to download pitch deck", e);
    } finally {
      setDownloading(false);
    }
  }, [deck]);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Pitch Deck Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading && (
          <div className="d-flex align-items-center justify-content-center py-4">
            <Spinner animation="border" role="status" />
          </div>
        )}

        {isError && (
          <Alert variant="danger" className="mb-0">
            Failed to load pitch deck details.
            <Button size="sm" variant="outline-danger" className="ms-2" onClick={() => refetch()}>
              Retry
            </Button>
          </Alert>
        )}

        {!isLoading && !isError && !deck && (
          <Alert variant="info" className="mb-0">
            You have not uploaded any pitch deck yet.
          </Alert>
        )}

        {!isLoading && !isError && deck && (
          <div className="d-flex flex-column gap-3">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="fw-semibold">Status</div>
                <Badge bg={statusVariant(deck.status) as any}>
                  {deck.status === "accepted"
                    ? "Approved"
                    : deck.status === "pending"
                    ? "In Review"
                    : "Refused"}
                </Badge>
              </div>
              <div className="text-end">
                <div className="fw-semibold">Uploaded</div>
                <div className="text-muted">
                  {deck.created_at
                    ? new Date(deck.created_at).toLocaleString()
                    : "—"}
                </div>
              </div>
            </div>

            <div>
              <div className="fw-semibold">Title</div>
              <div className="text-muted">{deck.title || "—"}</div>
            </div>

            <div>
              <div className="fw-semibold">Company</div>
              <div className="text-muted">
                {deck.company?.name || "—"}
              </div>
            </div>

            <div>
              <div className="fw-semibold">File Path</div>
              <div className="text-muted">{deck.file_path || "—"}</div>
            </div>

            <div className="pt-2">
              <Button variant="primary" onClick={handleDownload} disabled={downloading}>
                {downloading ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-2" />
                    Downloading...
                  </>
                ) : (
                  "Download File"
                )}
              </Button>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PitchDeckDetailsModal;