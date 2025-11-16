import React from "react";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import toast from "react-hot-toast";
import { createHotel } from "../../../apis/hotels";

type CreateHotelFormValues = {
  name: string;
  logo?: FileList;
  address?: string;
  map?: string;
};

export const CreateHotelModal: React.FC<{
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}> = ({ show, onHide, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateHotelFormValues>({
    defaultValues: { name: "", address: "", map: "" },
  });

  const { mutateAsync, isLoading } = useMutation(
    (formData: FormData) => createHotel(formData),
    {
      onSuccess: () => {
        toast.success("Hotel created successfully");
        reset();
        onSuccess();
      },
      onError: () => {
        toast.error("Failed to create hotel");
      },
    }
  );

  const onSubmit = async (values: CreateHotelFormValues) => {
    if (!values.name?.trim()) {
      toast.error("Name is required");
      return;
    }
    const formData = new FormData();
    formData.append("name", values.name.trim());
    if (values.address) formData.append("address", values.address);
    if (values.map) formData.append("map", values.map);
    if (values.logo && values.logo.length > 0) {
      formData.append("logo", values.logo[0]);
    }
    await mutateAsync(formData);
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Create Hotel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="gy-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  {...register("name", { required: true })}
                  placeholder="Hotel name"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Logo</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  {...register("logo")}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control {...register("address")} placeholder="Address" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Map URL</Form.Label>
                <Form.Control
                  {...register("map")}
                  placeholder="https://maps.google.com/..."
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="mt-5 d-flex justify-content-end gap-3">
            <Button variant="light" onClick={onHide}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isSubmitting}>
              {isLoading ? <Spinner size="sm" animation="border" /> : "Create"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
