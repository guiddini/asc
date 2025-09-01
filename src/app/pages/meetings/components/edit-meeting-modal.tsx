import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
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
  locations: string[];
}

const EditMeetingModal: React.FC<EditMeetingModalProps> = ({
  show,
  onHide,
  meeting,
  onSubmit,
  loading,
  locations,
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
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-pencil me-2 text-primary" />
          Edit Meeting
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <i className="bi bi-chat-text me-1" />
                  Meeting Topic
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  placeholder="Enter meeting topic"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <i className="bi bi-calendar me-1" />
                  Start Time
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
                  <i className="bi bi-clock me-1" />
                  End Time
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
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <i className="bi bi-geo-alt me-1" />
                  Location
                </Form.Label>
                <Form.Select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose a location...</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              />
              Updating...
            </>
          ) : (
            <>
              <i className="bi bi-check-circle me-1" />
              Update Meeting
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditMeetingModal;
