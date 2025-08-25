import { useState } from "react";
import { PressConference } from "../page";
import { Button, Modal } from "react-bootstrap";
import { Check, Download, X } from "lucide-react";
import { useMutation, useQueryClient } from "react-query";
import {
  acceptPressConferenceRegistration,
  rejectPressConferenceRegistration,
  downloadPressConferenceInvitation,
} from "../../../apis/press-conference";
import toast from "react-hot-toast";

const PressConferenceActions = ({ row }: { row: PressConference }) => {
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const queryClient = useQueryClient();

  const acceptMutation = useMutation(acceptPressConferenceRegistration, {
    onSuccess: () => {
      queryClient.invalidateQueries("press-conference-registrations");
      setShowAcceptModal(false);
      toast.success("Inscription acceptée avec succès", {
        duration: 9000,
      });
    },
    onError: () => {
      toast.error("Erreur lors de l'acceptation de l'inscription", {
        duration: 9000,
      });
    },
  });

  const rejectMutation = useMutation(rejectPressConferenceRegistration, {
    onSuccess: () => {
      queryClient.invalidateQueries("press-conference-registrations");
      setShowRejectModal(false);
      toast.success("Inscription rejetée avec succès", {
        duration: 9000,
      });
    },
    onError: () => {
      toast.error("Erreur lors du rejet de l'inscription", {
        duration: 9000,
      });
    },
  });

  const downloadMutation = useMutation(downloadPressConferenceInvitation, {
    onSuccess: (response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `invitation_${row?.fname}_${row?.lname}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Invitation téléchargée avec succès", {
        duration: 9000,
      });
    },
    onError: () => {
      toast.error("Erreur lors du téléchargement de l'invitation", {
        duration: 9000,
      });
    },
  });

  const handleAccept = () => {
    if (row.status === "Pending") {
      acceptMutation.mutate(row?.id);
    }
  };

  const handleReject = () => {
    if (row.status === "Pending") {
      rejectMutation.mutate(row?.id);
    }
  };

  const handleDownload = () => {
    downloadMutation.mutate(row?.id);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <Check
        color={row.status === "Pending" ? "#59efb2" : "#ccc"}
        onClick={() => row.status === "Pending" && setShowAcceptModal(true)}
        role="button"
        style={{ cursor: row.status === "Pending" ? "pointer" : "not-allowed" }}
      />

      <X
        color={row.status === "Pending" ? "#f8285a" : "#ccc"}
        onClick={() => row.status === "Pending" && setShowRejectModal(true)}
        role="button"
        style={{ cursor: row.status === "Pending" ? "pointer" : "not-allowed" }}
      />

      <Download onClick={handleDownload} color="#f6c000" role="button" />

      {/* Accept Confirmation Modal */}
      <Modal
        show={showAcceptModal && row.status === "Pending"}
        onHide={() => setShowAcceptModal(false)}
        centered
        dialogClassName="modal-dialog modal-dialog-centered mw-450px"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmer l'acceptation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir accepter cette inscription à la conférence de
          presse ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAcceptModal(false)}>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleAccept}
            disabled={acceptMutation.isLoading}
          >
            {acceptMutation.isLoading ? "Acceptation en cours..." : "Accepter"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Reject Confirmation Modal */}
      <Modal
        show={showRejectModal && row.status === "Pending"}
        onHide={() => setShowRejectModal(false)}
        centered
        dialogClassName="modal-dialog modal-dialog-centered mw-450px"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmer le rejet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir rejeter cette inscription à la conférence de
          presse ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Annuler
          </Button>
          <Button
            variant="danger"
            onClick={handleReject}
            disabled={rejectMutation.isLoading}
          >
            {rejectMutation.isLoading ? "Rejet en cours..." : "Rejeter"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PressConferenceActions;
