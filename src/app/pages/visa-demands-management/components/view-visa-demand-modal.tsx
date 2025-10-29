import { useQuery } from "react-query";
import { Modal, Button, Table } from "react-bootstrap";
import { showVisaDemandById } from "../../../apis/visa-demand";

type ViewVisaDemandModalProps = {
  show: boolean;
  demandId: string | null;
  onHide: () => void;
};

export default function ViewVisaDemandModal({
  show,
  demandId,
  onHide,
}: ViewVisaDemandModalProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["visa-demand", demandId],
    queryFn: () => showVisaDemandById(demandId!),
    enabled: !!demandId && show,
  });

  const demand = data?.data;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Visa Demand Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <div>Loading demand...</div>
        ) : isError || !demand ? (
          <div>Error loading the visa demand.</div>
        ) : (
          <Table bordered responsive>
            <tbody>
              <tr>
                <th>ID</th>
                <td>{demand.id}</td>
              </tr>
              <tr>
                <th>Status</th>
                <td className="text-capitalize">{demand.status}</td>
              </tr>
              <tr>
                <th>Applicant</th>
                <td>
                  {demand.first_name} {demand.last_name}
                </td>
              </tr>
              <tr>
                <th>Profession</th>
                <td>{demand.profession ?? "-"}</td>
              </tr>
              <tr>
                <th>Company</th>
                <td>{demand.company_name ?? "-"}</td>
              </tr>
              <tr>
                <th>Passport Number</th>
                <td>{demand.passport_number ?? "-"}</td>
              </tr>
              <tr>
                <th>Passport Expiry</th>
                <td>{demand.passport_expiry_date ?? "-"}</td>
              </tr>
              <tr>
                <th>Created At</th>
                <td>{demand.created_at ?? "-"}</td>
              </tr>
              <tr>
                <th>Updated At</th>
                <td>{demand.updated_at ?? "-"}</td>
              </tr>
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
