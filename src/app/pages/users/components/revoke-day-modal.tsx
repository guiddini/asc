import { useMutation, useQuery, useQueryClient } from "react-query";
import { revokeDayAccess, listUserDays } from "../../../apis/permission";
import { Day } from "../../../types/permission";
import toast from "react-hot-toast";
import { Alert, Button, Modal, Spinner } from "react-bootstrap";
import { KTIcon } from "../../../../_metronic/helpers";

interface RevokeDayAccessModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  userId: string;
  userName: string;
}

const RevokeDayAccessModal: React.FC<RevokeDayAccessModalProps> = ({
  isOpen,
  setIsOpen,
  userId,
  userName,
}) => {
  const queryClient = useQueryClient();

  const { data: userDaysData, isLoading: loadingDays } = useQuery(
    ["user-days", userId],
    () => listUserDays(userId),
    {
      enabled: isOpen,
    }
  );

  const revokeMutation = useMutation(
    (day: Day) => revokeDayAccess(userId, day),
    {
      onSuccess: (data) => {
        toast.success(data.message || "Day access revoked successfully");
        queryClient.invalidateQueries(["user-days", userId]);
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to revoke day access"
        );
      },
    }
  );

  const handleRevoke = (day: Day) => {
    if (
      window.confirm(`Are you sure you want to revoke access to Day ${day}?`)
    ) {
      revokeMutation.mutate(day);
    }
  };

  const grantedDays = userDaysData?.days || [];

  return (
    <Modal show={isOpen} onHide={() => setIsOpen(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <KTIcon iconName="calendar-remove" className="fs-2 me-2" />
          Revoke Day Access
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <p className="text-muted mb-2">
            Revoke day access for <strong>{userName}</strong>
          </p>
        </div>

        {loadingDays ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
            <p className="mt-3 text-muted">Loading granted days...</p>
          </div>
        ) : grantedDays.length === 0 ? (
          <Alert variant="info">
            <KTIcon iconName="information" className="fs-2 me-2" />
            This user has no granted days yet.
          </Alert>
        ) : (
          <div className="d-flex flex-column gap-3">
            {grantedDays.map((day) => (
              <div
                key={day}
                className="d-flex align-items-center justify-content-between p-3 border rounded bg-light"
              >
                <div className="d-flex align-items-center">
                  <KTIcon
                    iconName="calendar"
                    className="fs-2 text-primary me-3"
                  />
                  <span className="fw-bold">Day {day}</span>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRevoke(day as Day)}
                  disabled={revokeMutation.isLoading}
                >
                  {revokeMutation.isLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <>
                      <KTIcon iconName="trash" className="fs-3" />
                      Revoke
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={() => setIsOpen(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RevokeDayAccessModal;
