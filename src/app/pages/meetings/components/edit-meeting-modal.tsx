import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Card, InputGroup } from "react-bootstrap";
import { MeetingDetail } from "../../../types/meetings";

interface EditMeetingModalProps {
  show: boolean;
  onHide: () => void;
  meeting: MeetingDetail;
  onSubmit: (formData: {
    topic: string;
    start_time: string;
    end_time: string;
    location: string;
  }) => void;
  loading: boolean;
}

const EditMeetingModal: React.FC<EditMeetingModalProps> = ({
  show,
  onHide,
  meeting,
  onSubmit,
  loading,
}) => {
  const [formData, setFormData] = useState({
    topic: "",
    start_time: "",
    end_time: "",
    location: "",
  });

  useEffect(() => {
    if (meeting) {
      setFormData({
        topic: meeting.topic,
        start_time: new Date(meeting.start_time).toISOString().slice(0, 16),
        end_time: new Date(meeting.end_time).toISOString().slice(0, 16),
        location: meeting.location,
      });
    }
  }, [meeting]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="d-flex align-items-center">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle me-3"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#e7f3ff",
            }}
          >
            <i className="bi bi-pencil-square text-primary" style={{ fontSize: "1.2rem" }} />
          </div>
          <div>
            <h5 className="mb-0 fw-bold">Edit Meeting</h5>
            <small className="text-muted">Update meeting details</small>
          </div>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="px-4 py-4">
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4">
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold text-dark mb-2">
                      <i className="bi bi-chat-text-fill me-2 text-primary" />
                      Meeting Topic
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="topic"
                      value={formData.topic}
                      onChange={handleChange}
                      placeholder="Enter the meeting topic..."
                      required
                      className="border-2"
                      style={{
                        borderRadius: "8px",
                        fontSize: "0.95rem",
                        padding: "12px 16px",
                      }}
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold text-dark mb-2">
                      <i className="bi bi-calendar-event-fill me-2 text-success" />
                      Start Time
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-2">
                        <i className="bi bi-clock text-success" />
                      </InputGroup.Text>
                      <Form.Control
                        type="datetime-local"
                        name="start_time"
                        value={formData.start_time}
                        onChange={handleChange}
                        required
                        className="border-2"
                        style={{
                          borderRadius: "0 8px 8px 0",
                          fontSize: "0.95rem",
                          padding: "12px 16px",
                        }}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold text-dark mb-2">
                      <i className="bi bi-calendar-x-fill me-2 text-danger" />
                      End Time
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-2">
                        <i className="bi bi-clock text-danger" />
                      </InputGroup.Text>
                      <Form.Control
                        type="datetime-local"
                        name="end_time"
                        value={formData.end_time}
                        onChange={handleChange}
                        required
                        className="border-2"
                        style={{
                          borderRadius: "0 8px 8px 0",
                          fontSize: "0.95rem",
                          padding: "12px 16px",
                        }}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold text-dark mb-2">
                      <i className="bi bi-geo-alt-fill me-2 text-warning" />
                      Location
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-2">
                        <i className="bi bi-building text-warning" />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Enter location (e.g., VIP Lounge, Main Hall B)"
                        required
                        className="border-2"
                        style={{
                          borderRadius: "0 8px 8px 0",
                          fontSize: "0.95rem",
                          padding: "12px 16px",
                        }}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Modal.Body>
      
      <Modal.Footer className="border-0 px-4 pb-4">
        <div className="d-flex gap-3 w-100 justify-content-end">
          <Button
            variant="outline-secondary"
            onClick={onHide}
            className="px-4 py-2 fw-semibold"
            style={{
              borderRadius: "8px",
              border: "2px solid",
            }}
            disabled={loading}
          >
            <i className="bi bi-x-circle me-2" />
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 fw-semibold"
            style={{
              borderRadius: "8px",
              border: "2px solid transparent",
              minWidth: "160px",
            }}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
                Updating...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle-fill me-2" />
                Update Meeting
              </>
            )}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default EditMeetingModal;
