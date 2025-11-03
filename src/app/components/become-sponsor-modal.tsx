import React, { useEffect } from "react";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { useMutation } from "react-query";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast, { Toaster } from "react-hot-toast";
import { createContactRequest } from "../apis/contact";
import { ContactRequest, ContactRequestPayload } from "../types/contact";

interface BecomeSponsorModalProps {
  show: boolean;
  onHide: () => void;
}

const BecomeSponsorModal: React.FC<BecomeSponsorModalProps> = ({
  show,
  onHide,
}) => {
  const schema = yup
    .object({
      fname: yup.string().required("First name is required"),
      lname: yup.string().required("Last name is required"),
      email: yup
        .string()
        .email("Please enter a valid email")
        .required("Email is required"),
      phone: yup.string().optional(),
      company_name: yup.string().optional(),
      position: yup.string().optional(),
      previous_sponsor: yup.boolean().optional(),
      message: yup.string().optional(),
      type: yup.mixed<"contact" | "sponsor">().oneOf(["sponsor"]).required(),
    })
    .required();

  type SponsorFormValues = yup.InferType<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SponsorFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      fname: "",
      lname: "",
      email: "",
      phone: "",
      company_name: "",
      position: "",
      previous_sponsor: false,
      message: "",
      type: "sponsor",
    },
  });

  const mutation = useMutation<ContactRequest, unknown, ContactRequestPayload>({
    mutationFn: createContactRequest,
    onSuccess: (data) => {
      toast.success("Thanks! Your sponsor request was submitted successfully.");
      reset();
      onHide();
    },
    onError: () => {
      toast.error("Sorry, something went wrong. Please try again.");
    },
  });

  useEffect(() => {
    if (!show) {
      reset();
    }
  }, [show, reset]);
  const onSubmit = (data: SponsorFormValues) => {
    const payload: ContactRequestPayload = {
      fname: data.fname,
      lname: data.lname,
      email: data.email,
      phone: data.phone,
      company_name: data.company_name,
      position: data.position,
      previous_sponsor: data.previous_sponsor,
      message: data.message,
      type: "sponsor",
    };
    mutation.mutate(payload);
  };

  if (!show) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Toaster position="top-right" />
      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title>Become a Sponsor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group controlId="sponsorFname">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your first name"
                  {...register("fname")}
                  isInvalid={!!errors.fname}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.fname?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="sponsorLname">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your last name"
                  {...register("lname")}
                  isInvalid={!!errors.lname}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.lname?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="sponsorEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="your@email.com"
                  {...register("email")}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="sponsorPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Optional"
                  {...register("phone")}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="sponsorCompany">
                <Form.Label>Company Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Your company"
                  {...register("company_name")}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="sponsorPosition">
                <Form.Label>Position</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Role or title"
                  {...register("position")}
                />
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Form.Group controlId="sponsorPrevious">
                <Form.Check
                  type="checkbox"
                  label="We have sponsored previously"
                  {...register("previous_sponsor")}
                />
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Form.Group controlId="sponsorMessage">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Tell us about your sponsorship interest"
                  {...register("message")}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={onHide}
            disabled={mutation.isLoading}
          >
            Close
          </Button>
          <Button type="submit" variant="primary" disabled={mutation.isLoading}>
            {mutation.isLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Submitting...
              </>
            ) : (
              <>Submit Sponsor Request</>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default BecomeSponsorModal;
