import { Modal, Button } from "react-bootstrap";
import { useMutation } from "react-query";
import { deleteProgramEvent } from "../../../apis/program-event";
import toast from "react-hot-toast";

interface DeleteProgramEventModalProps {
  show: boolean;
  eventId: string | null;
  onHide: () => void;
  onSuccess: () => void;
}

const DeleteProgramEventModal: React.FC<DeleteProgramEventModalProps> = ({
  show,
  eventId,
  onHide,
  onSuccess,
}) => {
  const deleteMutation = useMutation(() => deleteProgramEvent(eventId!), {
    onSuccess: () => {
      toast.success("Program event deleted successfully");
      onSuccess();
      onHide();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete program event");
    },
  });

  const handleDelete = () => {
    if (eventId) {
      deleteMutation.mutate();
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete Program Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete this program event? This action cannot be undone.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={handleDelete}
          disabled={deleteMutation.isLoading || !eventId}
        >
          {deleteMutation.isLoading ? "Deleting..." : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteProgramEventModal;