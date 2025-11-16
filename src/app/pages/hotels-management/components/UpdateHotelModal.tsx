import React from "react";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import toast from "react-hot-toast";
import { updateHotel } from "../../../apis/hotels";
import { Hotel } from "../../../types/hotel";

type UpdateHotelFormValues = {
  name?: string;
  logo?: FileList;
  address?: string;
  map?: string;
};

export const UpdateHotelModal: React.FC<{
  hotel: Hotel;
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}> = ({ hotel, show, onHide, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateHotelFormValues>({
    defaultValues: {
      name: hotel.name || "",
      address: hotel.address || "",
      map: hotel.map || "",
    },
  });

  const { mutateAsync, isLoading } = useMutation(
    (formData: FormData) => updateHotel(hotel.id, formData),
    {
      onSuccess: () => {
        toast.success("Hotel created successfully");
        onSuccess();
      },
      onError: () => {
        toast.error("Failed to create hotel");
      },
    }
  );

  const onSubmit = async (values: UpdateHotelFormValues) => {
    const formData = new FormData();
    if (values.name) formData.append("name", values.name);
    if (values.address) formData.append("address", values.address);
    if (values.map) formData.append("map", values.map);
    // Append logo only if a new file is selected; otherwise do not send to keep existing.
    if (values.logo && values.logo.length > 0) {
      formData.append("logo", values.logo[0]);
    }
    await mutateAsync(formData);
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Update Hotel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="gy-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control {...register("name")} />
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
                <Form.Control {...register("address")} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Map URL</Form.Label>
                <Form.Control {...register("map")} />
              </Form.Group>
            </Col>
          </Row>
          <div className="mt-5 d-flex justify-content-end gap-3">
            <Button variant="light" onClick={onHide}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isSubmitting}>
              {isLoading ? <Spinner size="sm" animation="border" /> : "Update"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
