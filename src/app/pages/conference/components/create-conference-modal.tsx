import React from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createConference } from "../../../apis/conference";
import { getAllSideEvents } from "../../../apis/side-event";
import toast from "react-hot-toast";
import { Conference } from "../../../types/conference";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  start_time: yup.string().required("Start time is required"),
  end_time: yup
    .string()
    .required("End time is required")
    .test("is-after", "End time must be after start time", function (value) {
      const { start_time } = this.parent;
      return new Date(value) > new Date(start_time);
    }),
  location: yup.string().required("Location is required"),
  status: yup.string().required("Status is required"),
  side_event_id: yup.string().nullable(),
});

const formatForBackend = (dtLocal: string) => {
  const d = new Date(dtLocal);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
};

interface Props {
  show: boolean;
  onClose: () => void;
}

const CreateConferenceModal: React.FC<Props> = ({ show, onClose }) => {
  const queryClient = useQueryClient();
  const navigation = useNavigate();

  // Fetch side events
  const { data: sideEvents } = useQuery("side-events", getAllSideEvents);

  const mutation = useMutation(createConference, {
    onSuccess(data: Conference) {
      queryClient.invalidateQueries("conferences");
      toast.success("Conference created successfully");
      onClose();
      navigation(`/conferences-management/${data?.id}`);
    },
    onError() {
      toast.error("Failed to create the conference");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      status: "draft",
    },
  });

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      start_time: formatForBackend(data.start_time),
      end_time: formatForBackend(data.end_time),
    };
    mutation.mutate(payload);
  };

  return (
    <Modal show={show} onHide={onClose} backdrop="static" size="lg" centered>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Header closeButton>
          <Modal.Title>Create conference</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              isInvalid={!!errors.title}
              {...register("title")}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              isInvalid={!!errors.description}
              {...register("description")}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Start time</Form.Label>
            <Form.Control
              type="datetime-local"
              isInvalid={!!errors.start_time}
              {...register("start_time")}
            />
            <Form.Control.Feedback type="invalid">
              {errors.start_time?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>End time</Form.Label>
            <Form.Control
              type="datetime-local"
              isInvalid={!!errors.end_time}
              {...register("end_time")}
            />
            <Form.Control.Feedback type="invalid">
              {errors.end_time?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              isInvalid={!!errors.title}
              {...register("location")}
            />
            <Form.Control.Feedback type="invalid">
              {errors.location?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Status <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select {...register("status")} isInvalid={!!errors.status}>
              <option value="">Select status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="cancelled">Cancelled</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.status?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Side Event</Form.Label>
            <Form.Select {...register("side_event_id")}>
              <option value="">Select a side event (optional)</option>
              {sideEvents?.map((sideEvent) => (
                <option key={sideEvent.id} value={sideEvent.id}>
                  {sideEvent.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={mutation.isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={mutation.isLoading}>
            {mutation.isLoading ? "Creating..." : "Create conference"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateConferenceModal;
