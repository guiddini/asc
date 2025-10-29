import { useMutation, useQueryClient } from "react-query";
import { Modal, Button } from "react-bootstrap";
import { deleteVisaDemand } from "../../../apis/visa-demand";

type DeleteVisaDemandModalProps = {
  show: boolean;
  demandId: string | null;
  onHide: () => void;
  onSuccess?: () => void;
};

export default function DeleteVisaDemandModal({
  show,
  demandId,
  onHide,
  onSuccess,
}: DeleteVisaDemandModalProps) {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: () => deleteVisaDemand({ demand_id: demandId! }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["visa-demands"] }),
        demandId
          ? queryClient.invalidateQueries({
              queryKey: ["visa-demand", demandId],
            })
          : Promise.resolve(),
      ]);
      onSuccess?.();
      onHide();
    },
  });

  const onConfirm = () => {
    if (!demandId) return;
    mutate();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete Visa Demand</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        This action is irreversible. Delete this visa demand?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isLoading}>
          Close
        </Button>
        <Button
          variant="outline-danger"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
