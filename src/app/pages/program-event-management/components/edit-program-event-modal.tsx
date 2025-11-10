import { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { updateProgramEvent } from "../../../apis/program-event";
import { getAllSideEvents } from "../../../apis/side-event";
import type { ProgramEvent, ProgramEventRequest } from "../../../types/program-event";
import toast from "react-hot-toast";

interface EditProgramEventModalProps {
  show: boolean;
  event: ProgramEvent | null;
  onHide: () => void;
  onSuccess: () => void;
}

const EditProgramEventModal: React.FC<EditProgramEventModalProps> = ({
  show,
  event,
  onHide,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<ProgramEventRequest>({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    location: "",
    side_event_id: "",
    status: "published",
  });

  const { data: sideEvents } = useQuery("side-events", getAllSideEvents);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        description: event.description || "",
        start_time: event.start_time,
        end_time: event.end_time,
        location: event.location || "",
        side_event_id: event.side_event_id || "",
        status: event.status || "published",
      });
    }
  }, [event]);

  const updateMutation = useMutation(
    ({ id, payload }: { id: string; payload: ProgramEventRequest }) =>
      updateProgramEvent(id, payload),
    {
      onSuccess: () => {
        toast.success("Program event updated successfully");
        onSuccess();
        onHide();
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to update program event"
        );
      },
    }
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!event?.id) return;
    updateMutation.mutate({ id: event.id, payload: formData });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Program Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Title <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter event title"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    placeholder="Enter event description"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Start Time <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    End Time <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Status <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status || "published"}
                    onChange={handleChange}
                    required
                  >
                    <option value="published">Published</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Side Event</Form.Label>
                  <Form.Select
                    name="side_event_id"
                    value={formData.side_event_id || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select a side event (optional)</option>
                    {sideEvents?.map((sideEvent) => (
                      <option key={sideEvent.id} value={sideEvent.id}>
                        {sideEvent.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Location <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location || ""}
                    onChange={handleChange}
                    required
                    placeholder="Enter event location"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        }
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={updateMutation.isLoading || !event?.id}
        >
          {updateMutation.isLoading ? "Updating..." : "Update Event"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProgramEventModal;