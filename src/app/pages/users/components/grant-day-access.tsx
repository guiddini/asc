import { useState } from "react";
import { grantDayAccess } from "../../../apis/permission";
import { Day } from "../../../types/permission";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { KTIcon } from "../../../../_metronic/helpers";

interface GrantDayAccessModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  userId: string;
  userName: string;
}

const GrantDayAccessModal: React.FC<GrantDayAccessModalProps> = ({
  isOpen,
  setIsOpen,
  userId,
  userName,
}) => {
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const queryClient = useQueryClient();

  const grantMutation = useMutation((day: Day) => grantDayAccess(userId, day), {
    onSuccess: (data) => {
      toast.success(data.message || "Day access granted successfully");
      queryClient.invalidateQueries(["user-days", userId]);
      setIsOpen(false);
      setSelectedDay(null);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to grant day access"
      );
    },
  });

  const handleSubmit = () => {
    if (!selectedDay) {
      toast.error("Please select a day");
      return;
    }
    grantMutation.mutate(selectedDay);
  };

  return (
    <Modal show={isOpen} onHide={() => setIsOpen(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <KTIcon iconName="calendar-add" className="fs-2 me-2" />
          Grant Day Access
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <p className="text-muted mb-2">
            Grant access to <strong>{userName}</strong> for a specific day.
          </p>
        </div>

        <Form.Group>
          <Form.Label className="fw-bold">Select Day</Form.Label>
          <div className="d-flex gap-3 mt-3">
            {[1, 2, 3].map((day) => (
              <div
                key={day}
                className={`flex-fill text-center p-4 border rounded cursor-pointer ${
                  selectedDay === day
                    ? "border-primary bg-light-primary"
                    : "border-secondary"
                }`}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedDay(day as Day)}
              >
                <KTIcon
                  iconName="calendar"
                  className={`fs-1 ${
                    selectedDay === day ? "text-primary" : "text-muted"
                  }`}
                />
                <div className="fw-bold mt-2">Day {day}</div>
              </div>
            ))}
          </div>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="light"
          onClick={() => setIsOpen(false)}
          disabled={grantMutation.isLoading}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!selectedDay || grantMutation.isLoading}
        >
          {grantMutation.isLoading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Granting...
            </>
          ) : (
            "Grant Access"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GrantDayAccessModal;
