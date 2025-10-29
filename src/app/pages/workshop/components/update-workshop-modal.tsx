import React, { useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { updateWorkshop, showWorkshopById } from "../../../apis/workshop";
import toast from "react-hot-toast";

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
});

const toDateTimeLocal = (input: string) => {
  const d = new Date(input);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
};

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
  workshopId: string;
}

type UpdateWorkshopPayload = {
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  status: string;
};

const UpdateWorkshopModal: React.FC<Props> = ({
  show,
  onClose,
  workshopId,
}) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery(
    ["workshop", workshopId],
    () => showWorkshopById(workshopId),
    { enabled: show, retry: false }
  );

  const mutation = useMutation(
    (payload: UpdateWorkshopPayload) =>
      updateWorkshop(workshopId, payload as any),
    {
      onSuccess() {
        queryClient.invalidateQueries("workshops");
        toast.success("Workshop updated successfully");
        onClose();
      },
      onError() {
        toast.error("Failed to update the workshop");
      },
    }
  );

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (data?.workshop) {
      reset({
        title: data.workshop.title,
        description: data.workshop.description,
        start_time: toDateTimeLocal(data.workshop.start_time),
        end_time: toDateTimeLocal(data.workshop.end_time),
        location: data.workshop.location,
        status: data.workshop.status,
      });
    }
  }, [data, reset]);

  const onSubmit = (values: UpdateWorkshopPayload) => {
    mutation.mutate({
      ...values,
      start_time: formatForBackend(values.start_time),
      end_time: formatForBackend(values.end_time),
    });
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Workshop</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading && (
          <div className="d-flex justify-content-center py-4">
            <Spinner animation="border" role="status" aria-hidden="true" />
            <span className="visually-hidden">Loading workshop...</span>
          </div>
        )}
        {error && <Alert variant="danger">Error loading workshop.</Alert>}

        {!isLoading && !error && (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                {...register("title")}
                isInvalid={!!errors.title}
              />
              <Form.Control.Feedback type="invalid">
                {errors.title?.message}
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
                {errors.description?.message}
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
                    {errors.start_time?.message}
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
                    {errors.end_time?.message}
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
                {errors.location?.message}
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
                {errors.status?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="secondary"
                onClick={onClose}
                disabled={mutation.isLoading}
              >
                Close
              </Button>
              <Button type="submit" disabled={mutation.isLoading}>
                {mutation.isLoading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Updating...
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default UpdateWorkshopModal;
