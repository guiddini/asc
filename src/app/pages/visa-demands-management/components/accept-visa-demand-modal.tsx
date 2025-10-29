import { useMutation, useQueryClient } from "react-query";
import { Modal, Button } from "react-bootstrap";
import { acceptVisaDemand } from "../../../apis/visa-demand";

type AcceptVisaDemandModalProps = {
  show: boolean;
  demandId: string | null;
  onHide: () => void;
  onSuccess?: () => void;
};

export default function AcceptVisaDemandModal({
  show,
  demandId,
  onHide,
  onSuccess,
}: AcceptVisaDemandModalProps) {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: () => acceptVisaDemand({ demand_id: demandId! }),
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
        <Modal.Title>Accept Visa Demand</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to accept this visa demand?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isLoading}>
          Close
        </Button>
        <Button variant="success" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? "Accepting..." : "Accept"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
