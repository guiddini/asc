import { useMutation, useQueryClient } from "react-query";
import { Modal, Button } from "react-bootstrap";
import { refuseVisaDemand } from "../../../apis/visa-demand";

type RefuseVisaDemandModalProps = {
  show: boolean;
  demandId: string | null;
  onHide: () => void;
  onSuccess?: () => void;
};

export default function RefuseVisaDemandModal({
  show,
  demandId,
  onHide,
  onSuccess,
}: RefuseVisaDemandModalProps) {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: () => refuseVisaDemand({ demand_id: demandId! }),
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
        <Modal.Title>Refuse Visa Demand</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to refuse this visa demand?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isLoading}>
          Close
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? "Refusing..." : "Refuse"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
