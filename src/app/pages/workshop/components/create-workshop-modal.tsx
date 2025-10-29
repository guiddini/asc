import React from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createWorkshop } from "../../../apis/workshop";
import toast from "react-hot-toast";
import { Conference } from "../../../types/conference";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  start_time: yup
    .string()
    .required("Start time is required")
    .test("is-before", "Start time must be before end time", function (value) {
      const { end_time } = this.parent;
      if (!value || !end_time) return true;
      return new Date(value) < new Date(end_time);
    }),
  end_time: yup
    .string()
    .required("End time is required")
    .test("is-after", "End time must be after start time", function (value) {
      const { start_time } = this.parent;
      if (!value || !start_time) return true;
      return new Date(value) > new Date(start_time);
    }),
  location: yup.string().required("Location is required"),
  status: yup.string().required("Status is required"),
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

const CreateWorkshopModal: React.FC<Props> = ({ show, onClose }) => {
  const queryClient = useQueryClient();
  const navigation = useNavigate();
  const createMutation = useMutation({
    mutationFn: createWorkshop,
    onSuccess(data: Conference) {
      queryClient.invalidateQueries("conferences");
      toast.success("Workshop created successfully");
      onClose();
      navigation(`/workshop-management/${data?.id}`);
    },
    onError() {
      toast.error("Failed to create workshop");
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

  const onSubmit = (values: any) => {
    createMutation.mutate({
      ...values,
      start_time: formatForBackend(values.start_time),
      end_time: formatForBackend(values.end_time),
    } as any);
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create Workshop</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              {...register("title")}
              isInvalid={!!errors.title}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title?.message as string}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              {...register("description")}
              isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description?.message as string}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Start time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  {...register("start_time")}
                  isInvalid={!!errors.start_time}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.start_time?.message as string}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>End time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  {...register("end_time")}
                  isInvalid={!!errors.end_time}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.end_time?.message as string}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              {...register("location")}
              isInvalid={!!errors.location}
            />
            <Form.Control.Feedback type="invalid">
              {errors.location?.message as string}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select {...register("status")} isInvalid={!!errors.status}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="canceled">Canceled</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.status?.message as string}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={createMutation.isLoading}
            >
              Close
            </Button>
            <Button type="submit" disabled={createMutation.isLoading}>
              {createMutation.isLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateWorkshopModal;
